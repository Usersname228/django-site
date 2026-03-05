from django.contrib import admin
from django.urls import path
from main import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('send-message/', views.send_message, name='send_message'),
    path('', views.index, name='home'),
    path('stats/', views.view_stats, name='view_stats'),
    path('anadr/', views.anadr, name='anadr'), # <-- Страница на карте
    path('cpb/', views.cpb, name='cpb'), # <-- Страница на карте
    path('gro/', views.gro, name='gro'), # <-- Страница на карте
    path('hab/', views.hab, name='hab'), # <-- Страница на карте
    path('ikytsk/', views.ikytsk, name='ikytsk'), # <-- Страница на карте
    path('kal/', views.kal, name='kal'), # <-- Страница на карте
    path('krasnd/', views.krasnd, name='krasnd'), # <-- Страница на карте
    path('krasnoir/', views.krasnoir, name='krasnoir'), # <-- Страница на карте
    path('mag/', views.mag, name='mag'), # <-- Страница на карте
    path('mos/', views.mos, name='mos'), # <-- Страница на карте
    path('nowsib/', views.nowsib, name='nowsib'), # <-- Страница на карте
    path('oren/', views.oren, name='oren'), # <-- Страница на карте
    path('sal/', views.sal, name='sal'), # <-- Страница на карте
    path('twer/', views.twer, name='twer'), # <-- Страница на карте
    path('volg/', views.volg, name='volg'), # <-- Страница на карте
    path('about/', views.about, name='about'), # <-- Для не готовых страниц
]