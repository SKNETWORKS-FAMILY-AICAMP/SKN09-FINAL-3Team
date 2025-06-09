from django.urls import path
from . import views

app_name = 'assist'
urlpatterns = [
    path('', views.editor_view, name='editor'),
    path('qa/', views.qa_view, name='qa'),
    path('download/pdf/<int:draft_id>/', views.download_pdf, name='download_pdf'),
    path('download/docx/<int:draft_id>/', views.download_docx, name='download_docx'),
    path('download/hwp/<int:draft_id>/', views.download_hwp, name='download_hwp'),
]