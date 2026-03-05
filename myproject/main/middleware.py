from django.utils import timezone
from .models import PageView, DailyView
import re

class PageViewMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # Список путей, которые не нужно учитывать
        self.exclude_paths = [
            r'^/admin/',
            r'^/static/',
            r'^/media/',
            r'^/send-message/',
            r'^/favicon.ico',
            r'^/robots.txt',
        ]
    
    def __call__(self, request):
        # Получаем ответ
        response = self.get_response(request)
        
        # Проверяем, нужно ли учитывать этот путь
        path = request.path_info.rstrip('/')
        if not path:
            path = '/'
            
        if not self.should_count_view(path):
            return response
        
        # Увеличиваем счетчик просмотров
        self.increment_view_count(path)
        
        return response
    
    def should_count_view(self, path):
        """Проверяет, нужно ли учитывать просмотр для данного пути"""
        # Исключаем административные и статические пути
        for pattern in self.exclude_paths:
            if re.match(pattern, path):
                return False
        return True
    
    def increment_view_count(self, path):
        """Увеличивает счетчик просмотров для страницы"""
        from django.db import transaction
        
        try:
            with transaction.atomic():
                # Обновляем общий счетчик
                page_view, created = PageView.objects.get_or_create(
                    page_url=path,
                    defaults={'view_count': 1}
                )
                
                if not created:
                    page_view.view_count += 1
                    page_view.save()
                
                # Обновляем дневной счетчик
                today = timezone.now().date()
                daily_view, created = DailyView.objects.get_or_create(
                    page_url=path,
                    view_date=today,
                    defaults={'view_count': 1}
                )
                
                if not created:
                    daily_view.view_count += 1
                    daily_view.save()
                    
                print(f"Incremented view count for {path}: now {page_view.view_count}")  # Для отладки
                    
        except Exception as e:
            print(f"Error counting page view: {e}")