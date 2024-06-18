import statistics
from django.contrib import admin
from django.urls import include, path
from api import settings
from userItem import views
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.user_item_list, name='user-item-list'),
    path('<int:id>', views.user_item_detail, name='user-item-detail'),
    path('byUser/<int:user_id>/', views.user_items_by_user,
         name='user-items-by-user'),
    path('deleteUnpurchasedItems/', views.delete_all_unpurchased_user_items_by_user,
         name='delete-unpurchased-items'),
    path('deleteUnpurchasedItem/', views.delete_by_user_id_and_itemId,
         name='delete-unpurchased-item'),
    path('checkPriceUpdates/', views.check_price_updates,
         name='check-price-updates'),
    path('purchaseItems/', views.purchase_items_for_user,
         name='purchase-items-for-user'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
