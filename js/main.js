// ===== 导航栏滚动效果 =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');


// 滚动时导航栏样式变化
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 移动端菜单切换
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// 点击导航链接后关闭菜单
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== 滚动入场动画 =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.about-card, .timeline-item, .gallery-item, .campus-card, .social-card, .skill-category, .project-category'
    );

    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // 初始化灯箱
    initLightbox();
});

// ===== 平滑滚动 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== 图片灯箱 =====
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    // 收集所有 .img-wrapper 中的图片
    const wrappers = document.querySelectorAll('.img-wrapper');
    let images = [];
    let currentIndex = 0;

    // 重新收集图片列表（每次打开时刷新，确保数据最新）
    function refreshImageList() {
        const allWrappers = document.querySelectorAll('.img-wrapper');
        images = [];
        allWrappers.forEach(w => {
            const img = w.querySelector('img');
            if (img) {
                images.push({
                    src: img.getAttribute('src'),
                    alt: img.getAttribute('alt') || ''
                });
            }
        });
    }

    function openLightbox(index) {
        refreshImageList();
        if (images.length === 0) return;
        currentIndex = index;
        showImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showImage() {
        const img = images[currentIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.alt;
        lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;

        // 隐藏/显示翻页按钮
        lightboxPrev.style.display = images.length > 1 ? 'block' : 'none';
        lightboxNext.style.display = images.length > 1 ? 'block' : 'none';
    }

    function nextImage() {
        if (images.length === 0) return;
        currentIndex = (currentIndex + 1) % images.length;
        showImage();
    }

    function prevImage() {
        if (images.length === 0) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage();
    }

    // 为每个 .img-wrapper 绑定点击事件
    wrappers.forEach((wrapper, index) => {
        wrapper.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    // 关闭按钮
    lightboxClose.addEventListener('click', closeLightbox);

    // 点击背景关闭
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // 翻页按钮
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });

    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    });
}