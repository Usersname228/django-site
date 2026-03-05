// static/js/script.js


// Функция для получения CSRF токена
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Функция для обработки отправки формы
window.submitForm = function(event) {
    event.preventDefault();
    
    // Получаем данные формы
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Показываем индикатор загрузки
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Отправляем данные на сервер
    fetch('/send-message/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            message: message
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'ok') {
            // Показываем сообщение об успехе
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            
            // Очищаем форму
            document.getElementById('contactForm').reset();
            
            console.log('Сообщение сохранено с ID:', data.id);
        } else {
            alert('Ошибка при отправке: ' + (data.message || 'Неизвестная ошибка'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при отправке. Пожалуйста, попробуйте позже.');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
    
    return false;
}

// Код для анимированного фона
function draw() { 
    con.clearRect(0, 0, WIDTH, HEIGHT); 
    for (var e = 0; e < pxs.length; e++) { 
        pxs[e].fade(); 
        pxs[e].move(); 
        pxs[e].draw(); 
    } 
} 

function Circle() { 
    WIDTH = window.innerWidth; 
    HEIGHT = window.innerHeight; 
    this.s = { 
        ttl: 8e3, 
        xmax: 5, 
        ymax: 2, 
        rmax: 10, 
        rt: 1, 
        xdef: 960, 
        ydef: 540, 
        xdrift: 4, 
        ydrift: 4, 
        random: true, 
        blink: true 
    }; 
    
    this.reset = function () { 
        this.x = this.s.random ? WIDTH * Math.random() : this.s.xdef; 
        this.y = this.s.random ? HEIGHT * Math.random() : this.s.ydef; 
        this.r = (this.s.rmax - 1) * Math.random() + 1; 
        this.dx = Math.random() * this.s.xmax * (Math.random() < .5 ? -1 : 1); 
        this.dy = Math.random() * this.s.ymax * (Math.random() < .5 ? -1 : 1); 
        this.hl = this.s.ttl / rint * (this.r / this.s.rmax); 
        this.rt = Math.random() * this.hl; 
        this.s.rt = Math.random() + 1; 
        this.stop = Math.random() * .2 + .4; 
        this.s.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1); 
        this.s.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1); 
    }; 
    
    this.fade = function () { 
        this.rt += this.s.rt; 
    }; 
    
    this.draw = function () { 
        if (this.s.blink && (this.rt <= 0 || this.rt >= this.hl)) {
            this.s.rt = this.s.rt * -1; 
        } else if (this.rt >= this.hl) {
            this.reset(); 
        }
        var e = 1 - this.rt / this.hl; 
        con.beginPath(); 
        con.arc(this.x, this.y, this.r, 0, Math.PI * 2, true); 
        con.closePath(); 
        var t = this.r * e; 
        g = con.createRadialGradient(this.x, this.y, 0, this.x, this.y, t <= 0 ? 1 : t); 
        g.addColorStop(0, "rgba(255,255,255," + e + ")"); 
        g.addColorStop(this.stop, "rgba(77,101,181," + e * .6 + ")"); 
        g.addColorStop(1, "rgba(77,101,181,0)"); 
        con.fillStyle = g; 
        con.fill(); 
    }; 
    
    this.move = function () { 
        WIDTH = window.innerWidth; 
        HEIGHT = window.innerHeight; 
        this.x += this.rt / this.hl * this.dx; 
        this.y += this.rt / this.hl * this.dy; 
        if (this.x > WIDTH || this.x < 0) this.dx *= -1; 
        if (this.y > HEIGHT || this.y < 0) this.dy *= -1; 
    }; 
    
    this.getX = function () { 
        return this.x; 
    }; 
    
    this.getY = function () { 
        return this.y; 
    }; 
} 

var WIDTH; 
var HEIGHT; 
var canvas; 
var con; 
var g; 
var pxs = new Array; 
var rint = 60; 

$(document).ready(function () { 
    WIDTH = window.innerWidth; 
    HEIGHT = window.innerHeight; 
    canvas = document.getElementById("pixie"); 
    $(canvas).attr("width", WIDTH).attr("height", HEIGHT); 
    con = canvas.getContext("2d"); 
    for (var e = 0; e < 100; e++) { 
        pxs[e] = new Circle; 
        pxs[e].reset(); 
    } 
    setInterval(draw, rint); 
}); 

$(window).resize(function() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    canvas = document.getElementById("pixie");
    $(canvas).attr("width", WIDTH).attr("height", HEIGHT);
});

