from src.routes.frontend_routes import frontend_bp
from src.routes.itinerary_routes import itinerary_bp
from src.routes.video_analysis_routes import video_analysis_bp
from src.routes.status_routes import status_bp


def register_routes(app):
    app.register_blueprint(frontend_bp)
    app.register_blueprint(itinerary_bp)
    app.register_blueprint(video_analysis_bp)
    app.register_blueprint(status_bp)