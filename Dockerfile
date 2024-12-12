### Stage 1: Build frontend into static files for Flask serving
# Get node 18 slim
FROM node:18-slim AS build

# Set the working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json to install shit
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./

# Install node dependencies
RUN npm ci

# Copy the rest of the frontend stuff in here
COPY ./frontend .

# Specify ARGS and Build the frontend
ARG VITE_MAPS_API_KEY
RUN npm run build

### Stage 2: Build and serve Flask backend
# Use an official Python runtime as a parent image
FROM python:3.11-slim AS final

# Set the working directory
WORKDIR /app/backend
ENV PYTHONPATH "${PYTHONPATH}:/app"

# Copy the requirements file
COPY ./backend/requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install missing dependencies for cv2
RUN apt-get update && apt-get install -y libgl1-mesa-glx

# Copy the current directory contents into the container at /app/backend
COPY ./backend .

# Make port 5000 available to the world outside this container
EXPOSE 5000/tcp

# Copy React static files built in stage 1
COPY --from=build /app/frontend/dist/ ./static/

# Use ENTRYPOINT with Gunicorn settings inline
ENTRYPOINT ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--access-logfile", "-", "--error-logfile", "-", "--log-level", "info", "src:create_app()"]
