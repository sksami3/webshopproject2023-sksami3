from rest_framework import serializers
from .models import userItem, Item
from user.models import AppUser

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'title', 'image', 'price', 'quantity', 'description', 'created_by', 'modified_by', 'created_at', 'modified_at']

class userItemSerializer(serializers.ModelSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=AppUser.objects.all())

    class Meta:
        model = userItem
        fields = ['user', 'item', 'quantity']

    def create(self, validated_data):
        user = validated_data.get('user')
        item = validated_data.get('item')
        quantity = validated_data.get('quantity')

        user_item = userItem.objects.create(user=user, item=item, quantity=quantity)
        return user_item

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = instance.user.id
        representation['item'] = ItemSerializer(instance.item).data
        return representation
