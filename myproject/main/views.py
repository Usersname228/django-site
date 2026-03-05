from django.shortcuts import render
from django.core.mail import send_mail
from django.http import JsonResponse
from django.conf import settings
from django.core.mail import EmailMessage
from .models import ContactMessage
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.admin.views.decorators import staff_member_required
from .models import PageView, DailyView
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
import logging
import json

@staff_member_required
def view_stats(request):
    """Представление для отображения статистики просмотров (только для админов)"""
    
    # Общая статистика
    total_views = PageView.objects.aggregate(total=Sum('view_count'))['total'] or 0
    total_pages = PageView.objects.count()
    
    # Статистика за последние 7 дней
    last_week = timezone.now().date() - timedelta(days=7)
    weekly_stats = DailyView.objects.filter(
        view_date__gte=last_week
    ).values('view_date').annotate(
        total=Sum('view_count')
    ).order_by('view_date')
    
    # Топ-10 страниц
    top_pages = PageView.objects.order_by('-view_count')[:10]
    
    context = {
        'total_views': total_views,
        'total_pages': total_pages,
        'weekly_stats': weekly_stats,
        'top_pages': top_pages,
    }
    
    return render(request, 'admin/view_stats.html', context)

@require_POST
def send_message(request):
    try:
        data = json.loads(request.body)
        
        # Создаем новое сообщение
        message = ContactMessage.objects.create(
            name=data.get('name', ''),
            email=data.get('email', ''),
            phone=data.get('phone', ''),
            message=data.get('message', '')
        )
        
        return JsonResponse({
            'status': 'ok',
            'message': 'Сообщение успешно отправлено',
            'id': message.id
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)

def index(request):
    return render(request, 'main/index.html')

def anadr(request):
    context = {
        'anadr_url': 'anadr'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/Anadr.html', context)

def cpb(request):
    context = {
        'cpb_url': 'cpb'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/CPB.html', context)

def gro(request):
    context = {
        'gro_url': 'gro'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/Gro.html', context)

def hab(request):
    context = {
        'hab_url': 'hab'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/Hab.html', context)

def ikytsk(request):
    context = {
        'ikytsk_url': 'ikytsk'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/Ikytsk.html', context)

def kal(request):
    context = {
        'kal_url': 'kal'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/Kal.html', context)

def krasnd(request):
    context = {
        'krasnd_url': 'krasnd'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/Krasnd.html', context)

def krasnoir(request):
    context = {
        'krasnoir_url': 'krasnoir'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/Krasnoir.html', context)

def mag(request):
    context = {
        'mag_url': 'mag'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/Mag.html', context)

def mos(request):
    context = {
        'mos_url': 'mos'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/Mos.html', context)

def nowsib(request):
    context = {
        'nowsib_url': 'nowsib'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/NOWSIB.html', context)

def oren(request):
    context = {
        'oren_url': 'oren'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/Oren.html', context)

def sal(request):
    context = {
        'sal_url': 'sal'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/Sal.html', context)

def twer(request):
    context = {
        'twer_url': 'twer'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/Twer.html', context)

def volg(request):
    context = {
        'volg_url': 'volg'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/Volg.html', context)

def about(request):
    context = {
        'about_url': 'about'  # или можно сразу 'about/'
    }
    return render(request, 'main/site_html/About.html', context)