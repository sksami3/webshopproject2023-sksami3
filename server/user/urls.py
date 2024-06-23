
from django.contrib import admin
from django.urls import path
from user import views
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.user_list),
    path('<int:id>', views.user_detail),
    path('register', views.RegisterView.as_view()),
    path('login', views.LoginView.as_view()),
    path('logout', views.LogoutView.as_view()),
    path('change_password', views.change_password),
    path('auto_migration', views.populate_db),
    path('get_credential_file', views.get_credential_file),
    path('check_if_credential_file_exists', views.check_if_credential_file_exists),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = format_suffix_patterns(urlpatterns)