// Код для слайдера
class AutoSlider {
    constructor(container) {
        this.container = container;
        this.slider = container.querySelector('.slider');
        this.slides = container.querySelectorAll('.slide');
        this.dots = container.querySelectorAll('.slider-dot');
        this.prevBtn = container.querySelector('.slider-arrow.prev');
        this.nextBtn = container.querySelector('.slider-arrow.next');
        this.autoPlayIndicator = container.querySelector('.auto-play-indicator');
        
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000;
        this.isAutoPlaying = true;
        
        this.init();
    }
    
    init() {
        this.prevBtn.addEventListener('click', () => {
            this.stopAutoPlay();
            this.prev();
            this.restartAutoPlay();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.stopAutoPlay();
            this.next();
            this.restartAutoPlay();
        });
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.stopAutoPlay();
                this.goToSlide(index);
                this.restartAutoPlay();
            });
        });
        
        this.startAutoPlay();
        
        this.container.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
            this.autoPlayIndicator.style.opacity = '0.6';
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.startAutoPlay();
            this.autoPlayIndicator.style.opacity = '1';
        });
        
        this.addSwipeSupport();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
    
    next() {
        this.currentSlide = (this.currentSlide + 1) % this.slideCount;
        this.updateSlider();
    }
    
    prev() {
        this.currentSlide = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
        this.updateSlider();
    }
    
    updateSlider() {
        const translateX = -this.currentSlide * 100;
        this.slider.style.transform = `translateX(${translateX}%)`;
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.isAutoPlaying = true;
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);
        
        this.autoPlayIndicator.style.display = 'flex';
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        this.isAutoPlaying = false;
    }
    
    restartAutoPlay() {
        setTimeout(() => {
            if (!this.isAutoPlaying) {
                this.startAutoPlay();
            }
        }, 5000);
    }
    
    addSwipeSupport() {
        let startX = 0;
        let endX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.stopAutoPlay();
        });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
            this.restartAutoPlay();
        });
    }
    
    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const swipeThreshold = 50;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }
}

