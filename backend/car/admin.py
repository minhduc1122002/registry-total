from django.contrib import admin
from .models import Car

class CarAdmin(admin.ModelAdmin):
    list_display = ('register_id', 'registration_place', 'registration_date', 'plate_number', 'purpose',
                    'type', 'manufacturer', 'model', 'engine_number', 'chassis_number')
# Register your models here.

admin.site.register(Car, CarAdmin)