from django.urls import path, include
from .views import (
    OwnerView,
    OwnerDetailView
)

urlpatterns = [
    path('owner', OwnerView.as_view()),
    path('owner/<int:id>', OwnerDetailView.as_view()),
]