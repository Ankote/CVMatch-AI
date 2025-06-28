from django.urls import path
from .views import  openrouter_match, gemini_match

urlpatterns = [
    path('match/', openrouter_match),
    path("verifier_gemini/", gemini_match)
]
