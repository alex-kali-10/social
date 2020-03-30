from django.shortcuts import render , redirect
from django.contrib import auth
from django.contrib.auth.forms import UserCreationForm
from django.views.generic.edit import FormView
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
#from .forms import *
from django.http import JsonResponse
from first_page.models import *
from .models import *


def give_all_user(user):
    data = {}
    users = User.objects.filter().exclude(id = user.id)
    for item in users:
        try:
            data[item.id] = {'id':item.id,
                             'username':item.username,
                             'avatar': Profile.objects.get(user = item).avatar.url,
                             }
        except:
            pass
    return  data


def give_dialog(user,user_id):
    data = {}
    user1 = user
    user2 = User.objects.get(id = user_id)
    obj = False
    if Dialog.objects.filter(user1 = user1, user2 = user2).exists():
        obj = Dialog.objects.filter(user1 = user1, user2 = user2)
    elif Dialog.objects.filter(user1 = user2, user2 = user1).exists():
        obj = Dialog.objects.filter(user1 = user2, user2 = user1)
    if obj == False:
        Dialog.objects.create(user1=user1, user2=user2)
        obj = Dialog.objects.filter(user1 = user1, user2 = user2)
    data['id_dialog'] = obj.get().id
    data['messages'] = {}
    messages = Message.objects.filter(dialog = obj.get()).order_by('-id')[:15]
    for item in messages:
        data['messages'][item.id] = {'id': item.id,
                          'avatar': Profile.objects.get(user = item.user).avatar.url,
                         'username': item.user.username,
                         'user_id':item.user.id,
                         'text': item.message,
                         }
    return data

def add_friend(user,user_id):
    data = {}
    user1 = user
    user2 = User.objects.get(id = user_id)
    if Friends.objects.filter(user1 = user1, user2 = user2).exists() == False:
        item = Friends.objects.create(user1=user1, user2=user2)
        data = {'id': user2.id,'username': user2.username}
    return data

def delete_friend(user,user_id):
    data = {}
    user1 = user
    user2 = User.objects.get(id = user_id)
    if Friends.objects.filter(user1 = user1, user2 = user2).exists() != False:
        item = Friends.objects.get(user1=user1, user2=user2).delete()
        data = {'id':user2.id}
    return data


def delete_dialog(user,id):
    data = {}
    item = Dialog.objects.filter(user1 = user, id = id) | Dialog.objects.filter(user2 = user, id = id)
    if item.exists():
        item.get().delete()
        data = {'id': id}
    return data

def delete_news(user,id):
    data = {}
    item = News.objects.filter(user = user, id = id)
    if item.exists():
        item.get().delete()
        data = {'id': id}
    return data

def give_all_dialogs(user):
    data = {}
    dialogs = Dialog.objects.filter(user1 = user) | Dialog.objects.filter(user2 = user)
    for item in dialogs:
        if item.user1 == user:
            user2 = item.user2
        else:
            user2 = item.user1
        data[item.id] = {'id':item.id,
                         'avatar': Profile.objects.get(user = item.user2).avatar.url,
                         'username':user2.username,
                         'id_user':user2.id
                         }
        last_message = item.last_message()
        if last_message != None:
            data[item.id]['last_message'] = {'username': last_message.user.username,

                                             'avatar': last_message.user.profile.avatar.url,
                                             'message': last_message.message
                                            }
        else:
            data[item.id]['last_message'] = 'false'
    return  data

def give_all_friends(user):
    data = {}
    data['list1'] = {}
    data['list2'] = {}
    friends_list1 = Friends.objects.filter(user1 = user)
    friends_list2 = Friends.objects.filter(user2=user)
    for item in friends_list1:
        data['list1'][item.user2.id] = {'user_id':item.user2.id,'username':item.user2.username,'avatar': Profile.objects.get(user = item.user2).avatar.url,}
    for item in friends_list2:
        data['list2'][item.user1.id] = {'user_id': item.user1.id, 'username': item.user1.username,'avatar': Profile.objects.get(user = item.user1).avatar.url,}
        #data.append({'user1':item.user1.username,'user2':item.user2.username})
    return  data


