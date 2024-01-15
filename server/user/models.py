from django.db import models
from django.contrib.auth.models import AbstractUser


class AppUser(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    email = models.EmailField(unique=True, null=True)
    roleEnum = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return self.username
