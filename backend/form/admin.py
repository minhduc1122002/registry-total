from django.contrib import admin
from .models import Form

class FormAdmin(admin.ModelAdmin):
    list_display = ('register_id', 'register_date', 'expired_date', 'center', 'car')

admin.site.register(Form, FormAdmin)
