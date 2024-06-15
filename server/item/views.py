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
    try:
        item = Item.objects.get(pk=id)
    except Item.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ItemSerializer(item)
        return Response(serializer.data)

    elif request.method == 'PUT':
        logger = logging.getLogger(__name__)

        try:
            print(request.data)
            # If 'created_by', 'modified_by', or 'image' data is present in the request, exclude them from serializer initialization
            data_to_pass = {key: value for key, value in request.data.items() if key not in ['created_by', 'modified_by', 'image']}

            # Initialize the serializer with the provided item and the filtered request data
            serializer = ItemSerializer(item, data=data_to_pass)
            if not serializer.is_valid():
                print("Serializer errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("An error occurred while initializing the serializer:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            logger.info("Data is valid")

            # Remove 'created_by' and 'modified_by' fields if not being updated
            if 'created_by' in serializer.validated_data:
                del serializer.validated_data['created_by']
            if 'modified_by' in serializer.validated_data:
                del serializer.validated_data['modified_by']

            # Save the serializer
            serializer.save()
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
