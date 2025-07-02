// تفعيل التمرير السلس
document.documentElement.classList.add('smooth-scroll');

// قائمة التنقل المتجاوبة
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// إغلاق القائمة عند النقر على رابط
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// تغيير شريط التنقل عند التمرير
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.backdropFilter = 'none';
    }
});

// تفعيل الروابط النشطة في التنقل
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// تأثيرات الظهور عند التمرير
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// مراقبة العناصر للتأثيرات
document.querySelectorAll('.article-card, .category-card, .section-header').forEach(el => {
    observer.observe(el);
});

// نموذج النشرة الإخبارية
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('.newsletter-input').value;
        
        if (email) {
            // محاكاة إرسال البيانات
            showNotification('تم الاشتراك بنجاح! شكرًا لك.', 'success');
            e.target.reset();
        }
    });
}

// نظام الإشعارات
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // إخفاء الإشعار تلقائيًا
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
    
    // إغلاق الإشعار يدويًا
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
}

// تحسين الأداء - تأخير تحميل الصور
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// تفعيل تحميل الصور المؤجل
lazyLoadImages();

// تأثيرات التمرير المتقدمة
let ticking = false;

function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-graphic');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
    
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

window.addEventListener('scroll', requestScrollUpdate);

// تحسين التفاعل مع البطاقات
document.querySelectorAll('.article-card, .category-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// البحث السريع (للاستخدام المستقبلي)
function initQuickSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value.toLowerCase();
                // تنفيذ البحث هنا
                console.log('البحث عن:', query);
            }, 300);
        });
    }
}

// تفعيل البحث السريع
initQuickSearch();

// حفظ تفضيلات المستخدم
function saveUserPreferences() {
    const preferences = {
        theme: 'light', // يمكن إضافة الوضع الداكن لاحقًا
        language: 'ar'
    };
    
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

// تحميل تفضيلات المستخدم
function loadUserPreferences() {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
        const preferences = JSON.parse(saved);
        // تطبيق التفضيلات
        console.log('تم تحميل التفضيلات:', preferences);
    }
}

// تفعيل نظام التفضيلات
loadUserPreferences();

// تحسين الوصولية
document.addEventListener('keydown', (e) => {
    // التنقل بالكيبورد
    if (e.key === 'Escape') {
        // إغلاق القوائم المفتوحة
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// تحسين الأداء على الأجهزة المحمولة
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// إضافة تأثيرات الكتابة المتحركة للعنوان الرئيسي
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// تفعيل تأثير الكتابة عند تحميل الصفحة
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
});

// إضافة مؤشر التحميل
function showLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-spinner"></div>
        <p>جاري التحميل...</p>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(19, 24, 38, 0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        color: white;
    `;
    
    document.body.appendChild(loader);
    
    // إخفاء المؤشر عند اكتمال التحميل
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(loader);
            }, 500);
        }, 1000);
    });
}

// تفعيل مؤشر التحميل
// showLoader();

console.log('تم تحميل جميع السكريبتات بنجاح! 🚀');

