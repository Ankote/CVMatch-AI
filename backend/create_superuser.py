import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from django.contrib.auth import get_user_model

# Add the project root directory to the Python path
BASE_DIR = Path(__file__).resolve().parent.parent  # Go up two levels to the project root
sys.path.append(str(BASE_DIR))

# Load environment variables from .env file
env_path = BASE_DIR / '.env'
load_dotenv(env_path)

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cvverifier.settings')  # Replace 'cvverifier' with your project name

# Environment variables for superuser credentials
SUPERUSER_USERNAME = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
SUPERUSER_EMAIL = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
SUPERUSER_PASSWORD = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'adminpassword')

def create_superuser():
    User = get_user_model()
    
    # Check if a user with the same email or username already exists
    if User.objects.filter(email=SUPERUSER_EMAIL).exists():
        print("Email already exists. Skipping creation.")
    elif User.objects.filter(username=SUPERUSER_USERNAME).exists():
         print("Superuser already exists. Skipping creation.")
    else:
        print("Creating superuser...", file=sys.stderr)
        User.objects.create_superuser(
            username=SUPERUSER_USERNAME,
            email=SUPERUSER_EMAIL,
            password=SUPERUSER_PASSWORD,
        )
        print("Superuser created successfully!")

if __name__ == "__main__":
    import django
    django.setup()
    create_superuser()