from django.db import models

class Inspection(models.Model):
    inspection_number = models.CharField(max_length=20, primary_key=True)
    inspection_date = models.DateField(blank=True, null=True)
    expiration_date = models.DateField(blank=True, null=True)
    inspection_center = models.CharField(blank=True, null=True, max_length=100)
    car = models.ForeignKey('car.Car', on_delete=models.CASCADE)

    @staticmethod
    def get_monthly_inspection_count(month, year):
        return Inspection.objects.filter(
            inspection_date__month=month,
            inspection_date__year=year
        ).count()

    @staticmethod
    def get_expiring_inspections(month, year):
        return Inspection.objects.filter(
            expiration_date__month=month,
            expiration_date__year=year
        )

    @staticmethod
    def get_new_and_renewal_inspections(month, year):
        inspections = Inspection.objects.filter(
            inspection_date__month=month,
            inspection_date__year=year
        )

        new_count = inspections.count()
        renewal_count = Inspection.objects.filter(
            inspection_date__lt=inspections[0].inspection_date
        ).count()

        return new_count, renewal_count

    def record_inspection_result(self, inspection_number, inspection_date, expiration_date):
        self.inspection_number = inspection_number
        self.inspection_date = inspection_date
        self.expiration_date = expiration_date
        self.save()
