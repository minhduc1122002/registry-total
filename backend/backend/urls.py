"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from car import urls as car_urls
from owner import urls as owner_urls
from form import urls as form_urls
from user import urls as user_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(car_urls)),
    path('api/', include(owner_urls)),
    path('api/', include(form_urls)),
    path('api/', include(user_urls)),
]