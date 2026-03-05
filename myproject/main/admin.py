from django.contrib import admin
from .models import ContactMessage
from .models import ContactMessage, PageView, DailyView

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Информация отправителя', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Сообщение', {
            'fields': ('message',)
        }),
        ('Статус', {
            'fields': ('is_read', 'created_at')
        }),
    )
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Отметить как прочитанные"
    
    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
    mark_as_unread.short_description = "Отметить как непрочитанные"
    
    actions = ['mark_as_read', 'mark_as_unread']
    

@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ('page_url', 'view_count', 'last_viewed')
    list_filter = ('last_viewed',)
    search_fields = ('page_url',)
    readonly_fields = ('last_viewed',)
    
    def has_add_permission(self, request):
        return False  # Запрещаем ручное добавление

@admin.register(DailyView)
class DailyViewAdmin(admin.ModelAdmin):
    list_display = ('page_url', 'view_date', 'view_count')
    list_filter = ('view_date', 'page_url')
    search_fields = ('page_url',)
    date_hierarchy = 'view_date'
    
    def has_add_permission(self, request):
        return False  # Запрещаем ручное добавление