# item/models.py
from django.db import models
from django.db.models.fields.files import ImageField
from user.models import AppUser  

class BaseModel(models.Model):
    id = models.AutoField(primary_key=True)
    created_by = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    modified_by = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='%(class)s_modified', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True  # Set this model as abstract so it's not created as a separate database table

class Item(BaseModel):
    title = models.CharField(max_length=255)
    image = ImageField(upload_to='item_images/', null=True, blank=True)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    quantity = models.PositiveIntegerField()
    description = models.TextField()

    def __str__(self):
        return self.title
