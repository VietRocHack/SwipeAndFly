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
- [x] `swipeandfly.world` (the pre-migration VM deploy) - confirmed dead
  by Vuong (2026-09-10); its deploy path is removed (see ADR 0004).
- [x] **Split the single-container Docker architecture into a plain
  separate backend + frontend deploy**, dropping Docker/Cloud
  Build/nginx entirely (2026-09-10, see ADR 0004 and
  `docs/progress/20260910.md`).
- [ ] **Verify the backend's new Buildpacks-based Cloud Run build
  actually works for video analysis.** `cv2` (`opencv-python-headless`)
  needs `libgl1`/`libglib2.0-0` to import at all (see ADR 0004's
  Consequences and `docs/progress/20260909.md` for the original bug);
  Google Cloud Buildpacks has no supported way to install those apt
  packages, unlike the Dockerfile it replaced. Not yet confirmed against
  a real deploy. If the deployed service 500s on
  `/video_analysis/analyze_videos` with a `libGL.so.1` error, reintroduce
  a small backend-only Dockerfile (still no docker-compose/nginx) so
  Cloud Run builds from that instead of Buildpacks.
