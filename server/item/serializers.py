# serializers.py
from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'title', 'image', 'price', 'quantity', 'description', 'created_by', 'modified_by', 'created_at', 'modified_at', 'created_by_id']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['created_by'] = instance.created_by.username
        if instance.modified_by:
            representation['modified_by'] = instance.modified_by.username
        return representation
