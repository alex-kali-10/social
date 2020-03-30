from django.contrib import admin
from django.urls import path
from django.conf.urls import url,include
from django.conf.urls.static import static
from django.conf import settings

from . import views


urlpatterns = [
    path('', views.feed),
    path('<page>/', views.feed_page),
    path('<page>/<page_id>/', views.feed_page_id),
]