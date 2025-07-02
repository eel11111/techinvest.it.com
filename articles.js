// وظائف البحث والفلترة لصفحة المقالات

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const articlesList = document.getElementById('articlesList');
    const noResults = document.getElementById('noResults');
    const articles = document.querySelectorAll('.article-item');

    let currentFilter = 'all';
    let currentSearch = '';

    // وظيفة البحث
    function searchArticles(query) {
        currentSearch = query.toLowerCase();
        filterAndDisplayArticles();
    }

    // وظيفة الفلترة
    function filterArticles(category) {
        currentFilter = category;
        
        // تحديث أزرار الفلترة
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
            }
        });
        
        filterAndDisplayArticles();
    }

    // وظيفة دمج البحث والفلترة
    function filterAndDisplayArticles() {
        let visibleCount = 0;
        
        articles.forEach(article => {
            const category = article.dataset.category;
            const title = article.querySelector('.article-item-title').textContent.toLowerCase();
            const excerpt = article.querySelector('.article-item-excerpt').textContent.toLowerCase();
            
            // فحص الفئة
            const categoryMatch = currentFilter === 'all' || category === currentFilter;
            
            // فحص البحث
            const searchMatch = currentSearch === '' || 
                               title.includes(currentSearch) || 
                               excerpt.includes(currentSearch);
            
            if (categoryMatch && searchMatch) {
                article.style.display = 'grid';
                article.classList.add('fade-in-up');
                visibleCount++;
            } else {
                article.style.display = 'none';
                article.classList.remove('fade-in-up');
            }
        });
        
        // إظهار/إخفاء رسالة عدم وجود نتائج
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            articlesList.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            articlesList.style.display = 'grid';
        }
    }

    // مستمع البحث
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchArticles(this.value);
        }, 300);
    });

    // مستمعي أزرار الفلترة
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterArticles(this.dataset.filter);
        });
    });

    // مستمعي روابط الأقسام في القائمة المنسدلة
    document.querySelectorAll('.dropdown-menu a[data-filter]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            filterArticles(this.dataset.filter);
            
            // إغلاق القائمة المنسدلة
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // وظيفة تمييز النص المطابق في البحث
    function highlightSearchTerm(text, term) {
        if (!term) return text;
        
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // تحديث النتائج مع تمييز النص
    function updateSearchHighlights() {
        if (currentSearch) {
            articles.forEach(article => {
                const title = article.querySelector('.article-item-title');
                const excerpt = article.querySelector('.article-item-excerpt');
                
                // إزالة التمييز السابق
                title.innerHTML = title.textContent;
                excerpt.innerHTML = excerpt.textContent;
                
                // إضافة التمييز الجديد
                if (article.style.display !== 'none') {
                    title.innerHTML = highlightSearchTerm(title.textContent, currentSearch);
                    excerpt.innerHTML = highlightSearchTerm(excerpt.textContent, currentSearch);
                }
            });
        } else {
            // إزالة جميع التمييزات
            articles.forEach(article => {
                const title = article.querySelector('.article-item-title');
                const excerpt = article.querySelector('.article-item-excerpt');
                title.innerHTML = title.textContent;
                excerpt.innerHTML = excerpt.textContent;
            });
        }
    }

    // تحديث وظيفة البحث لتشمل التمييز
    const originalSearchArticles = searchArticles;
    searchArticles = function(query) {
        originalSearchArticles(query);
        updateSearchHighlights();
    };

    // إضافة أنماط CSS للتمييز
    const style = document.createElement('style');
    style.textContent = `
        mark {
            background-color: #fef08a;
            color: #92400e;
            padding: 0 2px;
            border-radius: 2px;
        }
    `;
    document.head.appendChild(style);

    // وظيفة إحصائيات البحث
    function updateSearchStats() {
        const visibleArticles = document.querySelectorAll('.article-item[style*="grid"]').length;
        const totalArticles = articles.length;
        
        // يمكن إضافة عرض الإحصائيات هنا
        console.log(`عرض ${visibleArticles} من أصل ${totalArticles} مقال`);
    }

    // تحديث الإحصائيات عند كل بحث أو فلترة
    const originalFilterAndDisplay = filterAndDisplayArticles;
    filterAndDisplayArticles = function() {
        originalFilterAndDisplay();
        updateSearchStats();
    };

    // وظيفة حفظ حالة البحث والفلترة في URL
    function updateURL() {
        const params = new URLSearchParams();
        if (currentFilter !== 'all') params.set('category', currentFilter);
        if (currentSearch) params.set('search', currentSearch);
        
        const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, '', newURL);
    }

    // تحميل حالة البحث والفلترة من URL
    function loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category') || 'all';
        const search = params.get('search') || '';
        
        if (search) {
            searchInput.value = search;
            currentSearch = search.toLowerCase();
        }
        
        if (category !== 'all') {
            currentFilter = category;
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === category) {
                    btn.classList.add('active');
                }
            });
        }
        
        filterAndDisplayArticles();
        updateSearchHighlights();
    }

    // تحديث URL عند التغيير
    const originalFilterArticles = filterArticles;
    filterArticles = function(category) {
        originalFilterArticles(category);
        updateURL();
    };

    const originalSearchArticlesWithURL = searchArticles;
    searchArticles = function(query) {
        originalSearchArticlesWithURL(query);
        updateURL();
    };

    // تحميل الحالة من URL عند تحميل الصفحة
    loadFromURL();

    // إضافة تأثيرات تفاعلية للمقالات
    articles.forEach(article => {
        article.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        article.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // وظيفة التحميل التدريجي (Lazy Loading) للصور
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // مراقبة الصور للتحميل التدريجي
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // إضافة وظيفة المشاركة
    function shareArticle(title, url) {
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            });
        } else {
            // نسخ الرابط إلى الحافظة
            navigator.clipboard.writeText(url).then(() => {
                showNotification('تم نسخ الرابط إلى الحافظة', 'success');
            });
        }
    }

    // إضافة أزرار المشاركة للمقالات
    articles.forEach(article => {
        const footer = article.querySelector('.article-item-footer');
        const shareBtn = document.createElement('button');
        shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
        shareBtn.className = 'share-btn';
        shareBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: var(--transition);
        `;
        
        shareBtn.addEventListener('click', () => {
            const title = article.querySelector('.article-item-title').textContent;
            shareArticle(title, window.location.href);
        });
        
        shareBtn.addEventListener('mouseenter', function() {
            this.style.color = 'var(--accent-color)';
            this.style.backgroundColor = 'var(--light-gray)';
        });
        
        shareBtn.addEventListener('mouseleave', function() {
            this.style.color = 'var(--text-secondary)';
            this.style.backgroundColor = 'transparent';
        });
        
        footer.appendChild(shareBtn);
    });

    console.log('تم تحميل وظائف صفحة المقالات بنجاح! 📚');
});

