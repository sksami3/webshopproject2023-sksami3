from django.db import models
from user.models import AppUser
from item.models import Item

class userItem(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    class Meta:
        unique_together = ('user', 'item')  # Ensure that the same user can't have the same item multiple times

    def __str__(self):
        return f'{self.user.username} - {self.item.title} ({self.quantity})'
