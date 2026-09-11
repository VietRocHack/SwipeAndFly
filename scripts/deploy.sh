#!/bin/bash
# Manual deploy path for swipeandfly.vietrochack.com (Cloud Run + Firebase Hosting).
# Requires: gcloud and firebase-tools authenticated with access to the
# vietrochack-lab project, and VITE_MAPS_API_KEY set in the environment.
set -euo pipefail

PROJECT="vietrochack-lab"
REGION="us-central1"

: "${VITE_MAPS_API_KEY:?Set VITE_MAPS_API_KEY before running this script}"

(cd frontend && npm ci && VITE_MAPS_API_KEY="${VITE_MAPS_API_KEY}" npm run build)

gcloud run deploy swipeandfly-server \
  --source=backend \
  --region="${REGION}" \
  --project="${PROJECT}" \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=${PROJECT}" \
  --set-secrets="GEMINI_API_KEY=swipeandfly-gemini-api-key:latest"

firebase deploy --only hosting:swipeandfly --project "${PROJECT}"
