from .models import PageView, DailyView
from django.db.models import Sum
from django.utils import timezone

def page_view_stats(request):
    """Контекстный процессор для передачи статистики просмотров в шаблоны"""
    context = {}
    
    try:
        # Текущая страница - получаем путь без слэша в конце для консистентности
        current_path = request.path_info.rstrip('/')
        if not current_path:
            current_path = '/'
            
        print(f"Processing stats for path: {current_path}")  # Для отладки
        
        # Получаем данные для текущей страницы
        current_page_view = PageView.objects.filter(page_url=current_path).first()
        
        # Общая статистика
        total_views = PageView.objects.aggregate(total=Sum('view_count'))['total'] or 0
        
        # Статистика за сегодня
        today = timezone.now().date()
        today_views = DailyView.objects.filter(view_date=today).aggregate(
            total=Sum('view_count')
        )['total'] or 0
        
        # Количество страниц
        total_pages = PageView.objects.count()
        
        context.update({
            'current_page_views': current_page_view.view_count if current_page_view else 0,
            'total_site_views': total_views,
            'total_pages_count': total_pages,
            'today_views': today_views,
        })
        
        print(f"Stats: current={context['current_page_views']}, total={total_views}, today={today_views}")  # Для отладки
        
    except Exception as e:
        print(f"Error in page view context processor: {e}")
        context.update({
            'current_page_views': 0,
            'total_site_views': 0,
            'total_pages_count': 0,
            'today_views': 0,
        })
    
    return context