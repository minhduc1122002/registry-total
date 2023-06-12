from django.urls import path, include
from . import views
from .views import (
    FormView,
    FormDetailView,
    FormYearViewAll,
    FormMonthViewDistrict,
    FormQuarterViewDistrict,
    FormYearViewDistrict,
    FormMonthInYearViewDistrict,
    FormExpiringView,
    FormExpiringCityView,
    FormExpiringDistrictView,
)

urlpatterns = [
    # all
    path('form', FormView.as_view()),
    # theo id
    path('form/<id>', FormDetailView.as_view()),
    # lấy data của 1 năm
    path('form/register/year/<int:year>', FormYearViewAll.as_view()),
    # lấy data của từng tháng trong 1 năm bất kỳ
    # cục (của từng trung tâm)
    # trung tâm (của trung tâm đấy)
    path('form/register/bymonth/<int:year>', views.CountInMonthByCenter, name="center"),
    # lấy data của từng tháng trong 1 năm bất kỳ
    # cục (toàn quốc)
    # trung tâm (của trung tâm đấy)
    path('form/register/bymonth/all/<int:year>', views.CountInMonthAll),
    # lấy data của từng tháng trong 1 năm bất kỳ
    # cục (toàn quốc)
    # trung tâm (của trung tâm đấy)
    path('form/register/byyear/all', views.CountInYearAll),

    path('form/register/all', views.CountAllByCenter, name="center"),
    path('form/expired/all', views.ExpiredAllByCenter, name="center"),
    path('form/forecast/center', views.Expired2MonthByCenter, name="forecast"),
    path('form/forecast/district', views.Expired2MonthByDepartmentDistrict, name="forecast"),
    path('form/forecast/all', views.Expired2MonthByDepartmentCenter, name="forecast"),
    path('form/forecast/total', views.Expired2MonthAll, name="forecast"),
    # path('form/register/month/<int:month>/<str:district>', FormMonthViewDistrict.as_view()),
    # path('form/register/quarter/<int:quarter>/<str:district>', FormQuarterViewDistrict.as_view()),
    path('form/register/year/<int:year>/<str:district>', FormYearViewDistrict.as_view()),
    path('form/register/month-year/<int:month>/<int:year>/<str:district>', FormMonthInYearViewDistrict.as_view()),
    path('form/expiring/all', FormExpiringView.as_view()),
    path('form/expiring/city/<str:city>', FormExpiringCityView.as_view()),
    path('form/expiring/district/<str:district>', FormExpiringDistrictView.as_view()),
]