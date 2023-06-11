from django.db import models
import json

class Car(models.Model):
    # mã của giấy đăng ký
    registration_id = models.TextField(primary_key=True, null=False, max_length=20, unique=True)
    # biển số đăng ký
    plate_number = models.TextField(null=False, max_length=20, unique=True)
    # nơi đăng ký
    registration_place = models.TextField(null=False)
    # ngày cấp
    registration_date = models.DateField(null=False)
    # mục đích
    purpose = models.CharField(
        max_length=100,
        choices=[
            ('personal', 'Đi lại cá nhân'),
            ('passenger_service', 'Dịch vụ chở khách'),
            ('transportation_service', 'Dịch vụ vận tải'),
        ],
        default='personal',
    )
    # loại xe
    type = models.TextField(null=False)
    # hãng xe
    manufacturer = models.TextField(null=False)
    # mẫu xe
    model = models.TextField(null=False)

    # extra 
    engine_number = models.TextField(null=False)
    chassis_number = models.TextField(null=False)
    # power = models.FloatField(blank=True, null=True)
    # torque = models.FloatField(blank=True, null=True)
    # transmission = models.CharField(max_length=50, blank=True, null=True)
    # seating_capacity = models.PositiveIntegerField(blank=True, null=True)
    # length = models.FloatField(blank=True, null=True)
    # width = models.FloatField(blank=True, null=True)
    # height = models.FloatField(blank=True, null=True)
    # weight = models.FloatField(blank=True, null=True)
    # fuel_consumption = models.FloatField(blank=True, null=True)
    # suspension = models.CharField(max_length=100, blank=True, null=True)
    # braking_system = models.CharField(max_length=100, blank=True, null=True)

    # chủ sở hữu
    owner = models.ForeignKey('owner.Owner', on_delete=models.CASCADE, null=True, blank=True)
    # đã đăng kiểm
    inspection_status = models.CharField(max_length=100, default='Chưa đăng kiểm')
