from django.contrib import admin
from .models import Owner

class OwnerAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'name', 'address', 'city', 'district', 'contact')
# Register your models here.

admin.site.register(Owner, OwnerAdmin)
