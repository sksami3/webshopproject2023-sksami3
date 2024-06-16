# item/models.py
from django.db import models
from django.db.models.fields.files import ImageField
from django.dispatch import receiver
from user.models import AppUser
from BaseModel.BaseModel import BaseModel
from django.db.models.signals import pre_save
from django.dispatch import receiver
import logging
logger = logging.getLogger(__name__)
from django.db import transaction

class Item(BaseModel):
    title = models.CharField(max_length=255)
    image = ImageField(upload_to='item_images/', null=True, blank=True)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    quantity = models.PositiveIntegerField()
    description = models.TextField()

    def __str__(self):
        return self.title
    
