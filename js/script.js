/* =============================================================
   BAS Baby Architects Studio
   JavaScript: navbar, carousel, scroll reveal, counters,
   contact form, mobile menu, WhatsApp
   File: script.js
   ============================================================= */

(function () {
  'use strict';

  /* ---------- CONFIG ---------- */
  // Replace with the actual WhatsApp number in international format (no + or 00)
  const WHATSAPP_NUMBER = '919999999999';
  const WHATSAPP_MESSAGE = 'Hi BAS Baby Architects Studio, I would like to discuss an architecture project.';

  /* ---------- 1. NAVBAR SCROLL EFFECT ---------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ---------- 2. MOBILE MENU ---------- */
  const toggler = document.getElementById('navToggler');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');

  const openMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    menuOverlay && menuOverlay.classList.add('open');
    toggler && toggler.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    menuOverlay && menuOverlay.classList.remove('open');
    toggler && toggler.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggler && toggler.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  menuOverlay && menuOverlay.addEventListener('click', closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------- 3. SET ACTIVE NAV LINK ---------- */
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('[data-nav]').forEach(link => {
    const target = (link.getAttribute('data-nav') || '').toLowerCase();
    if (target === currentPage || (currentPage === '' && target === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- 4. HERO CAROUSEL ---------- */
  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    let current = 0;
    let autoTimer = null;
    const SLIDE_DURATION = 6000;

    const goTo = (index) => {
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      current = index;
      restartAuto();
    };

    const next = () => goTo((current + 1) % slides.length);
    const prev = () => goTo((current - 1 + slides.length) % slides.length);

    const startAuto = () => {
      autoTimer = setInterval(next, SLIDE_DURATION);
    };
    const restartAuto = () => {
      if (autoTimer) clearInterval(autoTimer);
      startAuto();
    };

    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
    nextBtn && nextBtn.addEventListener('click', next);
    prevBtn && prevBtn.addEventListener('click', prev);

    // Pause on hover
    carousel.addEventListener('mouseenter', () => autoTimer && clearInterval(autoTimer));
    carousel.addEventListener('mouseleave', startAuto);

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });

    startAuto();
  }

  /* ---------- 5. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- 6. ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2200;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + suffix;
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---------- 7. CONTACT FORM ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successBox = document.getElementById('formSuccess');
      if (successBox) {
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      contactForm.reset();
      setTimeout(() => {
        successBox && successBox.classList.remove('show');
      }, 7000);
    });
  }

  /* ---------- 8. WHATSAPP LINKS ---------- */
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  document.querySelectorAll('[data-whatsapp]').forEach(el => {
    el.setAttribute('href', waUrl);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  /* ---------- 9. SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id.length > 1 && id !== '#') {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- 10. PAGE TRANSITION (fade-in on load) ---------- */
  document.body.style.opacity = '0';
  window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = '1';
  });

  /* ---------- 11. FLOATING BACKGROUND SHAPES ---------- */
  const shapeContainer = document.querySelector('[data-shapes]');
  if (shapeContainer) {
    const shapes = shapeContainer.querySelectorAll('.floating-shape');
    shapes.forEach((shape, i) => {
      shape.style.animation = `floatY ${6 + i * 1.5}s ease-in-out infinite`;
      shape.style.animationDelay = `${i * 0.7}s`;
    });
  }

})();
