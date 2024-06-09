# item/models.py
from django.db import models
from django.db.models.fields.files import ImageField
from user.models import AppUser 

class BaseModel(models.Model):
    id = models.AutoField(primary_key=True)
    created_by = models.ForeignKey(AppUser, on_delete=models.CASCADE, null=True, blank=True)
    modified_by = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='%(class)s_modified', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True  # Set this model as abstract so it's not created as a separate database table
