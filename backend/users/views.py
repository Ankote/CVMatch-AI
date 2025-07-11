from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model
import sys
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

class PasswordResetVIEW(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('oldPassword')
        new_password = request.data.get('newPassword')

        if not new_password:
            return Response(
                {"error": "New password is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if user.has_usable_password():
            # If user has a usable password, require the old password
            if not old_password:
                return Response(
                    {"error": "Oldpassword is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not check_password(old_password, user.password):
                return Response(
                    {"error": "Old password is incorrect."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if old_password == new_password:
                return Response(
                    {"error": "New password must be different from the old password."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Basic validation (you can improve with Django's password validators)
        if len(new_password) < 5:
            return Response(
                {"error": "New password must be at least 5 characters long."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password has been successfully set."},
            status=status.HTTP_200_OK
        )
@api_view(['POST'])
def google_login(request):
    token = request.data.get("token")
    if not token:
        return Response({"error": "Token missing"}, status=HTTP_400_BAD_REQUEST)

    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            audience="569212961464-mnoip4nqq0sm0e2p75hr163hntn2l3mg.apps.googleusercontent.com"
        )

        print(idinfo, file=sys.stderr)

        email = idinfo["email"]
        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")

        # Get or create user
        user, created = User.objects.get_or_create(
            username=email,
            defaults={
                "email": email,  # assuming username is email
                "first_name": first_name,
                "last_name": last_name,
            }
        )

        # Update name if user already exists and data is missing
        if not created:
            updated = False
            if not user.first_name and first_name:
                user.first_name = first_name
                updated = True
            if not user.last_name and last_name:
                user.last_name = last_name
                updated = True
            if updated:
                user.save()

        # Return JWT
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })

    except ValueError:
        return Response({"error": "Invalid token"}, status=HTTP_400_BAD_REQUEST)

