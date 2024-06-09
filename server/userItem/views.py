from django.http import JsonResponse
from user.models import AppUser
from .models import userItem
from .serializers import userItemSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET', 'POST'])
def user_item_list(request, format=None):
    if request.method == 'GET':
        user_items = userItem.objects.all()
        serializer = userItemSerializer(user_items, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = userItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
def user_item_detail(request, id, format=None):
    try:
        user_item = userItem.objects.get(pk=id)
    except userItem.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = userItemSerializer(user_item)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        user_item.delete()
    
@api_view(['GET'])
def user_items_by_user(request, user_id, format=None):
    try:
        user = AppUser.objects.get(pk=user_id)
    except AppUser.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user_items = userItem.objects.filter(user=user)
    serializer = userItemSerializer(user_items, many=True)
    return Response(serializer.data)