// Данные по выбранным регионам
const regionsData = {
    "Тверская область": { 
        hreff: "/twer/",
        capital: "Тверь", 
        population: "1.3 млн", 
        area: "84201", 
        district: "Центральный",
        description: "Расположена в центре Европейской части России, известна своими реками и озёрами",
        coordinates: { x: 151, y: 306 }
    },
    "Московская область": { 
        hreff: "/mos/",
        capital: "Москва", 
        population: "7.7 млн", 
        area: "44329", 
        district: "Центральный",
        description: "Крупнейший по населению субъект РФ, окружает столицу страны",
        coordinates: { x: 155, y: 335 }
    },
    "Ленинградская область": { 
        hreff: "/cpb/",
        capital: "Санкт-Петербург", 
        population: "1.9 млн", 
        area: "83908", 
        district: "Северо-Западный",
        description: "Расположена вокруг Санкт-Петербурга, богата историческими памятниками",
        coordinates: { x: 168, y: 270 }
    },
    "Калининградская область": { 
        hreff: "/kal/",
        capital: "Калининград", 
        population: "1.0 млн", 
        area: "15125", 
        district: "Северо-Западный",
        description: "Самая западная территория России, анклав на берегу Балтийского моря",
        coordinates: { x: 70, y: 250 }
    },
    "Краснодарский край": { 
        hreff: "/krasnd/",
        capital: "Краснодар", 
        population: "5.7 млн", 
        area: "75485", 
        district: "Южный",
        description: "Курортный регион на черноморском побережье, житница России",
        coordinates: { x: 75, y: 440 }
    },
    "Волгоградская область": { 
        hreff: "/volg/",
        capital: "Волгоград", 
        population: "2.5 млн", 
        area: "112877", 
        district: "Южный",
        description: "Расположена на юго-востоке Европейской части России, важный промышленный центр",
        coordinates: { x: 145, y: 425 }
    },
    "Чеченская Республика": { 
        hreff: "/gro/",
        capital: "Грозный", 
        population: "1.5 млн", 
        area: "15647", 
        district: "Северо-Кавказский",
        description: "Расположена на северном склоне Большого Кавказского хребта",
        coordinates: { x: 97, y: 510 }
    },
    "Оренбургская область": { 
        hreff: "/oren/",
        capital: "Оренбург", 
        population: "2.0 млн", 
        area: "123702", 
        district: "Приволжский",
        description: "Расположена на стыке Европы и Азии, важный газодобывающий регион",
        coordinates: { x: 230, y: 450 }
    },
    "Ямало-Ненецкий автономный округ": { 
        hreff: "/sal/",
        capital: "Салехард", 
        population: "0.5 млн", 
        area: "769250", 
        district: "Уральский",
        description: "Крупнейший газодобывающий регион мира, расположен в Арктике",
        coordinates: { x: 410, y: 335 }
    },
    "Красноярский край": { 
        hreff: "/krasnoir/",
        capital: "Красноярск", 
        population: "2.9 млн", 
        area: "2366797", 
        district: "Сибирский",
        description: "Второй по площади субъект РФ, богат природными ресурсами",
        coordinates: { x: 525, y: 390 }
    },
    "Саха (Якутия)": { 
        hreff: "/ikytsk/",
        capital: "Якутск", 
        population: "1.0 млн", 
        area: "3083523", 
        district: "Дальневосточный",
        description: "Крупнейший субъект РФ, регион с экстремальными климатическими условиями",
        coordinates: { x: 690, y: 300 }
    },
    "Хабаровский край": { 
        hreff: "/hab/",
        capital: "Хабаровск", 
        population: "1.3 млн", 
        area: "787633", 
        district: "Дальневосточный",
        description: "Крупный промышленный и транспортный узел Дальнего Востока",
        coordinates: { x: 800, y: 300 }
    },
    "Магаданская область": { 
        hreff: "/mag/",
        capital: "Магадан", 
        population: "0.1 млн", 
        area: "462464", 
        district: "Дальневосточный",
        description: "Расположена на берегу Охотского моря, известна золотодобычей",
        coordinates: { x: 834, y: 230 }
    },
    "Чукотский автономный округ": { 
        hreff: "/anadr/",
        capital: "Анадырь", 
        population: "50 тыс.", 
        area: "721481", 
        district: "Дальневосточный",
        description: "Самый восточный регион России, расположен на Чукотском полуострове",
        coordinates: { x: 840, y: 120 }
    }
};

const districtColors = {
    'Центральный': '#4caf50',
    'Северо-Западный': '#2196f3',
    'Южный': '#ff9800',
    'Северо-Кавказский': '#e91e63',
    'Приволжский': '#9c27b0',
    'Уральский': '#f44336',
    'Сибирский': '#795548',
    'Дальневосточный': '#607d8b'
};

let currentPoints = [];

