from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    # username
    username = models.CharField(max_length=100, primary_key=True)
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
    center = models.ForeignKey('form.Center', on_delete=models.CASCADE)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []