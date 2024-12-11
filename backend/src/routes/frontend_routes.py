from flask import Blueprint, send_from_directory

frontend_bp = Blueprint("frontend", __name__, static_folder="../../../frontend/dist", static_url_path='/')


@frontend_bp.route('/')
def index():
    return send_from_directory(frontend_bp.static_folder, 'index.html')
