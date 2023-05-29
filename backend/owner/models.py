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

class Owner(models.Model):
    # CCCD/Company Number
    id = models.TextField(primary_key=True)
    # cá nhân hay cơ quan
    type = models.CharField(
        max_length=10,
        choices=[
            ('agency', 'Cơ quan'),
            ('individual', 'Cá nhân'),
        ],
        default='individual',
    )
    # tên
    name = models.CharField(max_length=100, blank=True, null=True)
    # địa chỉ
    address = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(
        max_length=20,
        choices=getChoice('backend/address/tinh_tp.json'),
        default='01',
    )
    # liên hệ
    contact = models.CharField(max_length=20, blank=True, null=True)
