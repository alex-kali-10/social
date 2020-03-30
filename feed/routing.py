from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/PersonalChannel/(?P<room_name>\w+)/$', consumers.PersonalConsumer),
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer),
]