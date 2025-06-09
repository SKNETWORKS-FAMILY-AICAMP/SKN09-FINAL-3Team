from django.urls import path
from . import views

app_name = 'user_admin'
urlpatterns = [
    path('user/', views.user_management_view, name='user'),
    path('group/', views.group_management_view, name='group'),
]