# 0001: Deploy topology - Cloud Run + Firebase Hosting rewrite

## Status
Accepted (2026-09-10)

## Context
SwipeAndFly's backend is a single Flask/gunicorn process that already
serves both the built React frontend (as static files) and the `/api/*`
and `/video_analysis/*` routes from one process on one port. It was
previously deployed as a Docker container on a personal VM, behind
nginx+certbot, at `swipeandfly.world`.

Migrating it onto `vietrochack-lab` per the
[migration-guide](https://github.com/VietRocHack/migration-guide), the
guide's reference example (RocMap) deploys as a Cloud Function behind a
Firebase Hosting `/api/**` rewrite. That doesn't fit here: this backend
is a real persistent server (opencv, yt-dlp, gunicorn with 4 workers),
not a single stateless HTTP function.

## Decision
- Deploy the existing container as-is to **Cloud Run** (`swipeandfly-server`,
  `us-central1`), scale-to-zero.
- Firebase Hosting site `vietrochack-swipeandfly` rewrites **everything**
  (`"source": "**"`) to that Cloud Run service, rather than just `/api/**`,
  since the container already serves the frontend itself - there's no
  separate static bundle to host. `firebase.json`'s `public` dir is an
  empty placeholder that's never actually served from.
- Custom domain `swipeandfly.vietrochack.com` is requested through Firebase
  Hosting's custom-domain REST API (see `docs/runbook.md`), same as the
  guide's RocMap example.

## Consequences
- One codebase, one container, one deploy artifact - no separate frontend
  build step in the deploy pipeline beyond what the Dockerfile already does.
- The Cloud Run container must listen on `$PORT` (Cloud Run injects 8080),
  not a hardcoded port - see ADR 0003.
- `gcloud run deploy --source` can't pass a `--build-arg` through to a
  Dockerfile build (needed for `VITE_MAPS_API_KEY`, baked in at frontend
  build time), so the deploy uses a two-step `gcloud builds submit`
  (with a custom `cloudbuild.yaml`) + `gcloud run deploy --image` instead
  of the guide's single-command Cloud Functions deploy.
