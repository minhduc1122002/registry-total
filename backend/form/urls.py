from django.urls import path, include
from . import views
from .views import (
    FormView,
    FormDetailView,
    FormMonthViewAll,
    FormQuarterViewAll,
    FormYearViewAll,
    FormMonthInYearViewAll,
    FormMonthViewDistrict,
    FormQuarterViewDistrict,
    FormYearViewDistrict,
    FormMonthInYearViewDistrict,
    FormExpiringView,
    FormExpiringCityView,
    FormExpiringDistrictView,
)

urlpatterns = [
    path('form', FormView.as_view()),
    path('form/<int:id>', FormDetailView.as_view()),
    path('form/register/month/<int:month>', FormMonthViewAll.as_view()),
    path('form/register/quarter/<int:quarter>', FormQuarterViewAll.as_view()),
    path('form/register/year/<int:year>', FormYearViewAll.as_view()),
    path('form/register/month-year/<int:month>/<int:year>', FormMonthInYearViewAll.as_view()),
    path('form/register/bymonth/<int:year>', views.CountInMonthByCenter, name="center"),
    path('form/register/month/<int:month>/<str:district>', FormMonthViewDistrict.as_view()),
    path('form/register/quarter/<int:quarter>/<str:district>', FormQuarterViewDistrict.as_view()),
    path('form/register/year/<int:year>/<str:district>', FormYearViewDistrict.as_view()),
    path('form/register/month-year/<int:month>/<int:year>/<str:district>', FormMonthInYearViewDistrict.as_view()),
    path('form/expiring/all', FormExpiringView.as_view()),
    path('form/expiring/city/<str:city>', FormExpiringCityView.as_view()),
    path('form/expiring/district/<str:district>', FormExpiringDistrictView.as_view()),
]