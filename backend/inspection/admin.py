from django.contrib import admin
from .models import Inspection

class InspectionAdmin(admin.ModelAdmin):
    list_display = ('inspection_number', 'inspection_date', 'expiration_date', 'inspection_center', 'car')

admin.site.register(Inspection, InspectionAdmin)
