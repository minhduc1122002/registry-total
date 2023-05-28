from django.urls import path, include
from .views import (
    CarView,
    CarDetailView
)

urlpatterns = [
    path('car', CarView.as_view()),
    path('car/<int:id>', CarDetailView.as_view()),
]

