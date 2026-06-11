// RED-K MOTORS - Main JavaScript (allégé)

function throttle(fn, delay) {
  let last = 0;
  return function() {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, arguments);
    }
  };
}

document.addEventListener('DOMContentLoaded', function() {
  const scrollProgress = document.querySelector('.scroll-progress__indicator');
  const backToTop = document.querySelector('.back-to-top');

  const onScroll = throttle(function() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgress && h > 0) scrollProgress.style.width = (y / h) * 100 + '%';
    if (backToTop) backToTop.classList.toggle('visible', y > 300);
  }, 16);

  window.addEventListener('scroll', onScroll, { passive: true });
  if (backToTop) backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Mobile Menu Toggle
  const navToggle = document.querySelector('.main-nav__toggle');
  const navMenu = document.querySelector('#primary-menu');
  const navSubTriggers = document.querySelectorAll('.main-nav__trigger');
  const MOBILE_NAV_MQ = window.matchMedia('(max-width: 768px)');

  function isMobileNav() {
    return MOBILE_NAV_MQ.matches;
  }

  function closeNavSubmenus() {
    if (!navMenu) return;
    navMenu.querySelectorAll('.main-nav__item--has-sub.is-open').forEach(function(item) {
      item.classList.remove('is-open');
      var trigger = item.querySelector('.main-nav__trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function openActiveNavSubmenus() {
    if (!navMenu || !isMobileNav()) return;
    navMenu.querySelectorAll('.main-nav__item--has-sub.is-active').forEach(function(item) {
      item.classList.add('is-open');
      var trigger = item.querySelector('.main-nav__trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    });
  }

  function setNavMenuOpen(open) {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navMenu.classList.toggle('is-open', open);
    document.body.classList.toggle('is-nav-open', open);
    navToggle.querySelector('.sr-only').textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
    if (open) {
      openActiveNavSubmenus();
    } else {
      closeNavSubmenus();
    }
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      var isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      setNavMenuOpen(!isExpanded);

      if (!isExpanded) {
        document.addEventListener('click', function closeMenu(e) {
          if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            setNavMenuOpen(false);
            document.removeEventListener('click', closeMenu);
          }
        });
      }
    });

    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        if (!isMobileNav()) return;
        setNavMenuOpen(false);
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        setNavMenuOpen(false);
      }
    });

    MOBILE_NAV_MQ.addEventListener('change', function(e) {
      if (!e.matches) setNavMenuOpen(false);
    });
  }

  navSubTriggers.forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
      if (!isMobileNav()) return;

      e.preventDefault();
      e.stopPropagation();
      var parent = trigger.closest('.main-nav__item--has-sub');
      if (!parent) return;

      var isOpen = parent.classList.contains('is-open');
      navSubTriggers.forEach(function(other) {
        var otherParent = other.closest('.main-nav__item--has-sub');
        if (otherParent && otherParent !== parent) {
          otherParent.classList.remove('is-open');
          other.setAttribute('aria-expanded', 'false');
        }
      });

      parent.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Scroll Animations
  const animateElements = document.querySelectorAll('[data-animate]');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // Accordion FAQ (une seule ouverte, animation fluide)
  const faqQuestions = document.querySelectorAll('.faq__question');
  const FAQ_TRANSITION_MS = 360;

  function setFaqOpen(question, open) {
    const answer = question.nextElementSibling;
    if (!answer || !answer.classList.contains('faq__answer')) return;

    if (open) {
      answer.removeAttribute('hidden');
      answer.classList.add('is-open');
      question.setAttribute('aria-expanded', 'true');
    } else {
      answer.classList.remove('is-open');
      question.setAttribute('aria-expanded', 'false');
      window.setTimeout(function() {
        if (!answer.classList.contains('is-open')) {
          answer.setAttribute('hidden', '');
        }
      }, FAQ_TRANSITION_MS);
    }
  }

  faqQuestions.forEach(function(question) {
    question.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      faqQuestions.forEach(function(q) {
        if (q !== question && q.getAttribute('aria-expanded') === 'true') {
          setFaqOpen(q, false);
        }
      });

      setFaqOpen(this, !isExpanded);
    });
  });

  // Tabs
  const tabTriggers = document.querySelectorAll('.tabs__trigger');
  const tabPanels = document.querySelectorAll('.tabs__panel');
  
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const targetPanel = this.getAttribute('data-tab-target');
      
      // Remove active state from all
      tabTriggers.forEach(t => {
        t.setAttribute('aria-selected', 'false');
        t.classList.remove('is-active');
      });
      tabPanels.forEach(p => {
        p.classList.remove('is-active');
        p.hidden = true;
      });
      
      // Activate selected
      this.setAttribute('aria-selected', 'true');
      this.classList.add('is-active');
      const panel = document.getElementById(targetPanel);
      if (panel) {
        panel.classList.add('is-active');
        panel.hidden = false;
      }
    });
  });

  // Form validation (ne pas bloquer si FormSubmit.co)
  const forms = document.querySelectorAll('form[action*="formsubmit"]');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      let valid = true;
      inputs.forEach(input => { if (!validateField(input)) valid = false; });
      const email = form.querySelector('input[type="email"]');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showFieldError(email, 'Email invalide');
        valid = false;
      }
      if (!valid) e.preventDefault();
    });
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    if (isRequired && !value) {
      showFieldError(field, 'Ce champ est obligatoire');
      return false;
    }
    
    clearFieldError(field);
    return true;
  }

  function showFieldError(field, message) {
    clearFieldError(field);
    
    const error = document.createElement('span');
    error.className = 'form__error';
    error.textContent = message;
    error.style.color = '#b31217';
    error.style.fontSize = '14px';
    error.style.display = 'block';
    error.style.marginTop = '5px';
    
    field.style.borderColor = '#b31217';
    field.parentNode.appendChild(error);
  }

  function clearFieldError(field) {
    const error = field.parentNode.querySelector('.form__error');
    if (error) {
      error.remove();
    }
    field.style.borderColor = '';
  }

  // Contact form chips
  var chips = document.querySelectorAll('.form__chip');
  var msgField = document.getElementById('message');
  chips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      chips.forEach(function(c) { c.classList.remove('is-active'); });
      this.classList.add('is-active');
      if (msgField) {
        var cur = msgField.value.trim();
        var motif = this.getAttribute('data-chip');
        if (!cur) {
          msgField.value = 'Bonjour, je souhaite un rendez-vous pour : ' + motif + '. ';
        }
        msgField.focus();
      }
    });
  });
});


