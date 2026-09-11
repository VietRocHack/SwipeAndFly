# Runbook

## One-time setup (already done, 2026-09-10)

All under GCP project `vietrochack-lab`:

- APIs enabled: `run`, `cloudbuild`, `artifactregistry`, `firestore`,
  `secretmanager`, `billingbudgets`, `maps-backend`, `places-backend`,
  `generativelanguage`, `places` (2026-09-10, added when the frontend
  migrated off the deprecated `AutocompleteService` to
  `AutocompleteSuggestion`, which calls the separate "Places API (New)"
  rather than the legacy `places-backend`)
- Firestore database `swipeandfly` (native mode, `us-central1`)
- Artifact Registry repo `swipeandfly` (`us-central1`), with a cleanup
  policy (keep last 3 tagged versions, delete untagged images after 1 day,
  delete any image older than 90 days)
- Firebase Hosting site `vietrochack-swipeandfly`, target `swipeandfly`
  (see `.firebaserc`)
- Custom domain `swipeandfly.vietrochack.com` requested against that
  Hosting site. DNS records needed at whoever manages vietrochack.com's
  DNS (Namecheap):
  - `CNAME swipeandfly` -> `vietrochack-swipeandfly.web.app`
  - `TXT _acme-challenge.swipeandfly` -> (value from the custom-domain
    status check below; each request generates a new one)
  - Re-check status: `docs/runbook.md`'s "Check custom domain status"
    command below. `hostState` goes `HOST_UNHOSTED` -> `HOST_ACTIVE`,
    `ownershipState` goes `OWNERSHIP_MISSING` -> `OWNERSHIP_ACTIVE`.
- Budget alert "swipeandfly budget", $10/month, alerting at 50/90/100%,
  scoped to the whole `vietrochack-lab` project (shared with any other
  app's budget in the same project - each budget alerts independently
  against the same total project spend, so this isn't additive with
  RocMap's budget, just a second alert on the same number)
- Secret Manager secret `swipeandfly-gemini-api-key`
- API keys (both under `vietrochack-lab`):
  - `swipeandfly-gemini` - restricted to `generativelanguage.googleapis.com`,
    value lives only in Secret Manager
  - `swipeandfly-maps-browser` - restricted to `maps-backend`/`places-backend`/
    `places` (the last one added 2026-09-10 alongside the `places` API
    enablement above) and to the `swipeandfly.vietrochack.com` /
    `vietrochack-swipeandfly.web.app` / `vietrochack-swipeandfly.firebaseapp.com`
    referrers; this one is client-exposed by design (ships in the built JS
    bundle), the referrer restriction is the actual security boundary, not
    secrecy
- Workload Identity Federation: provider `swipeandfly` added to the shared
  `github` pool (scoped to `VietRocHack/SwipeAndFly` via
  `attribute-condition`), bound to service account
  `gh-actions-deploy-swipeandfly@vietrochack-lab.iam.gserviceaccount.com`
- GitHub repo (`VietRocHack/SwipeAndFly`) variables/secrets:
  - vars: `WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`
  - secrets: `VITE_MAPS_API_KEY` (needed at CI build time, gets baked into
    the frontend bundle via a plain `npm run build` step - see ADR 0004)

## Ongoing

- **Deploy**: push to `main` -> `.github/workflows/deploy.yml` deploys the
  backend to Cloud Run straight from source (`gcloud run deploy --source`,
  Google Cloud Buildpacks - no Dockerfile, see ADR 0004), builds the
  frontend, and deploys Firebase Hosting, automatically. Manual
  equivalent: `scripts/deploy.sh` (needs `VITE_MAPS_API_KEY` in your shell
  env, and `gcloud`/`firebase` auth with access to `vietrochack-lab`).
- **Check custom domain status**:
  ```bash
  TOKEN=$(gcloud auth print-access-token)
  curl -s \
    "https://firebasehosting.googleapis.com/v1beta1/projects/vietrochack-lab/sites/vietrochack-swipeandfly/customDomains/swipeandfly.vietrochack.com" \
    -H "Authorization: Bearer $TOKEN" -H "X-Goog-User-Project: vietrochack-lab"
  ```
- **Logs**: `gcloud run services logs read swipeandfly-server --project=vietrochack-lab --region=us-central1`
- **Rotate the Gemini key**: create a new restricted key the same way as
  the original, then `gcloud secrets versions add swipeandfly-gemini-api-key --data-file=- --project=vietrochack-lab` with the new value; Cloud Run
  reads `:latest` so the next revision (or a redeploy) picks it up.

## Known gaps

- `swipeandfly.world` (the old VM deploy) is confirmed dead (2026-09-10,
  per Vuong) - its docker-compose/nginx deploy path and
  `scripts/deploy-prod.sh` have been removed (see ADR 0004).
- The old VM's DynamoDB itinerary history doesn't carry over - Firestore
  starts empty (see ADR 0002).
- **Unverified**: the backend's new Buildpacks-based Cloud Run build (see
  ADR 0004) may not have the system libraries `cv2` needs
  (`libgl1`/`libglib2.0-0`) - check `gcloud run services logs read
  swipeandfly-server --project=vietrochack-lab --region=us-central1` for a
  `libGL.so.1` import error on the video-analysis route after the next
  deploy. Tracked in `docs/backlog.md`.
