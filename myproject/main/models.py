from django.db import models
from django.utils import timezone

class ContactMessage(models.Model):
    name = models.CharField('Имя', max_length=100)
    email = models.EmailField('Email')
    phone = models.CharField('Телефон', max_length=20, blank=True, null=True)
    message = models.TextField('Сообщение')
    created_at = models.DateTimeField('Дата создания', default=timezone.now)
    is_read = models.BooleanField('Прочитано', default=False)
    
    class Meta:
        verbose_name = 'Сообщение'
        verbose_name_plural = 'Сообщения'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'Сообщение от {self.name} ({self.created_at.strftime("%d.%m.%Y %H:%M")})'
    

class PageView(models.Model):
    page_url = models.CharField('URL страницы', max_length=255, db_index=True)
    view_count = models.PositiveIntegerField('Количество просмотров', default=0)
    last_viewed = models.DateTimeField('Последний просмотр', auto_now=True)
    
    class Meta:
        verbose_name = 'Просмотр страницы'
        verbose_name_plural = 'Просмотры страниц'
    
    def __str__(self):
        return f'{self.page_url} - {self.view_count} просмотров'

class DailyView(models.Model):
    page_url = models.CharField('URL страницы', max_length=255, db_index=True)
    view_date = models.DateField('Дата', default=timezone.now)
    view_count = models.PositiveIntegerField('Количество просмотров', default=0)
    
    class Meta:
        verbose_name = 'Дневной просмотр'
        verbose_name_plural = 'Дневные просмотры'
        unique_together = ['page_url', 'view_date']
    
    def __str__(self):
        return f'{self.page_url} - {self.view_date} - {self.view_count}'