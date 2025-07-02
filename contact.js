// وظائف صفحة اتصل بنا

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const formMessage = document.getElementById('formMessage');
    const faqItems = document.querySelectorAll('.faq-item');

    // وظيفة إرسال النموذج
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // تعطيل الزر وإظهار مؤشر التحميل
        submitBtn.disabled = true;
        loadingSpinner.style.display = 'inline-block';
        submitBtn.textContent = 'جاري الإرسال...';
        
        // جمع بيانات النموذج
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        try {
            // محاكاة إرسال البيانات (يمكن استبدالها بـ API حقيقي)
            await simulateFormSubmission(data);
            
            // إظهار رسالة النجاح
            showMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', 'success');
            
            // إعادة تعيين النموذج
            contactForm.reset();
            
        } catch (error) {
            // إظهار رسالة الخطأ
            showMessage('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            // إعادة تفعيل الزر
            submitBtn.disabled = false;
            loadingSpinner.style.display = 'none';
            submitBtn.textContent = 'إرسال الرسالة';
        }
    });

    // وظيفة محاكاة إرسال النموذج
    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            // محاكاة تأخير الشبكة
            setTimeout(() => {
                // محاكاة نجاح الإرسال (90% نجاح)
                if (Math.random() > 0.1) {
                    console.log('تم إرسال البيانات:', data);
                    resolve();
                } else {
                    reject(new Error('فشل في الإرسال'));
                }
            }, 2000);
        });
    }

    // وظيفة إظهار الرسائل
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // إخفاء الرسالة بعد 5 ثوان
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
        
        // التمرير إلى الرسالة
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // التحقق من صحة البيانات في الوقت الفعلي
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // إزالة رسائل الخطأ عند الكتابة
            clearFieldError(this);
        });
    });

    // وظيفة التحقق من صحة الحقل
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // التحقق من الحقول المطلوبة
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'هذا الحقل مطلوب';
        }

        // التحقق من البريد الإلكتروني
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
            }
        }

        // التحقق من رقم الهاتف
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'يرجى إدخال رقم هاتف صحيح';
            }
        }

        // إظهار أو إخفاء رسالة الخطأ
        if (!isValid) {
            showFieldError(field, errorMessage);
        } else {
            clearFieldError(field);
        }

        return isValid;
    }

    // وظيفة إظهار خطأ الحقل
    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.style.borderColor = '#ef4444';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    // وظيفة إزالة خطأ الحقل
    function clearFieldError(field) {
        field.style.borderColor = '';
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // وظيفة التحقق من صحة النموذج بالكامل
    function validateForm() {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    // تحديث حالة زر الإرسال
    function updateSubmitButton() {
        const isFormValid = validateForm();
        submitBtn.disabled = !isFormValid;
    }

    // مراقبة تغييرات النموذج
    inputs.forEach(input => {
        input.addEventListener('input', updateSubmitButton);
        input.addEventListener('change', updateSubmitButton);
    });

    // وظائف الأسئلة الشائعة
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // إغلاق جميع الأسئلة الأخرى
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').classList.remove('active');
                }
            });
            
            // تبديل حالة السؤال الحالي
            if (isActive) {
                item.classList.remove('active');
                answer.classList.remove('active');
            } else {
                item.classList.add('active');
                answer.classList.add('active');
            }
        });
    });

    // وظيفة نسخ معلومات التواصل
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const details = this.querySelector('.contact-details p');
            if (details) {
                const text = details.textContent;
                
                // نسخ النص إلى الحافظة
                navigator.clipboard.writeText(text).then(() => {
                    // إظهار تأثير بصري
                    this.style.backgroundColor = 'var(--accent-color)';
                    this.style.color = 'var(--white)';
                    
                    setTimeout(() => {
                        this.style.backgroundColor = '';
                        this.style.color = '';
                    }, 1000);
                    
                    // إظهار إشعار
                    showNotification(`تم نسخ: ${text}`, 'success');
                }).catch(() => {
                    showNotification('فشل في نسخ النص', 'error');
                });
            }
        });
    });

    // وظيفة حفظ المسودة تلقائياً
    function saveDraft() {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        localStorage.setItem('contactFormDraft', JSON.stringify(data));
    }

    // وظيفة تحميل المسودة
    function loadDraft() {
        const draft = localStorage.getItem('contactFormDraft');
        if (draft) {
            const data = JSON.parse(draft);
            Object.keys(data).forEach(key => {
                const field = contactForm.querySelector(`[name="${key}"]`);
                if (field && data[key]) {
                    field.value = data[key];
                }
            });
        }
    }

    // حفظ المسودة عند الكتابة
    inputs.forEach(input => {
        input.addEventListener('input', debounce(saveDraft, 1000));
    });

    // تحميل المسودة عند تحميل الصفحة
    loadDraft();

    // مسح المسودة عند الإرسال الناجح
    contactForm.addEventListener('submit', function() {
        setTimeout(() => {
            localStorage.removeItem('contactFormDraft');
        }, 3000);
    });

    // وظيفة تأخير التنفيذ
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // إضافة تأثيرات تفاعلية للروابط الاجتماعية
    const socialLinks = document.querySelectorAll('.social-link-contact');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // إضافة تأثير الكتابة للعنوان
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

    // تفعيل تأثير الكتابة للعنوان الرئيسي
    const headerTitle = document.querySelector('.contact-header h1');
    if (headerTitle) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const originalText = entry.target.textContent;
                    typeWriter(entry.target, originalText, 150);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(headerTitle);
    }

    // إضافة تأثيرات الظهور للعناصر
    const animatedElements = document.querySelectorAll('.contact-info, .contact-form-container, .faq-section');
    const appearObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        appearObserver.observe(el);
    });

    console.log('تم تحميل وظائف صفحة اتصل بنا بنجاح! 📞');
});

