# Backlog

Known non-blocking issues and cleanup, found while migrating to
`vietrochack-lab` (2026-09-10). Check items off as they land.

- [ ] `generate_itinerary` raises an uncaught `KeyError` (crashes to a
  generic 500, instead of a clean error response) if `video_urls` doesn't
  resolve to at least one valid, analyzable video - the per-video error
  dict it gets back (`{"error": ...}`) doesn't have the `"summary"`/
  `"activities"` keys the code assumes every entry has.
  (`backend/src/routes/itinerary_routes.py`)
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
- [ ] `swipeandfly.world` (the pre-migration VM deploy) is still live and
  untouched - decommission it once `swipeandfly.vietrochack.com` is
  confirmed stable.
- [ ] **Split the single-container Docker architecture into a plain
  separate backend + frontend deploy**, dropping Docker/Cloud Build/nginx
  entirely: Flask as its own Cloud Run (or Cloud Functions) service,
  React built and served directly as static files by Firebase Hosting
  (Hosting rewriting only `/api/**` to the backend, per the migration
  guide's default topology - see ADR 0001 for why it's a single
  container today instead). Requested by Vuong (2026-09-10) as a
  follow-up, explicitly deferred for now to save session usage. Would
  remove `Dockerfile`, `cloudbuild.yaml`, the Cloud Build build step in
  `scripts/deploy.sh`/`.github/workflows/deploy.yml`, and everything
  nginx-related (`docker-compose.prod.yml`'s nginx service, `user_conf.d/`)
  once `swipeandfly.world` (the only thing still using nginx) is also
  decommissioned.
