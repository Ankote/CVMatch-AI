from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

# Custom User model
class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
  