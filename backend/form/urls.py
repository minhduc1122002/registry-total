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
    path('form/register/bymonth/<int:year>/<str:center_id>', views.CountInMonthByCenter, name="center"),
    # lấy data của từng tháng trong 1 năm bất kỳ
    # cục (toàn quốc)
    # trung tâm (của trung tâm đấy)
    path('form/register/bymonth/all/<int:year>', views.CountInMonthAll),
    # lấy data của từng tháng trong 1 năm bất kỳ
    # cục (toàn quốc)
    # trung tâm (của trung tâm đấy)
    path('form/register/byyear/all', views.CountInYearAll),
    path('form/register/byyear/all/<str:center_id>', views.CountInYearAll),

    path('form/register/all', views.CountAllByCenter, name="center"),
    path('form/register/all/<str:center_id>', views.CountAllByCenter, name="center"),
    path('form/expired/all', views.ExpiredAllByCenter, name="center"),
    path('form/expired/all/<str:center_id>', views.ExpiredAllByCenter, name="center"),
    # số lượng dự báo tại 1 trung tâm
    path('form/forecast/center', views.Expired2MonthByCenter, name="forecast"),
    path('form/forecast/center/<str:center_id>', views.Expired2MonthByCenter, name="forecast"),
    # số lượng dự báo tại các trung tâm
    path('form/forecast/all', views.Expired2MonthByDepartmentCenter, name="forecast"),
    # số lượng dự báo tại các khu vực
    path('form/forecast/district', views.Expired2MonthByDepartmentDistrict, name="forecast"),
    # số lượng dự báo trên toàn quốc
    path('form/forecast/total', views.Expired2MonthAll, name="forecast"),
    # path('form/register/month/<int:month>/<str:district>', FormMonthViewDistrict.as_view()),
    # path('form/register/quarter/<int:quarter>/<str:district>', FormQuarterViewDistrict.as_view()),
    path('form/register/year/<int:year>/<str:district>', FormYearViewDistrict.as_view()),
    path('form/register/month-year/<int:month>/<int:year>/<str:district>', FormMonthInYearViewDistrict.as_view()),
    path('form/expiring/all', FormExpiringView.as_view()),
    path('form/expiring/all/<str:center_id>', FormExpiringView.as_view()),
    path('form/expiring/city/<str:city>', FormExpiringCityView.as_view()),
    path('form/expiring/district/<str:district>', FormExpiringDistrictView.as_view()),
]