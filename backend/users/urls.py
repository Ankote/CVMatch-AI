from rest_framework_simplejwt.views import  TokenRefreshView
from django.contrib import admin
from django.urls import path, include
from oauth2_provider import urls as oauth2_urls
from django.http import HttpResponse

from .views import google_login, PasswordResetVIEW, CustomTokenObtainPairView, CookieTokenRefreshView,  LogoutView
from rest_framework_simplejwt.views import TokenVerifyView

def index(request):
    return HttpResponse("Backend is running ✅")
urlpatterns = [
    path('', index),
    path('admin/', admin.site.urls),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('reset-password/', PasswordResetVIEW.as_view(), name='password-reset'),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('logout/', LogoutView.as_view(), name='token_verify'),
    path('google-login/', google_login),
]