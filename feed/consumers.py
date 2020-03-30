from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from .give_data import *


class PersonalConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'personalChannel_%s' % self.room_name
        self.user = self.scope["user"]
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        if int(self.user.id) == int(self.room_name):
            self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'data': text_data_json,
            }
        )

    def chat_message(self, event):
        message = event['data']['message']
        data = {}
        print(event['data'])
        if message == 'give_all_user':
            data = give_all_user(self.user)

        if message == "give_dialog":
            data = give_dialog(self.user,event['data']['id_user'])

        if message == "more_message":
            data = more_message(self.user,event['data']['id_message'],event['data']['id_dialog'])

        if message == "give_all_dialogs":
            data = give_all_dialogs(self.user)

        if message == "add_friend":
            data = add_friend(self.user, event['data']['id_user'])

        if message == "give_all_friends":
            data = give_all_friends(self.user)

        if message == "add_news":
            data = add_news(self.user, event['data']['text'])

        if message == "give_news":
            data = give_news(self.user)

        if message == "delete_friend":
            data = delete_friend(self.user, event['data']['id_user'])

        if message == "delete_dialog":
            data = delete_dialog(self.user, event['data']['id'])

        if message == "delete_news":
            data = delete_news(self.user, event['data']['id'])

        if message == "delete_comment":
            data = delete_comment(self.user, event['data']['id'])

        if message == "add_comment_news":
            data = add_comment_news(self.user, event['data']['id'], event['data']['text'])

        if message == "more_comment":
            data = more_comment(event['data']['id_news'], event['data']['id_comment'])

        if message == "give_user_news":
            data = give_user_news(self.user,event['data']['user_id'])

        if message == "like_news":
            data = like_news(self.user,event['data']['id'])

        if message == "delete_like_news":
            data = delete_like_news(self.user,event['data']['id'])

        if message == "old_news":
            data = old_news(self.user,event['data']['id_last_news'])

        if message == "old_user_news":
            data = old_user_news(self.user,event['data']['id_last_news'],event['data']['user_id'])

        if message == "give_inf_user":
            data = give_inf_user(self.user,event['data']['id_user'])

        if message == "last_users_likest_news":
            data = last_users_likest_news(self.user,event['data']['id_news'])

        self.send(text_data=json.dumps({
            'message': message,
            'data': data,
        }))





class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        item = Dialog.objects.get(id = self.room_name)
        if item.user1 == self.user or item.user2 == self.user:
            self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if text_data_json['method'] == 'add_message':
            message = text_data_json['message']
            item = Message.objects.create(user=self.user, message=message,
                                          dialog_id=self.scope['url_route']['kwargs']['room_name'])
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'id': item.id,
                    'text': item.message,
                    'username': item.user.username,
                }
            )
        else:
            Message.objects.get(id = text_data_json['id'],user = self.user).delete()
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'delete_message',
                    'id': text_data_json['id'],
                }
            )

    # Receive message from room group
    def chat_message(self, event):
        self.send(text_data=json.dumps({
            'method':'add_message',
            'id': event['id'],
            'text': event['text'],
            'username': event['username'],
        }))

    def delete_message(self, event):
        self.send(text_data=json.dumps({
            'method': 'delete_message',
            'id': event['id']
        }))