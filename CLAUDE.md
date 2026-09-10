# SwipeAndFly

Swipe through TikTok travel videos, get an AI-generated itinerary out of
the ones you like. Deployed at `swipeandfly.vietrochack.com` (GCP project
`vietrochack-lab`).

Before making an architectural change, read `docs/adr/` - especially
0001-0003, which cover why this deploys as one Cloud Run container behind
a Firebase Hosting catch-all rewrite, why storage is Firestore and not
DynamoDB, and why the default LLM provider is Gemini and not OpenAI.

Log work as it happens in `docs/progress/YYYYMMDD.md` (one `##` section
per session). Known non-blocking issues live in `docs/backlog.md`.
One-time setup and ongoing operational commands are in `docs/runbook.md`.

## Repo map

- `backend/` - Flask app (`src/`), serves both `/api/*` +
  `/video_analysis/*` and (in production) the built frontend as static
  files from the same process. `src/function/` holds the two real
  features (video analysis, itinerary generation); `src/models/` is the
  Firestore client; `src/routes/` are the Flask blueprints.
- `frontend/` - Vite + React + MUI. Builds to `frontend/dist`, which the
  backend's Dockerfile copies into its own image (`./static/`) rather
  than being hosted separately.
- `Dockerfile` - two-stage build: builds the frontend, then bakes it into
  the Python/gunicorn image. This single image is what runs everywhere
  (Cloud Run, the old VM via docker-compose, local dev).
- `docker-compose.yml` / `docker-compose.prod.yml` - local dev / VM deploy
  paths (the pre-migration deploy at `swipeandfly.world` still runs this
  way; it hasn't been decommissioned).
- `cloudbuild.yaml`, `scripts/deploy.sh`, `.github/workflows/deploy.yml` -
  the Cloud Run + Firebase Hosting deploy path (manual and automatic,
  same two steps: build the image, deploy it).
- `firebase.json` / `.firebaserc` - Hosting config for
  `swipeandfly.vietrochack.com`; rewrites *all* traffic to the Cloud Run
  service (see ADR 0001 for why that differs from the migration guide's
  `/api/**`-only example).

## Local dev

```bash
cp .env.sample .env   # fill in the real values
docker compose build && docker compose up
```
Needs `gcloud auth application-default login` for Firestore access (see
ADR 0002) - no AWS credentials needed anymore.

## Deploy

Push to `main` deploys automatically. See `docs/runbook.md` for the
manual path and one-time setup this all depends on.
