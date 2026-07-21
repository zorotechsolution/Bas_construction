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
  const WHATSAPP_NUMBER = '917418564997';
  const WHATSAPP_MESSAGE = 'Hi BAS Baby Architects Studio, I would like to discuss an architecture project.';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  let lastFocusedElement = null;

  const getMenuLinks = () => mobileMenu
    ? Array.from(mobileMenu.querySelectorAll('a[href]'))
    : [];

  const openMenu = () => {
    if (!mobileMenu || !toggler) return;
    lastFocusedElement = document.activeElement;
    mobileMenu.classList.add('open');
    menuOverlay && menuOverlay.classList.add('open');
    toggler.classList.add('active');
    toggler.setAttribute('aria-expanded', 'true');
    toggler.setAttribute('aria-label', 'Close navigation menu');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('menu-open');
    document.body.classList.add('menu-open');

    const firstLink = getMenuLinks()[0];
    firstLink && firstLink.focus({ preventScroll: true });
  };

  const closeMenu = (restoreFocus = true) => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    menuOverlay && menuOverlay.classList.remove('open');
    toggler && toggler.classList.remove('active');
    toggler && toggler.setAttribute('aria-expanded', 'false');
    toggler && toggler.setAttribute('aria-label', 'Open navigation menu');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('menu-open');
    document.body.classList.remove('menu-open');

    if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus({ preventScroll: true });
    }
  };

  toggler && toggler.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  menuOverlay && menuOverlay.addEventListener('click', () => closeMenu());
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeMenu(false));
    });
  }

  document.addEventListener('keydown', (event) => {
    if (!mobileMenu || !mobileMenu.classList.contains('open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab') return;
    const links = getMenuLinks();
    if (!links.length) return;
    const firstLink = links[0];
    const lastLink = links[links.length - 1];

    if (event.shiftKey && document.activeElement === firstLink) {
      event.preventDefault();
      lastLink.focus();
    } else if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      firstLink.focus();
    }
  });

  const closeMenuForLargeViewport = () => {
    if (window.innerWidth >= 992 && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMenu(false);
    }
  };

  window.addEventListener('resize', closeMenuForLargeViewport, { passive: true });
  window.addEventListener('orientationchange', () => {
    window.setTimeout(() => {
      if (mobileMenu && mobileMenu.classList.contains('open')) closeMenu(false);
    }, 150);
  }, { passive: true });

  /* ---------- 3. SET ACTIVE NAV LINK ---------- */
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const activeNavPage = currentPage === 'blog-detail.html' ? 'blogs.html' : currentPage;
  document.querySelectorAll('[data-nav]').forEach(link => {
    const target = (link.getAttribute('data-nav') || '').toLowerCase();
    if (target === activeNavPage || (activeNavPage === '' && target === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
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
      slides.forEach((slide, i) => {
        const isActive = i === index;
        slide.classList.toggle('active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
      dots.forEach((dot, i) => {
        const isActive = i === index;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', String(isActive));
      });
      current = index;
      restartAuto();
    };

    const next = () => goTo((current + 1) % slides.length);
    const prev = () => goTo((current - 1 + slides.length) % slides.length);

    const stopAuto = () => {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = null;
    };
    const startAuto = () => {
      stopAuto();
      if (prefersReducedMotion || document.hidden) return;
      autoTimer = setInterval(next, SLIDE_DURATION);
    };
    const restartAuto = () => {
      startAuto();
    };

    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
    nextBtn && nextBtn.addEventListener('click', next);
    prevBtn && prevBtn.addEventListener('click', prev);

    slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== current)));

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('focusin', stopAuto);
    carousel.addEventListener('focusout', startAuto);
    document.addEventListener('visibilitychange', () => document.hidden ? stopAuto() : startAuto());

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
      const formData = new FormData(contactForm);
      const subject = encodeURIComponent(`Project enquiry from ${formData.get('name') || 'BAS website visitor'}`);
      const body = encodeURIComponent([
        `Name: ${formData.get('name') || ''}`,
        `Phone: ${formData.get('phone') || ''}`,
        `Email: ${formData.get('email') || ''}`,
        `Project type: ${formData.get('projectType') || ''}`,
        '',
        'Project details:',
        formData.get('message') || ''
      ].join('\n'));
      const successBox = document.getElementById('formSuccess');
      if (successBox) {
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      }
      window.location.href = `mailto:babyarchitectstudio@gmail.com?subject=${subject}&body=${body}`;
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
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
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

  /* ---------- 12. BLOG ARTICLE INTERACTIONS ---------- */
  const blogCards = document.querySelectorAll('.blog-card[data-href]');
  blogCards.forEach(card => {
    const openArticle = () => {
      window.location.href = card.getAttribute('data-href');
    };

    card.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      openArticle();
    });

  });

  /* ---------- 13. NEWSLETTER FORM ---------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', event => {
      event.preventDefault();
      const newsletterStatus = document.getElementById('newsletterStatus');
      const newsletterEmail = document.getElementById('newsletterEmail');
      const subscriberEmail = newsletterEmail ? newsletterEmail.value.trim() : '';
      if (newsletterStatus) {
        newsletterStatus.hidden = false;
        newsletterStatus.textContent = 'Your email app has been opened. Send the prepared message to complete your subscription.';
      }
      const subject = encodeURIComponent('BAS Insider List subscription');
      const body = encodeURIComponent(`Please add ${subscriberEmail} to the BAS Insider List.`);
      window.location.href = `mailto:babyarchitectstudio@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  const loadMoreButton = document.getElementById('loadMoreArticles');
  if (loadMoreButton) {
    const moreArticles = Array.from(document.querySelectorAll('[data-more-article]'));
    const loadMoreStatus = document.getElementById('loadMoreStatus');

    if (!moreArticles.length) {
      loadMoreButton.hidden = true;
    } else {
      loadMoreButton.addEventListener('click', () => {
        moreArticles.forEach((article, index) => {
          article.classList.remove('d-none');
          article.classList.add('reveal', 'visible', `delay-${(index % 3) + 1}`);
        });

        loadMoreButton.setAttribute('aria-expanded', 'true');
        loadMoreButton.hidden = true;
        if (loadMoreStatus) {
          loadMoreStatus.textContent = `${moreArticles.length} more articles loaded.`;
        }
      }, { once: true });
    }
  }

})();
