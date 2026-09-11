# SwipeAndFly


## Local dev

0. Copy `.env.sample` to `.env` (repo root) and fill in the real values.
   You'll also need `gcloud auth application-default login` for Firestore
   access - no AWS credentials needed.

1. Backend (serves the API at `127.0.0.1:8080`):
   ```bash
   cd backend
   python -m venv venv
   venv/Scripts/activate   # macOS/Linux: source venv/bin/activate
   pip install -r requirements.txt
   python main.py
   ```

2. Frontend (serves the UI at `127.0.0.1:5173`, proxying `/api` and
   `/video_analysis` requests to the backend), in a second terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
