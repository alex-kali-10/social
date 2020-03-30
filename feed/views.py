from django.shortcuts import render , redirect
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.views.generic.edit import FormView
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
#from .forms import *
from django.http import JsonResponse
from first_page.models import *

def feed(request):
    args = {}
    user = auth.get_user(request)
    args['user'] = user
    args['avatarUrl'] = Profile.objects.filter(user = user).get().avatar.url
    args['page'] = 'false'
    args['page_id'] = ''
    return render(request, 'feed.html', args)

def feed_page(request,page):
    args = {}
    user = auth.get_user(request)
    args['user'] = user
    args['avatarUrl'] = Profile.objects.filter(user = user).get().avatar.url
    args['page'] = page
    args['page_id'] = ''
    return render(request, 'feed.html', args)

def feed_page_id(request,page,page_id):
    args = {}
    user = auth.get_user(request)
    args['user'] = user
    args['avatarUrl'] = Profile.objects.filter(user = user).get().avatar.url
    args['page'] = page
    args['page_id'] = page_id
    return render(request, 'feed.html', args)