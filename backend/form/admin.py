from django.contrib import admin
from .models import Form

class FormAdmin(admin.ModelAdmin):
    list_display = ('register_id', 'register_date', 'expired_date', 'register_center', 'register_city', 'register_district', 'car')

admin.site.register(Form, FormAdmin)
