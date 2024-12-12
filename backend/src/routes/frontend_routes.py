import os
from flask import Blueprint, send_from_directory

frontend_bp = Blueprint("frontend", __name__, static_folder="../../static")


@frontend_bp.route('/', defaults={'path': ''})
@frontend_bp.route('/<path:path>')
def index(path):
    print(f"Requested path: {path}") 
    if path and os.path.exists(os.path.join(frontend_bp.static_folder, path)):
        return send_from_directory(frontend_bp.static_folder, path)
    return send_from_directory(frontend_bp.static_folder, 'index.html')

# @frontend_bp.route('/create-trip')
# def create_trip():
#     print("hello")
#     return send_from_directory(frontend_bp.static_folder, 'index.html')