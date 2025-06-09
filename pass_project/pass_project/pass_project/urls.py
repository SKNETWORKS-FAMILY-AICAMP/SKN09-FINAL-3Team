"""
URL configuration for pass_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),           # 메인 페이지
    path('accounts/', include('accounts.urls')), # 로그인, 마이페이지
    path('user_admin/', include('user_admin.urls')),    # 관리자 페이지
    path('assist/', include('assist.urls')),  # AI 기능
]

if settings.DEBUG:
    from django.contrib.staticfiles.views import serve
    urlpatterns += static(settings.STATIC_URL, view=serve)