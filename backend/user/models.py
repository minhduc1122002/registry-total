from django.db import models

# Create your models here.
class User(models.Model):
    # ID
    id = models.AutoField(primary_key=True)
    # username
    username = models.CharField(max_length=100, blank=False, null=False)
    # mật khẩu
    password = models.CharField(max_length=200, blank=False, null=False)
    # role
    role = models.CharField(
        max_length=10,
        choices=[
            ('department', 'Cục'),
            ('center', 'Trung tâm'),
        ],
        default='center',
    )
    # trung tâm
    center = models.CharField(max_length=20, blank=True, null=True)