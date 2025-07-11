# backend/Dockerfile

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY ./backend/requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt
# Copy and set permissions for create_superuser.py
COPY --chmod=777 ./backend/create_superuser.py /backend/data/create_superuser.py
RUN chmod +x /backend/data/create_superuser.py

COPY ./ ./

CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate --noinput && python create_superuser.py && gunicorn --chdir . cvverifier.wsgi:application --bind 0.0.0.0:8000"]
