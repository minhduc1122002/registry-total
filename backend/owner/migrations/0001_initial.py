# Generated by Django 4.2.1 on 2023-05-26 10:21

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Owner',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(choices=[('agency', 'Cơ quan'), ('individual', 'Cá nhân')], default='individual', max_length=10)),
                ('agency_name', models.CharField(blank=True, max_length=100, null=True)),
                ('agency_address', models.CharField(blank=True, max_length=200, null=True)),
                ('agency_contact', models.CharField(blank=True, max_length=20, null=True)),
                ('individual_name', models.CharField(blank=True, max_length=100, null=True)),
                ('individual_address', models.CharField(blank=True, max_length=200, null=True)),
                ('individual_phone', models.CharField(blank=True, max_length=20, null=True)),
            ],
        ),
    ]
