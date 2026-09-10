# 0002: Firestore instead of DynamoDB for itinerary storage

## Status
Accepted (2026-09-10)

## Context
The backend stored generated itineraries in an AWS DynamoDB table
(`csc477-swipeandfly-itinerary`), authenticated via a mounted `~/.aws`
credentials file (`docker-compose.yml`'s `${AWS_CREDENTIALS_PATH}` volume).
Cloud Run doesn't support mounting a local file like that - credentials
have to be an explicit secret, which would mean managing a standing AWS
IAM access key outside of GCP just for one table.

## Decision
Replace DynamoDB with a dedicated Firestore database (`swipeandfly`, native
mode, `us-central1`) in the `vietrochack-lab` project, following the
migration guide's siloing convention (one named database per app, not the
project's shared default). `backend/src/models/db_models.py` now opens a
`google.cloud.firestore.Client(database="swipeandfly")` instead of a boto3
DynamoDB resource; `itinerary_routes.py` reads/writes through it directly
by document ID instead of a `KeyConditionExpression` query.

## Consequences
- On Cloud Run, Firestore access needs **no credentials at all** - the
  service's default compute service account authenticates automatically,
  granted `roles/datastore.user` on the project. No AWS keys anywhere in
  this deploy.
- Local/VM dev needs `gcloud auth application-default login` and a
  `GOOGLE_CLOUD_PROJECT=vietrochack-lab` env var instead of an AWS
  credentials file; `docker-compose*.yml` mount `~/.config/gcloud` in
  place of `~/.aws`.
- The AWS/boto3 dependency (`boto3`, `botocore`, `s3transfer`, `jmespath`)
  is dropped entirely from `backend/requirements.txt`.
