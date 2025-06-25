# Use official Python image
FROM python:3.11-slim

# Set environment vars
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set workdir
WORKDIR /app

# Install deps
COPY backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy app files
COPY backend/ .

# Run app using gunicorn
CMD ["gunicorn", "cvverifier.wsgi:application", "--bind", "0.0.0.0:8000"]