def add_news(user,text):
    data = {}
    item = News.objects.create(user=user, text=text)
    last_comment = item.last_comment()
    data[item.id] = {'id': item.id,
                     'avatar': Profile.objects.get(user = item.user).avatar.url,
                     'username': item.user.username,
                     'user_id':item.user.id,
                     'text': item.text,
                     'count_likes': item.count_likes(),
                     'count_comments': item.count_comments(),
                     'meLike': item.meLike(user),
                     }
    if last_comment == None:
        data[item.id]['comments'] = {}
    else:
        data[item.id]['comments'] = {
            last_comment.id: {'id': last_comment.id, 'text': last_comment.text, 'user': last_comment.user.username,'avatar': Profile.objects.get(user = last_comment.user).avatar.url,'user_id':item.user.id,}}
    return data

def give_news(user):
    data = {}
    #News.objects.filter(user = user)
    news = (News.objects.filter(user__friends__user1_id = user.id).order_by('-id') | News.objects.filter(user = user).order_by('-id'))[:4]
    for item in news:
        last_comment= item.last_comment()
        print(last_comment)
        data[item.id] = {'id':item.id,
                         'username':item.user.username,
                         'avatar': Profile.objects.get(user = item.user).avatar.url,
                         'user_id':item.user.id,
                         'text': item.text,
                         'count_likes': item.count_likes(),
                         'count_comments': item.count_comments(),
                         'meLike': item.meLike(user),
                         }
        if last_comment == None:
            data[item.id]['comments'] = {}
        else:
            data[item.id]['comments'] = {last_comment.id:{'id': last_comment.id,'text': last_comment.text,'user': last_comment.user.username,'avatar': Profile.objects.get(user = last_comment.user).avatar.url,'user_id':item.user.id,}}
    return  data

def old_news(user,id_last_news):
    data = {}
    news = (News.objects.filter(user__friends__user1_id = user.id).order_by('-id') | News.objects.filter(user = user).order_by('-id')).filter(id__lt = id_last_news)[:4]
    print(news)
    for item in news:
        last_comment= item.last_comment()
        data[item.id] = {'id':item.id,
                         'username':item.user.username,
                         'avatar': Profile.objects.get(user = item.user).avatar.url,
                         'user_id':item.user.id,
                         'text': item.text,
                         'count_likes': item.count_likes(),
                         'count_comments': item.count_comments(),
                         'meLike': item.meLike(user),
                         }
        if last_comment == None:
            data[item.id]['comments'] = {}
        else:
            data[item.id]['comments'] = {last_comment.id:{'id': last_comment.id,'text': last_comment.text,'user': last_comment.user.username,'avatar': Profile.objects.get(user = last_comment.user).avatar.url,'user_id':item.user.id,}}
    return  data

def give_user_news(user,user_id):
    data = {}
    news = (News.objects.filter(user_id = user_id).order_by('-id'))[:4]
    for item in news:
        last_comment= item.last_comment()
        data[item.id] = {'id':item.id,
                         'username':item.user.username,
                         'avatar': Profile.objects.get(user = item.user).avatar.url,
                         'user_id':item.user.id,
                         'text': item.text,
                         'count_likes': item.count_likes(),
                         'count_comments': item.count_comments(),
                         'meLike': item.meLike(user),
                         }
        if last_comment == None:
            data[item.id]['comments'] = {}
        else:
            data[item.id]['comments'] = {last_comment.id:{'id': last_comment.id,'text': last_comment.text,'user': last_comment.user.username,'avatar': Profile.objects.get(user = last_comment.user).avatar.url,'user_id':item.user.id,}}
    return  data

