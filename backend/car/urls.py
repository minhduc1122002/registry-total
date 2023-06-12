from django.urls import path, include
from .views import (
    CarView,
    CarDetailView,
    CarListView
)
from . import views

urlpatterns = [
    path('car', CarView.as_view()),
    path('car/<id>', CarDetailView.as_view()),
    path('car/list/all', CarListView.as_view()),
    path('car/unregis/all', views.CountInMonthAll),
    path('car/unregisdistrict/all', views.UnregisDistrict),
]