// Переменные для зума и панорамирования
let currentScale = 1;
let currentX = 0;
let currentY = 0;
let isDragging = false;
let startDragX, startDragY;

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM загружен");
    
    // Инициализация слайдера
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        new AutoSlider(sliderContainer);
        console.log("Слайдер инициализирован");
    }
    
    // Создание карточек регионов
    createMobileRegionCards();
    createDesktopRegionCards();
    
    // Проверка размера экрана
    checkScreenSize();
    
    // Создание карты для больших экранов
    if (window.innerWidth > 900) {
        setTimeout(() => {
            createCleanMap();
        }, 500);
    }
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        checkScreenSize();
    });
    
    // Инициализация обработчиков для зума и панорамирования
    initZoomAndPan();
});

function initZoomAndPan() {
    const zoomContainer = document.getElementById('mapZoomContainer');
    const panContainer = document.getElementById('mapPanContainer');
    
    if (!zoomContainer || !panContainer) {
        console.log("Контейнеры для зума не найдены");
        return;
    }
    
    console.log("Инициализация зума и панорамирования");
    
    // Обработчики мыши для панорамирования
    zoomContainer.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            isDragging = true;
            startDragX = e.clientX - currentX;
            startDragY = e.clientY - currentY;
            zoomContainer.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });
    
    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            currentX = e.clientX - startDragX;
            currentY = e.clientY - startDragY;
            
            // Ограничиваем перемещение
            const containerWidth = zoomContainer.clientWidth;
            const containerHeight = zoomContainer.clientHeight;
            const svg = document.getElementById('russiaMap');
            
            if (svg) {
                const contentWidth = svg.clientWidth * currentScale;
                const contentHeight = svg.clientHeight * currentScale;
                
                const maxX = Math.max(0, (contentWidth - containerWidth) / 2);
                const maxY = Math.max(0, (contentHeight - containerHeight) / 2);
                
                currentX = Math.min(maxX, Math.max(-maxX, currentX));
                currentY = Math.min(maxY, Math.max(-maxY, currentY));
            }
            
            updateTransform();
        }
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
        if (zoomContainer) {
            zoomContainer.style.cursor = 'grab';
        }
    });
    
    // Поддержка колесика мыши для зума
    zoomContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = currentScale + delta;
        
        if (newScale >= 0.5 && newScale <= 3) {
            const rect = zoomContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const scaleChange = newScale / currentScale;
            currentX = mouseX - (mouseX - currentX) * scaleChange;
            currentY = mouseY - (mouseY - currentY) * scaleChange;
            
            currentScale = newScale;
            updateTransform();
        }
    });
}

// Функции для масштабирования (доступны глобально)
window.zoomIn = function() {
    if (currentScale < 3) {
        currentScale += 0.2;
        updateTransform();
    }
};

window.zoomOut = function() {
    if (currentScale > 0.5) {
        currentScale -= 0.2;
        updateTransform();
    }
};

window.resetZoom = function() {
    currentScale = 1;
    currentX = 0;
    currentY = 0;
    updateTransform();
};

function updateTransform() {
    const panContainer = document.getElementById('mapPanContainer');
    if (panContainer) {
        panContainer.style.transform = `translate(${currentX}px, ${currentY}px) scale(${currentScale})`;
    }
}

function checkScreenSize() {
    const mapContainer = document.querySelector('.map-container');
    const controls = document.querySelector('.controls');
    const stats = document.querySelector('.stats');
    const fallback = document.querySelector('.map-fallback');
    const svg = document.getElementById('russiaMap');
    const desktopCards = document.getElementById('regionList');
    const mobileCards = document.getElementById('mobileRegionCards');
    
    if (window.innerWidth <= 900) {
        if (mapContainer) mapContainer.style.display = 'none';
        if (controls) controls.style.display = 'none';
        if (stats) stats.style.display = 'none';
        if (fallback) fallback.style.display = 'block';
        if (svg) svg.style.display = 'none';
        if (desktopCards) desktopCards.style.display = 'none';
        if (mobileCards) mobileCards.style.display = 'grid';
    } else {
        if (mapContainer) mapContainer.style.display = 'block';
        if (controls) controls.style.display = 'flex';
        if (stats) stats.style.display = 'grid';
        if (fallback) fallback.style.display = 'none';
        if (desktopCards) desktopCards.style.display = 'grid';
        if (mobileCards) mobileCards.style.display = 'none';
        
        if (svg && svg.style.display === 'none' && currentPoints.length === 0) {
            createCleanMap();
        }
    }
}

