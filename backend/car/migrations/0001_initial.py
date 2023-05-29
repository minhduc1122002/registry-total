# Generated by Django 4.2.1 on 2023-05-26 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Car',
            fields=[
                ('id', models.PositiveIntegerField(primary_key=True, serialize=False)),
                ('registration_place', models.TextField()),
                ('registration_date', models.DateField()),
                ('registration_number', models.TextField(max_length=20, unique=True)),
                ('purpose', models.CharField(choices=[('personal', 'Đi lại cá nhân'), ('passenger_service', 'Dịch vụ trở khách'), ('transportation_service', 'Dịch vụ vận tải')], default='personal', max_length=100)),
                ('type', models.TextField()),
                ('manufacturer', models.TextField()),
                ('model', models.TextField()),
            ],
        ),
    ]