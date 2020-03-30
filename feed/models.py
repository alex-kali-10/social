from django.db import models
from django.contrib.auth.models import User


class Dialog(models.Model):
    user1 = models.ForeignKey(User,related_name = 'dialogUser1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, on_delete=models.CASCADE)
    def last_message(self):
        return Message.objects.filter(dialog = self).last()

class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dialog = models.ForeignKey(Dialog, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=100)


class Friends(models.Model):
    class Meta():
        db_table = 'friends'
    user1 = models.ForeignKey(User, related_name='friends1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, on_delete=models.CASCADE)

class News(models.Model):
    class Meta():
        db_table = 'news'
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    def count_likes(self):
        return Like_news.objects.filter(news = self).count()
    def count_comments(self):
        return Comment_news.objects.filter(news = self).count()
    def last_comment(self):
        return Comment_news.objects.filter(news = self).last()
    def meLike(self,user):
        return Like_news.objects.filter(news = self,user = user).exists()


class Like_news(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    news = models.ForeignKey(News, on_delete=models.CASCADE)

class Comment_news(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    news = models.ForeignKey(News, on_delete=models.CASCADE)
    text = models.CharField(max_length=200)