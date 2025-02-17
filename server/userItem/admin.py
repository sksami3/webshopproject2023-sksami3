from django.contrib import admin
from .models import userItem

@admin.register(userItem)
class userItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'item', 'ordered_quantity')
    search_fields = ('user__username', 'item__title')
