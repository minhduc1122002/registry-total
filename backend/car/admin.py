from django.contrib import admin
from .models import Car

class CarAdmin(admin.ModelAdmin):
    list_display = ('registration_place', 'registration_date', 'registration_number', 'purpose',
                    'type', 'manufacturer', 'model')
# Register your models here.

admin.site.register(Car, CarAdmin)