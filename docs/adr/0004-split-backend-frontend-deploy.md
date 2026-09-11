# 0004: Split into separate backend (Cloud Run) + frontend (Firebase Hosting static) deploy

## Status
Accepted (2026-09-10)

## Context
ADR 0001 deployed the existing single Flask/gunicorn container (frontend
baked in as static files, served by the same process as `/api/*` and
`/video_analysis/*`) as-is to Cloud Run, with Firebase Hosting rewriting
*all* traffic to it. That kept the deploy pipeline close to the
pre-migration VM setup, but meant carrying Docker end-to-end: a
multi-stage `Dockerfile` that bakes the frontend into the backend image, a
custom two-step `cloudbuild.yaml` + `gcloud run deploy --image` dance
(needed only to pass `VITE_MAPS_API_KEY` as a Docker build arg, which
`gcloud run deploy --source` can't do), and `docker-compose`/nginx for
local dev and the old `swipeandfly.world` VM path.

None of that is load-bearing once `swipeandfly.world` is confirmed dead
(2026-09-10, per Vuong) and there's no other reason to require Docker.

## Decision
- Split into the migration guide's default topology. The backend deploys
  as its own Cloud Run service (`swipeandfly-server`), built directly
  from `backend/` via `gcloud run deploy --source` (Google Cloud
  Buildpacks - see `backend/Procfile` and `backend/.python-version`), no
  Dockerfile.
- The frontend builds to `frontend/dist` and is served directly by
  Firebase Hosting as static files; Hosting rewrites only `/api/**` and
  `/video_analysis/**` to the backend, with a catch-all rewrite to
  `/index.html` for client-side routing (`firebase.json`).
- `VITE_MAPS_API_KEY` is now just an env var passed to a plain `npm run
  build` step in `scripts/deploy.sh`/CI, rather than a Docker build arg -
  removing the reason ADR 0001 needed the two-step Cloud Build path.
- Removed entirely: `Dockerfile`, `cloudbuild.yaml`, `docker-compose.yml`,
  `docker-compose.prod.yml`, `user_conf.d/` (nginx), `.dockerignore`,
  `scripts/deploy-prod.sh` (the dead VM's deploy script), the placeholder
  top-level `public/` dir, and `backend/src/routes/frontend_routes.py`
  (the Flask static-file-serving catch-all, now redundant).
- Local dev now runs the Flask backend (`python backend/main.py`) and the
  Vite dev server (`npm run dev`, proxying `/api` + `/video_analysis` to
  the backend) as two plain processes instead of `docker compose up`.

## Consequences
- No Docker anywhere in this repo, dev or prod.
- **Known risk, not yet verified by a real deploy**: the video-analysis
  feature imports `cv2` (`opencv-python-headless`), which needs the
  system packages `libgl1`/`libglib2.0-0` just to import (a real bug hit
  and fixed in the original `Dockerfile` - see
  `docs/progress/20260909.md`). Google Cloud Buildpacks has no supported
  way to install arbitrary apt packages the way a Dockerfile's `RUN
  apt-get install` can, so this may break video analysis in production.
  If the deployed service 500s on video analysis with a `libGL.so.1`
  import error (check `gcloud run services logs read swipeandfly-server`),
  the fallback is reintroducing a small backend-only Dockerfile - still no
  docker-compose/nginx/frontend-baking - so Cloud Run builds from that
  instead of Buildpacks. Tracked in `docs/backlog.md`.
- Two deploy steps (backend, then hosting) instead of one - a few more
  seconds of deploy time, no meaningful downside.
- `firebase.json`'s old `"public": "public"` placeholder (never actually
  served from, per ADR 0001) is now `"public": "frontend/dist"` and is
  actually served from.
