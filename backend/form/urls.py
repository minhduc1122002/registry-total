from django.urls import path, include
from .views import (
    FormView,
    FormDetailView,
    FormMonthViewAll,
    FormQuarterViewAll,
    FormYearViewAll,
    FormMonthViewDistrict,
    FormQuarterViewDistrict,
    FormYearViewDistrict,
    FormExpiringView,
    FormExpiringPlaceView,
    FormExpiringCityView,
    FormExpiringDistrictView,
)

urlpatterns = [
    path('form', FormView.as_view()),
    path('form/<int:id>', FormDetailView.as_view()),
    path('form/register/month/<int:month>', FormMonthViewAll.as_view()),
    path('form/register/quarter/<int:quarter>', FormQuarterViewAll.as_view()),
    path('form/register/year/<int:year>', FormYearViewAll.as_view()),
    path('form/register/month/<int:month>/<str:place>', FormMonthViewDistrict.as_view()),
    path('form/register/quarter/<int:quarter>/<str:place>', FormQuarterViewDistrict.as_view()),
    path('form/register/year/<int:year>/<str:place>', FormYearViewDistrict.as_view()),
    path('form/expiring/all', FormExpiringView.as_view()),
    path('form/expiring/place/<str:place>', FormExpiringPlaceView.as_view()),
    path('form/expiring/city/<str:city>', FormExpiringCityView.as_view()),
    path('form/expiring/district/<str:district>', FormExpiringDistrictView.as_view()),
]