from routes.frontend_routes import frontend_bp
from routes.itinerary_routes import itinerary_bp
from routes.video_analysis_routes import video_analysis_bp


def register_routes(app):
    app.register_blueprint(frontend_bp)
    app.register_blueprint(itinerary_bp)
    app.register_blueprint(video_analysis_bp)
