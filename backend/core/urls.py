from django.urls import path
from .views import  openrouter_match

urlpatterns = [
    path('match/', openrouter_match),
    # path("match/", ask_openai)
]
