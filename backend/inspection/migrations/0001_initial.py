# Generated by Django 4.2.1 on 2023-05-27 13:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('car', '0005_remove_car_id_alter_car_registration_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='Inspection',
            fields=[
                ('inspection_number', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('inspection_date', models.DateField(blank=True, null=True)),
                ('expiration_date', models.DateField(blank=True, null=True)),
                ('inspection_center', models.CharField(blank=True, max_length=100, null=True)),
                ('car', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='car.car')),
            ],
        ),
    ]
