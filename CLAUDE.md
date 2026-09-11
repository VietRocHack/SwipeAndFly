# SwipeAndFly

Swipe through TikTok travel videos, get an AI-generated itinerary out of
the ones you like. Deployed at `swipeandfly.vietrochack.com` (GCP project
`vietrochack-lab`).

Before making an architectural change, read `docs/adr/` - especially
0002-0004, which cover why storage is Firestore and not DynamoDB, why the
default LLM provider is Gemini and not OpenAI, and why the backend and
frontend deploy as two separate services (Cloud Run + Firebase Hosting
static) rather than one Docker container (0001 is the superseded
single-container decision - still useful for the "why not just follow
the migration guide's default topology" history).

Log work as it happens in `docs/progress/YYYYMMDD.md` (one `##` section
per session). Known non-blocking issues live in `docs/backlog.md`.
One-time setup and ongoing operational commands are in `docs/runbook.md`.

## Repo map

- `backend/` - Flask app (`src/`), serves `/api/*` + `/video_analysis/*`
  as its own Cloud Run service, built directly from source via Google
  Cloud Buildpacks (no Dockerfile - see `backend/Procfile` and
  `backend/.python-version`). `src/function/` holds the two real
  features (video analysis, itinerary generation); `src/models/` is the
  Firestore client; `src/routes/` are the Flask blueprints.
- `frontend/` - Vite + React + MUI. Builds to `frontend/dist`, which
  Firebase Hosting serves directly as static files.
- `scripts/deploy.sh`, `.github/workflows/deploy.yml` - the deploy path
  (manual and automatic): build the frontend, deploy the backend to Cloud
  Run from source, deploy Firebase Hosting.
- `firebase.json` / `.firebaserc` - Hosting config for
  `swipeandfly.vietrochack.com`: serves `frontend/dist` as static files
  and rewrites only `/api/**` + `/video_analysis/**` to the backend's
  Cloud Run service, with a catch-all rewrite to `/index.html` for
  client-side routing (see ADR 0004; this differs from ADR 0001's
  now-superseded rewrite-everything setup).

## Local dev

No Docker - two plain processes.

```bash
cp .env.sample .env   # fill in the real values, repo root
cd backend && python -m venv venv && venv/Scripts/activate && pip install -r requirements.txt && python main.py
```
In a second terminal:
```bash
cd frontend && npm install && npm run dev
```
Needs `gcloud auth application-default login` for Firestore access (see
ADR 0002) - no AWS credentials needed anymore.

## Deploy

Push to `main` deploys automatically. See `docs/runbook.md` for the
manual path and one-time setup this all depends on.
