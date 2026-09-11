# Backlog

Known non-blocking issues and cleanup, found while migrating to
`vietrochack-lab` (2026-09-10). Check items off as they land.

- [ ] `generate_itinerary` raises an uncaught `KeyError` (crashes to a
  generic 500, instead of a clean error response) if `video_urls` doesn't
  resolve to at least one valid, analyzable video - the per-video error
  dict it gets back (`{"error": ...}`) doesn't have the `"summary"`/
  `"activities"` keys the code assumes every entry has.
  (`backend/src/routes/itinerary_routes.py`) **Same root cause as the
  bug fixed 2026-09-10 in `analyze_from_url`** (`analyze_videos.py`):
  the openai/gemini analysis template only ever returns
  `{content, location}`, never `activities` - `itinerary_routes.py:86`
  (`analysis["activities"]`) will `KeyError` on every *successful*
  openai/gemini analysis too, not just failed ones. Worth fixing both
  call sites together next time someone's in this code - see
  `docs/progress/20260910.md`.
- [ ] `video_analysis_call()` and the commented-out `suggest_videos_http`
  route in `backend/src/routes/video_analysis_routes.py` look dead -
  worth confirming and removing if so.
- [ ] `backend/README.md` is stale leftover from a differently-named
  predecessor project (mentions "TripPlanner-itinerary-backend", an
  OpenAI key requirement, and an `.aws` folder that no longer applies),
  and the file itself is mis-encoded (UTF-16, renders as garbled text
  in most viewers).
- [ ] `frontend/src/pages/FormScreen/FormSubmitGenerate.tsx` and
  `backend/src/routes/itinerary_routes.py` hardcode/default a specific
  LLM provider version string in a few places - now that there are three
  real options (openai/groq/gemini), consider a single source of truth
  instead of the value being duplicated across frontend and backend.
- [ ] No Devpost link found anywhere in the repo to add to the footer
  per the migration guide's branding checklist - add one if the project
  has one.
- [x] `swipeandfly.world` (the pre-migration VM deploy) - confirmed dead
  by Vuong (2026-09-10); its deploy path is removed (see ADR 0004).
- [x] **Split the single-container Docker architecture into a plain
  separate backend + frontend deploy**, dropping Docker/Cloud
  Build/nginx entirely (2026-09-10, see ADR 0004 and
  `docs/progress/20260910.md`).
- [x] **Verify the backend's new Buildpacks-based Cloud Run build
  actually works for video analysis.** Confirmed 2026-09-10 by live-
  testing `/video_analysis/analyze_videos` against a real TikTok URL:
  `cv2.VideoCapture` and `cv2.imencode` both work fine under Buildpacks
  without `libgl1`/`libglib2.0-0` being explicitly installed - the risk
  flagged in ADR 0004 didn't materialize. (Getting to a genuinely
  successful analysis also required fixing two unrelated pre-existing
  bugs - a corrupted Secret Manager value and the `activities`-KeyError
  above - see `docs/progress/20260910.md` for the full chain.)
- [ ] `swipeandfly-server` hit `Memory limit of 512 MiB exceeded with
  514 MiB used` once during 2026-09-10's live-testing (didn't recur on
  the successful run). Marginal, not chased down yet - if it recurs,
  add `--memory` to the `gcloud run deploy` calls in `scripts/deploy.sh`
  / `.github/workflows/deploy.yml`.
- [ ] The Gemini API key value was inadvertently printed in full to a
  terminal session on 2026-09-10 (via `xxd`, while debugging a trailing-
  CRLF issue in the Secret Manager value - see `docs/progress/20260910.md`).
  Rotate `swipeandfly-gemini-api-key` per `docs/runbook.md`'s rotation
  steps. Vuong was told and opted to do this himself later.
