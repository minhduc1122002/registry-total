# Generated by Django 4.2.1 on 2023-06-11 06:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('car', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='car',
            old_name='register_id',
            new_name='registration_id',
        ),
        migrations.AddField(
            model_name='car',
            name='inspection_status',
            field=models.CharField(default='Chưa đăng kiểm', max_length=100),
        ),
    ]
