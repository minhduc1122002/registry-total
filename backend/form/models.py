from django.db import models
import json
import locale

locale.setlocale(locale.LC_ALL, '')

def getChoice(link):
    with open(link, 'r', encoding="utf8") as f:
        jsonData = json.load(f)

    choices = dict()
    for key, valueList in jsonData.items():
        choices[str(key)] = str(valueList['name'])
    
    choices = dict(sorted(choices.items(), key=lambda item: locale.strxfrm(item[1])))

    return choices.items()

class Form(models.Model):
    register_id = models.CharField(max_length=20, primary_key=True)
    register_date = models.DateField(blank=True, null=True)
    expired_date = models.DateField(blank=True, null=True)
    register_center = models.CharField(blank=True, null=True, max_length=100)
    register_city = models.CharField(
        max_length=20,
        choices=getChoice('backend/address/tinh_tp.json'),
        default='01',
    )
    register_district = models.CharField(max_length=30, blank=True, null=True)
    car = models.ForeignKey('car.Car', on_delete=models.CASCADE)

    @staticmethod
    def get_monthly_register_count(month, year):
        return Form.objects.filter(
            register_date__month=month,
            register_date__year=year
        ).count()

    @staticmethod
    def get_expiring_register(month, year):
        return Form.objects.filter(
            expired_date__month=month,
            expired_date__year=year
        )

    @staticmethod
    def get_new_and_renewal_register(month, year):
        registers = Form.objects.filter(
            register_date__month=month,
            register_date__year=year
        )

        new_count = registers.count()
        renewal_count = registers.objects.filter(
            register_date__lt=registers[0].register_date
        ).count()

        return new_count, renewal_count

    def record_register_result(self, register_id, register_date, expired_date):
        self.register_id = register_id
        self.register_date = register_date
        self.expired_date = expired_date
        self.save()
