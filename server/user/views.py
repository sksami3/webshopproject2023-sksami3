import traceback
from django.conf import settings
from django.http import JsonResponse
from item.models import Item
from userItem.models import userItem
from .serializers import AppUserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
import jwt, datetime
from rest_framework.permissions import IsAuthenticated
from .models import AppUser
from django.shortcuts import render, redirect
from django.http import HttpResponse

import random
import os

@api_view(['GET'])
def user_list(request, format=None):
        users = AppUser.objects.all()
        serializer = AppUserSerializer(users, many=True)
        return Response(serializer.data)

@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, id, format=None):

    try:
        user = AppUser.objects.get(pk=id)
    except AppUser.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AppUserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = AppUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['PUT'])
def change_password(request):
    data = request.data
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')
    user_id = data.get('userId')

    # Attempt to retrieve the user by userId
    try:
        user = AppUser.objects.get(pk=user_id)
    except AppUser.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Check if the old password is correct
    if not user.check_password(old_password):
        return Response({'error': 'Old password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

    # If the old password is correct, set the new password
    user.set_password(new_password)
    user.save()

    return Response({'message': 'Password successfully changed.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def populate_db(request):
    try:
        print('in migration')
        # Clear existing data
        AppUser.objects.all().delete()
        Item.objects.all().delete()

        # Create users
        users = []
        plain_passwords = []  # To store plain passwords for writing to file
        for i in range(6):
            username = f'testuser#{i+1}'
            password = 'pass#'  # Store the plain password
            plain_passwords.append(password)
            hashed_password = make_password(password)
            email = f'testuser#{i+1}@shop.aa'
            user = AppUser(username=username, password=hashed_password, email=email)
            users.append(user)
        AppUser.objects.bulk_create(users)

        # Create items for the first 3 users
        sellers = AppUser.objects.all()[:3]
        items = []
        user_item_data = []
        for user in sellers:
            for j in range(10):
                title = f'Item{j+1}'
                price = round(random.uniform(1.0, 100.0), 2)
                quantity = random.randint(1, 50)
                description = f'Description for {title}'
                item = Item(title=title, price=price, quantity=quantity, description=description, created_by=user)
                item.save()
                items.append(item)
                user_item_data.append(f'{user.username} created {title}')

        # Generate the text file with user and item information
        file_path = os.path.join(settings.MEDIA_ROOT, 'user_item_info.txt')
        if not os.path.exists(settings.MEDIA_ROOT):
            os.makedirs(settings.MEDIA_ROOT)
            
        with open(file_path, 'w') as file:
            for i, user in enumerate(AppUser.objects.all()):
                file.write(f'Username: {user.username}, Email: {user.email}, Password: {plain_passwords[i]}\n')
            file.write('\n')
            for entry in user_item_data:
                file.write(f'{entry}\n')

        # Update landing page with message
        return JsonResponse({'message': 'Database populated successfully.', 'file_path': file_path})

    except Exception as e:
        error_message = str(e)
        error_traceback = traceback.format_exc()
        print(f'Error: {error_message}')
        print(f'Traceback: {error_traceback}')
        return JsonResponse({'message': 'An error occurred during database population.', 'error': error_message})

@api_view(['GET'])
def get_credential_file(request):
    file_path = os.path.join(settings.MEDIA_ROOT, 'user_item_info.txt')
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            content = file.read()
        return HttpResponse(content, content_type='text/plain')
    else:
        return Response({'error': 'File not found.'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def check_if_credential_file_exists(request):
    file_path = os.path.join(settings.MEDIA_ROOT, 'user_item_info.txt')
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            content = file.read()
        return JsonResponse({'isFileExists': True})
    else:
        return JsonResponse({'isFileExists': False})

class RegisterView(APIView):
    def post(self, request):
        serializer = AppUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        user = AppUser.objects.filter(username=username).first()

        if user is None:
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=2880),
            'iat': datetime.datetime.utcnow(),
            'username': username
        }

        token = jwt.encode(payload, 'dotnetisthefuture', algorithm='HS256')#.decode('utf-8')

        response = Response()

        #response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'jwt': token
        }
        return response


class UserView(APIView):

    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithm=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = AppUser.objects.filter(id=payload['id']).first()
        serializer = AppUserSerializer(user)
        return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response
