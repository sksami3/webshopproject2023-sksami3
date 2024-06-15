from django.http import JsonResponse
from user.models import AppUser
from .serializers import AppUserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
import jwt, datetime
from rest_framework.permissions import IsAuthenticated

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
