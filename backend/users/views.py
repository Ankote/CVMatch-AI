
from .models import Vans
from .serializers import VanSerializer
from django.shortcuts import render
from .serializers import RegisterUserSerializer, VanSerializer, UserSerializer
from rest_framework.reverse import reverse
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from rest_framework_simplejwt.views import TokenRefreshView
from .models import User, Vans, VanImage
import logging
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
import sys
logger = logging.getLogger(__name__)
# Create your views here.

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            username = request.data.get('username')
            password = request.data.get("password")
            authUser = authenticate(username=username, password=password)
            if (authUser):
                refresh_token = RefreshToken.for_user(authUser)
                return Response({'refresh': str(refresh_token), "access" : str(refresh_token.access_token)}, status=status.HTTP_201_CREATED)
            else:
                return Response(
                {"error": "Authentication failed after registration."},
                status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Authenticate the user
        user = authenticate(username=username, password=password)
        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        # Generate tokens
        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token

        # Create response with access token in the body
        response = Response(
            {"access": str(access_token)},
            status=status.HTTP_200_OK,
        )

        # Set refresh token as an HTTP-only, persistent cookie
        response.set_cookie(
            key="refresh_token",
            value=str(refresh_token),
            httponly=True,  # Prevent JavaScript access
            secure=True,  # Set to True in production
            samesite="Lax",  # Prevent CSRF issues
            path="/",  # Make it available across the site
            max_age=7 * 24 * 60 * 60,  # 7 days (in seconds)
            
        )
        return response


class CustomTokenRefreshView(TokenRefreshView):
   
    def post(self, request, *args, **kwargs):
        # Read the refresh token from the cookie
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response(
                {"detail": "Refresh token is missing"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Add the refresh token to the request data
        request.data['refresh'] = refresh_token

        return super().post(request, *args, **kwargs)
