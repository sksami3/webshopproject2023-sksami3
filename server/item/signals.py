from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db import transaction
import logging

from .models import Item
from userItem.models import userItem  # Assuming userItem uses a string reference for Item

logger = logging.getLogger(__name__)

@receiver(pre_save, sender=Item)
def update_useritem_on_price_change(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_item = sender.objects.get(pk=instance.pk)
            if old_item.price != instance.price:
                userItems = userItem.objects.filter(item=instance, isPurchased=False)
                with transaction.atomic():
                    for user_item in userItems:
                        user_item.previousPrice = old_item.price
                        user_item.isPriceUpdated = True
                    userItem.objects.bulk_update(userItems, ['previousPrice', 'isPriceUpdated'])
        except Exception as e:
            logger.error(f"Error updating userItem prices: {str(e)}")
