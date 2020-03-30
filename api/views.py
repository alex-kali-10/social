from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from first_page.models import *
from django.contrib import auth
from datetime import datetime
from django.core import serializers
from django.contrib.auth.models import User

from django.contrib.auth.forms import UserCreationForm
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.renderers import StaticHTMLRenderer
from rest_framework.decorators import parser_classes
from rest_framework.parsers import JSONParser
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
from .serializer import *
from .forms import *
from rest_framework import views







@api_view(['POST'])
def registration(request, format=None):
    args = {}
    if request.method == 'POST':
        data = request.data.dict()
        form = UserCreationForm(data)
        if form.is_valid():
            form.save()
            args['errors'] = 'true'
        else:
            args['errors'] = form.errors.get_json_data(escape_html=False)
        return Response(args, status=status.HTTP_200_OK)


@api_view(['POST'])
def login(request, format=None):
    args = {}
    if request.method == 'POST':
        data = request.data.dict()
        user = auth.authenticate(username = data['username'],password = data['password'])
        if user is not None:
            auth.login(request,user)
            args['errors'] = 'false'
            args['avatarUrl'] = user.profile.avatar.url
        else:
            args['errors'] = 'true'
        return Response(args, status=status.HTTP_200_OK)


