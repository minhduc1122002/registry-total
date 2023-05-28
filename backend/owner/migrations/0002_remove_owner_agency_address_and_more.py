# Generated by Django 4.2.1 on 2023-05-26 17:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('owner', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='owner',
            name='agency_address',
        ),
        migrations.RemoveField(
            model_name='owner',
            name='agency_contact',
        ),
        migrations.RemoveField(
            model_name='owner',
            name='agency_name',
        ),
        migrations.RemoveField(
            model_name='owner',
            name='individual_address',
        ),
        migrations.RemoveField(
            model_name='owner',
            name='individual_name',
        ),
        migrations.RemoveField(
            model_name='owner',
            name='individual_phone',
        ),
        migrations.AddField(
            model_name='owner',
            name='address',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='owner',
            name='contact',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='owner',
            name='name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='owner',
            name='id',
            field=models.TextField(primary_key=True, serialize=False),
        ),
    ]
