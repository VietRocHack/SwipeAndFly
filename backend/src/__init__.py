from flask import Flask

from dotenv import load_dotenv
load_dotenv()

# Initialize the Flask application
def create_app():
    app = Flask(__name__)

    # Register blueprints
    from src.routes import register_routes
    register_routes(app)

    return app
