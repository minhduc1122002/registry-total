# Generated by Django 4.2.1 on 2023-06-05 17:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('form', '0001_initial'),
        ('user', '0002_alter_user_center'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='center',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='form.center'),
        ),
    ]