function createMobileRegionCards() {
    const container = document.getElementById('mobileRegionCards');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.keys(regionsData).forEach(regionName => {
        const regionData = regionsData[regionName];
        const card = document.createElement('div');
        card.className = 'region-card';
        card.innerHTML = `
            <div class="region-marker" style="background: ${districtColors[regionData.district]}"></div>
            <div class="region-info">
                <div class="region-name">${regionName}</div>
                <div class="region-details">${regionData.capital} • ${regionData.population}</div>
                <div class="region-details" style="color: #999; font-size: 0.8em;">${regionData.district} ФО</div>
            </div>
        `;
        
        card.addEventListener('click', function() {
            if (regionData.hreff) {
                window.location.href = regionData.hreff;
            }
        });
        
        container.appendChild(card);
    });
}

function createDesktopRegionCards() {
    const container = document.getElementById('regionList');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.keys(regionsData).forEach(regionName => {
        const regionData = regionsData[regionName];
        const card = document.createElement('div');
        card.className = 'region-card';
        card.innerHTML = `
            <div class="region-marker" style="background: ${districtColors[regionData.district]}"></div>
            <div class="region-info">
                <div class="region-name">${regionName}</div>
                <div class="region-details">${regionData.capital} • ${regionData.population}</div>
                <div class="region-details" style="color: #999; font-size: 0.8em;">${regionData.district} ФО</div>
            </div>
        `;
        
        card.addEventListener('click', function() {
            const regionData = regionsData[regionName];
            if (regionData.hreff) {
                window.location.href = regionData.hreff;
            } else {
                highlightRegionByName(regionName);
            }
        });
        
        container.appendChild(card);
    });
}

