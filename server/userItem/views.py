from django.http import JsonResponse
from user.models import AppUser
from .models import userItem
from .serializers import userItemSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

@api_view(['GET', 'POST'])
def user_item_list(request, format=None):
    if request.method == 'GET':
        user_items = userItem.objects.all()
        serializer = userItemSerializer(user_items, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = userItemSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data.get('user')
            item = serializer.validated_data.get('item')
            with transaction.atomic():
                # Use select_for_update to lock the rows
                existing_item = userItem.objects.select_for_update().filter(user=user, item=item, isPurchased=False).first()
                if existing_item:
                    return Response({"error": "An unpurchased item already exists for this user-item combination."}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
def user_item_detail(request, id, format=None):
    try:
        user_id = request.data.get('user')
        user_item = userItem.objects.get(user_id=user_id, item_id=id, isPurchased=False)
    except userItem.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        serializer = userItemSerializer(user_item)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = userItemSerializer(user_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def user_items_by_user(request, user_id, format=None):
    try:
        user = AppUser.objects.get(pk=user_id)
    except AppUser.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user_items = userItem.objects.filter(user=user, isPurchased=False)
    serializer = userItemSerializer(user_items, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_all_unpurchased_user_items_by_user(request, format=None):
    # Extract userId from the request data
    user_id = request.data.get('user')

    if not user_id:
        return Response({"error": "Missing userId in the request."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Fetch all userItem records with the given userId where isPurchased is False
        user_items = userItem.objects.filter(user_id=user_id, isPurchased=False)
        if not user_items.exists():
            return Response({"error": "No unpurchased items found for the user."}, status=status.HTTP_404_NOT_FOUND)
        
        # Delete all matching items
        user_items.delete()
        return Response({"message": "All unpurchased items for the user have been deleted."}, status=status.HTTP_204_NO_CONTENT)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['DELETE'])
def delete_by_user_id_and_itemId(request, format=None):
    # Extract userId and itemId from the request data
        user_id = request.data.get('user')
        item_id = request.data.get('item')

        if not (user_id and item_id):
            return Response({"error": "Missing userId or itemId in the request."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Fetch the userItem based on userId, itemId, and isPurchased=False
            user_item = userItem.objects.get(user_id=user_id, item_id=item_id, isPurchased=False)
            user_item.delete()
        except userItem.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
        
@api_view(['POST'])
def check_price_updates(request, format=None):
    user_id = request.data.get('user');

    if not (user_id):
        return Response({"error": "Missing userId in the request."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_items = userItem.objects.filter(user_id=user_id, isPurchased=False, isPriceUpdated=True)
        
        if user_items.exists():
            # Serialize data if items with updated prices are found
            items_with_updates = []
            for user_item in user_items:
                item_data = {
                    "itemName": user_item.item.title,
                    "previousPrice": float(user_item.previousPrice) if user_item.previousPrice else None,
                    "currentPrice": float(user_item.item.price)
                }
                items_with_updates.append(item_data)
                
            return JsonResponse({"result": True, "items": items_with_updates})
        else:
            # Return false if no updated prices are found
            return JsonResponse({"result": False}, safe=False)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['POST'])
def purchase_items_for_user(request):
    user_id = request.data.get('user')
    if not user_id:
        return Response({"error": "Missing userId in the request."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            user_items = userItem.objects.select_related('item').filter(user_id=user_id, isPurchased=False)

            if not user_items.exists():
                return Response({"error": "No unpurchased items found for the user."}, status=status.HTTP_404_NOT_FOUND)

            insufficient_stock_items = []
            # Check stock levels
            for user_item in user_items:
                if user_item.item.quantity < user_item.ordered_quantity:
                    insufficient_stock_items.append(user_item.item.title)

            if insufficient_stock_items:
                # If any items do not have enough stock, return an error and rollback the transaction
                return Response({"error": f"The product(s): {', '.join(insufficient_stock_items)} has not enough stock, please remove/reduce the quantity and order again"}, status=status.HTTP_400_BAD_REQUEST)

            # Deduct quantities and mark as purchased
            for user_item in user_items:
                user_item.item.quantity -= user_item.ordered_quantity
                user_item.item.save()
                user_item.isPurchased = True
                user_item.save()

            return Response({"message": "All items for the user have been marked as purchased and quantities updated."}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)