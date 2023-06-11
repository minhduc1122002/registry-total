from django.urls import path, include
from .views import (
    CarView,
    CarDetailView,
    CarListView
)

urlpatterns = [
    path('car', CarView.as_view()),
    path('car/<int:id>', CarDetailView.as_view()),
    path('car/list', CarListView.as_view()),
]

