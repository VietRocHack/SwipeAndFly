import time
from flask import Blueprint

status_bp = Blueprint("frontend", __name__)

@status_bp.route("/api/")
def index():
    return f"Backend is alive and well as of {time.ctime()}", 200
    
