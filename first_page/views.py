from django.shortcuts import render , redirect
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.views.generic.edit import FormView
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .forms import *
from django.http import JsonResponse

def register(request):
    args = {}
    user = auth.get_user(request)
    args['user'] = user
    return render(request, 'first_page.html', args)


def change_avatar(request):
    args = {}
    user = auth.get_user(request)
    args['user'] = user

    try:
        profile = request.user.profile
    except UserProfile.DoesNotExist:
        profile = Profile(user=request.user)
    print(profile)
    if request.method == "POST":
        print(request.POST)
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            avatar = form.save()
            #avatar.user = user
            #avatar.save()
            print('сохранил')
            return redirect('/main/')
    else:
        form = ProfileForm(instance=profile)
    args['form'] = form
    return render(request, 'change_avatar.html', args)
