#!/bin/bash
# Manual deploy path for swipeandfly.vietrochack.com (Cloud Run + Firebase Hosting).
# Requires: gcloud and firebase-tools authenticated with access to the
# vietrochack-lab project, and VITE_MAPS_API_KEY set in the environment.
set -euo pipefail

PROJECT="vietrochack-lab"
REGION="us-central1"
IMAGE="us-central1-docker.pkg.dev/${PROJECT}/swipeandfly/server:$(git rev-parse --short HEAD)"

: "${VITE_MAPS_API_KEY:?Set VITE_MAPS_API_KEY before running this script}"

gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=_IMAGE="${IMAGE}",_VITE_MAPS_API_KEY="${VITE_MAPS_API_KEY}" \
  --project="${PROJECT}"

gcloud run deploy swipeandfly-server \
  --image="${IMAGE}" \
  --region="${REGION}" \
  --project="${PROJECT}" \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=${PROJECT}" \
  --set-secrets="GEMINI_API_KEY=swipeandfly-gemini-api-key:latest"

firebase deploy --only hosting:swipeandfly --project "${PROJECT}"
