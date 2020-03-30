from django.contrib import admin
from django.urls import path
from django.conf.urls import url,include
from django.conf.urls.static import static
from django.conf import settings

from . import views


urlpatterns = [
    path('', views.register),
    path('change_avatar', views.change_avatar),
]
