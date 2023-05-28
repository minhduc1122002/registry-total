from django.db import models

class Owner(models.Model):
    # CCCD/Company Number
    id = models.TextField(primary_key=True)
    # cá nhân hay cơ quan
    type = models.CharField(
        max_length=10,
        choices=[
            ('agency', 'Cơ quan'),
            ('individual', 'Cá nhân'),
        ],
        default='individual',
    )
    # tên
    name = models.CharField(max_length=100, blank=True, null=True)
    # địa chỉ
    address = models.CharField(max_length=200, blank=True, null=True)
    # liên hệ
    contact = models.CharField(max_length=20, blank=True, null=True)
