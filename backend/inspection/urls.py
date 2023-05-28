from django.urls import path, include
from .views import (
    InspectionView,
    InspectionDetailView
)

urlpatterns = [
    path('inspection', InspectionView.as_view()),
    path('inspection/<int:id>', InspectionDetailView.as_view()),
]