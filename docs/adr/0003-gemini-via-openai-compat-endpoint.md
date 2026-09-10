# 0003: Gemini as the default LLM provider, via its OpenAI-compatible endpoint

## Status
Accepted (2026-09-10)

## Context
The backend's default video-analysis and itinerary-generation path used
OpenAI (`gpt-4o`), with Groq as an already-supported alternate provider.
There's no budget for OpenAI usage on this deploy. The codebase already
abstracts LLM calls behind a `version_configs` dict
(`backend/src/function/video_analysis/shared/const.py`) keyed by
provider name, each entry holding a `base_url`/`api_key`/model names -
this pattern exists specifically so a request can pass `base_url` to the
standard `openai` Python client (or raw `chat/completions` HTTP calls) and
work against any OpenAI-compatible API.

## Decision
Add a `"gemini"` entry to `version_configs` pointing at Gemini's
OpenAI-compatible endpoint (`https://generativelanguage.googleapis.com/v1beta/openai`,
model `gemini-2.5-flash`), and make it the default `version` everywhere
that previously defaulted to `"openai"` (video analysis, transcript
analysis, itinerary suggestion, and the frontend's request). The
`"openai"` and `"groq"` options are left in place, just no longer
defaulted to.

The Gemini API key is a dedicated key created under `vietrochack-lab`
(`swipeandfly-gemini`), restricted to `generativelanguage.googleapis.com`,
stored in Secret Manager (`swipeandfly-gemini-api-key`) and mounted into
Cloud Run via `--set-secrets` rather than a plain env var.

## Consequences
- No code path requires an OpenAI key to function; the app runs on the
  Gemini free tier by default.
- Because Gemini's OpenAI-compat endpoint is a drop-in `base_url` swap,
  no new SDK dependency was needed - `openai` package stays in
  `requirements.txt` and is reused as-is.
- `openai_request.py`'s image-analysis dispatch (`_block_analyze_images`
  vs `_split_analyze_images`) previously branched on `version == "openai"`
  specifically; it now defaults to the block (single multi-image request)
  path for anything that isn't `"groq"`, since Gemini - like OpenAI -
  handles multiple images in one request well.
