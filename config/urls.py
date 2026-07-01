from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('management/', include('apps.for_admin.urls')),
    path('', include('apps.foruser.urls')),
    path('head/', include('apps.map.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