function createCleanMap() {
    const svg = document.getElementById('russiaMap');
    if (!svg) {
        console.log("SVG элемент не найден");
        return;
    }
    
    const loading = document.getElementById('loading');
    const container = document.querySelector('.map-container');
    if (!container) {
        console.log("Контейнер карты не найден");
        return;
    }
    
    console.log("Создание карты...");
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 1000 600`);
    
    // Очищаем SVG
    svg.innerHTML = '';
    
    // Добавляем прозрачный фон
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', 'transparent');
    svg.appendChild(background);
    
    // Добавляем точки регионов
    Object.keys(regionsData).forEach(regionName => {
        const regionData = regionsData[regionName];
        
        // Создаем точку
        const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        point.setAttribute('class', 'region-point');
        point.setAttribute('cx', regionData.coordinates.x);
        point.setAttribute('cy', regionData.coordinates.y);
        point.setAttribute('r', '8');
        point.setAttribute('data-name', regionName);
        
        // Создаем подпись
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', regionData.coordinates.x);
        label.setAttribute('y', regionData.coordinates.y - 15);
        label.setAttribute('class', 'region-label');
        label.textContent = regionName;
        
        // Добавляем обработчики событий
        point.addEventListener('mouseover', function(event) {
            handlePointHover(event, regionName, regionData);
        });
        
        point.addEventListener('mouseout', function(event) {
            handlePointLeave(event);
        });
        
        point.addEventListener('click', function(event) {
            handlePointClick(regionName, regionData);
        });
        
        svg.appendChild(point);
        svg.appendChild(label);
        currentPoints.push(point);
    });
    
    if (loading) loading.style.display = 'none';
    svg.style.display = 'block';
    
    console.log("Карта создана, добавлено точек:", currentPoints.length);
}

function handlePointHover(event, regionName, regionData) {
    const point = event.target;
    point.setAttribute('r', '12');
    point.style.fill = '#ff0000';
    
    updateInfoPanel(regionName, regionData);
    document.getElementById('infoPanel').style.display = 'block';
}

function handlePointLeave(event) {
    const point = event.target;
    point.setAttribute('r', '8');
    point.style.fill = '#ff4444';
    point.classList.remove('highlighted');
    
    setTimeout(() => {
        const infoPanel = document.getElementById('infoPanel');
        if (infoPanel && !infoPanel.matches(':hover')) {
            infoPanel.style.display = 'none';
        }
    }, 200);
}

function handlePointClick(regionName, regionData) {
    if (regionData.hreff) {
        window.location.href = regionData.hreff;
    } else {
        showRegionDetails(regionName, regionData);
    }
}

function highlightRegionByName(regionName) {
    const point = currentPoints.find(p => p.getAttribute('data-name') === regionName);
    if (point) {
        const regionData = regionsData[regionName];
        
        point.classList.add('highlighted');
        point.setAttribute('r', '14');
        
        updateInfoPanel(regionName, regionData);
        document.getElementById('infoPanel').style.display = 'block';
        
        setTimeout(() => {
            point.classList.remove('highlighted');
            point.setAttribute('r', '8');
        }, 5000);
    }
}

function updateInfoPanel(name, data) {
    document.getElementById('regionName').textContent = name;
    document.getElementById('regionCapital').textContent = data.capital;
    document.getElementById('regionPopulation').textContent = data.population;
    document.getElementById('regionArea').textContent = data.area + ' км²';
    document.getElementById('regionDistrict').textContent = data.district;
    document.getElementById('regionDescription').textContent = data.description;
    
    const badge = document.getElementById('districtBadge');
    badge.textContent = data.district;
    badge.style.background = districtColors[data.district];
}

function showRegionDetails(name, data) {
    const details = `
📍 ${name}

🏛️ Столица: ${data.capital}
👥 Население: ${data.population}
📏 Площадь: ${data.area} км²
🗺️ Федеральный округ: ${data.district}

📝 ${data.description}
    `.trim();
    
    alert(details);
}

window.filterByDistrict = function(district) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    currentPoints.forEach(point => {
        const regionName = point.getAttribute('data-name');
        const regionData = regionsData[regionName];
        
        if (district === 'all' || (regionData && regionData.district === district)) {
            point.style.display = 'block';
            point.style.opacity = '1';
            if (point.nextSibling) point.nextSibling.style.display = 'block';
        } else {
            point.style.opacity = '0.3';
            if (point.nextSibling) point.nextSibling.style.display = 'none';
        }
    });
};

window.addEventListener('resize', function() {
    const svg = document.getElementById('russiaMap');
    if (svg && svg.style.display !== 'none') {
        const container = document.querySelector('.map-container');
        if (container) {
            svg.setAttribute('width', container.clientWidth);
            svg.setAttribute('height', container.clientHeight);
        }
    }
});

// Обработчик для информационной панели
const infoPanel = document.getElementById('infoPanel');
if (infoPanel) {
    infoPanel.addEventListener('mouseleave', () => {
        infoPanel.style.display = 'none';
    });
}

// Бургер-меню
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinks = document.getElementById('navLinks');
    
    // Создаем оверлей (затемнение фона), если его нет
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }
    
    // Функция открытия меню
    function openMenu() {
        burgerMenu.classList.add('active');
        navLinks.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Функция закрытия меню
    function closeMenu() {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Функция переключения меню
    function toggleMenu() {
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // Открытие/закрытие при клике на бургер
    if (burgerMenu) {
        burgerMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    // Закрытие при клике на оверлей
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }
    
    // Закрытие при клике на ссылку в меню
    const navLinksItems = document.querySelectorAll('.nav-link');
    navLinksItems.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Закрытие при нажатии на ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Сброс при ресайзе окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Подсветка активной ссылки при прокрутке
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
});