from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf.urls import url
from django.conf import settings

urlpatterns = [
    path('', views.index,name='index'),
    url(r'^mail/$',views.mail,name='mail'),
    path('sendmail/', views.send_mail, name='sendmail'),
    url(r'^api/v1.0/get_user_detail/$',views.find_user_content),
    url(r'delete/mail', views.delete_message),
    
 ]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