def old_user_news(user,id_last_news,user_id):
    data = {}
    news = (News.objects.filter(user_id = user_id,id__lt = id_last_news).order_by('-id'))[:4]
    for item in news:
        last_comment= item.last_comment()
        data[item.id] = {'id':item.id,
                         'username':item.user.username,
                         'avatar': Profile.objects.get(user = item.user).avatar.url,
                         'user_id':item.user.id,
                         'text': item.text,
                         'count_likes': item.count_likes(),
                         'count_comments': item.count_comments(),
                         'meLike': item.meLike(user),
                         }
        if last_comment == None:
            data[item.id]['comments'] = {}
        else:
            data[item.id]['comments'] = {last_comment.id:{'id': last_comment.id,'text': last_comment.text,'user': last_comment.user.username,'avatar': Profile.objects.get(user = last_comment.user).avatar.url,'user_id':item.user.id,}}
    return  data


def add_comment_news(user,id,text):
    data = {}
    item = Comment_news.objects.create(user=user, news_id=id, text=text)
    data['comments'] = {}
    data['comments'][item.id] = {'id': item.id, 'text': item.text, 'user': item.user.username,'avatar': Profile.objects.get(user = item.user).avatar.url,'user_id':item.user.id,}
    data['news'] = id
    data['count_comments'] = Comment_news.objects.filter(news_id = id).count()
    return data


def more_comment(id_news,id_comment):
    data = {}
    data['comments'] = {}
    data['news'] = id_news
    comments = Comment_news.objects.filter(news_id = id_news, id__lt = id_comment).order_by('-id')[:3]
    for item in comments:
        data['comments'][item.id] = {'id': item.id, 'text': item.text, 'user': item.user.username,'avatar': Profile.objects.get(user = item.user).avatar.url,'user_id':item.user.id,}
    data['count_comments'] = Comment_news.objects.filter(news_id=id_news).count()
    return  data

def more_message(user1,id_message,id_dialog):
    data = {}
    obj = False
    if Dialog.objects.filter(user1 = user1, id = id_dialog).exists():
        obj = Dialog.objects.filter(user1 = user1, id = id_dialog)
    elif Dialog.objects.filter(id = id_dialog, user2 = user1).exists():
        obj = Dialog.objects.filter( id = id_dialog, user2 = user1)
    data['id_dialog'] = id_dialog
    data['messages'] = {}
    messages = Message.objects.filter(dialog = id_dialog, id__lt = id_message).order_by('-id')[:10]
    for item in messages:
        data['messages'][item.id] = {'id': item.id,
                         'username': item.user.username,
                         'avatar': Profile.objects.get(user = item.user).avatar.url,
                         'text': item.message,
                         'user_id':item.user.id,
                         }
    return  data

def like_news(user,id_news):
    data = {}
    if Like_news.objects.filter(news_id = id_news,user = user).exists() == False:
        Like_news.objects.create(news_id = id_news,user = user)
        data['id_news'] = id_news
        data['count_likes'] = News.objects.get(id = id_news).count_likes()
    return data

def delete_like_news(user,id_news):
    data = {}
    if Like_news.objects.filter(news_id = id_news,user = user).exists():
        Like_news.objects.get(news_id=id_news, user=user).delete()
        data['id_news'] = id_news
        data['count_likes'] = News.objects.get(id=id_news).count_likes()
    return data

def give_inf_user(user,user_id):
    data = {}
    user2 = User.objects.get(id = user_id)
    data['username'] = user2.username
    data['avatar'] = Profile.objects.get(user = user2).avatar.url
    return data

def delete_comment(user,id):
    data = {}
    if Comment_news.objects.filter(id = id,user = user).exists():
        item = Comment_news.objects.get(id = id)
    data['id'] = id
    item.delete()
    data['count_comments'] = item.news.count_comments()
    data['news'] = item.news.id
    return data

def last_users_likest_news(user,id_news):
    data = {}
    list_users = User.objects.filter(like_news__news_id = id_news).order_by('-id')[:6]
    for item in list_users:
        data[item.id] = {'id':item.id,
                         'avatar': Profile.objects.get(user = item).avatar.url,
                         }
    return data