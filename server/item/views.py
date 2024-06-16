# item/views.py
from django.http import JsonResponse
from .models import Item
from .serializers import ItemSerializer
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import logging

@api_view(['GET', 'POST'])
def item_list(request, format=None):
    if request.method == 'GET':
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def item_detail(request, id, format=None):
    logger = logging.getLogger(__name__)
    
    try:
        item = Item.objects.get(pk=id)
    except Item.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ItemSerializer(item)
        return Response(serializer.data)

    elif request.method == 'PUT':
        logger.debug("Received PUT request with data: %s", request.data)

        try:
            # Exclude certain keys before passing data to serializer
            data_to_pass = {key: value for key, value in request.data.items() if key not in ['created_by', 'modified_by', 'image']}
            serializer = ItemSerializer(item, data=data_to_pass, partial=True)  # Use partial=True for partial updates

            if not serializer.is_valid():
                print("Serializer validation errors: %s", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Saving the serializer, this is where model constraints could cause an error
            serializer.save()
            print("Item updated successfully.")
            return Response(serializer.data)

        except Exception as e:
            print("Failed to update item: %s", str(e))  # Logs the message and traceback
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
