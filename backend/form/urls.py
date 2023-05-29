from django.urls import path, include
from .views import (
    FormView,
    FormDetailView,
    FormExpiringView,
    FormExpiringPlaceView,
    FormExpiringCityView,
)

urlpatterns = [
    path('form', FormView.as_view()),
    path('form/<int:id>', FormDetailView.as_view()),
    path('form/expiring/all', FormExpiringView.as_view()),
    path('form/expiring/place/<str:place>', FormExpiringPlaceView.as_view()),
    path('form/expiring/city/<str:place>', FormExpiringCityView.as_view()),
]