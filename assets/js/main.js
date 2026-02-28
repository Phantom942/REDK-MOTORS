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
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollProgress && h > 0) scrollProgress.style.width = (window.scrollY / h) * 100 + '%';
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 300);
  }, 16);

  window.addEventListener('scroll', onScroll, { passive: true });
  if (backToTop) backToTop.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // Mobile Menu Toggle
  const navToggle = document.querySelector('.main-nav__toggle');
  const navMenu = document.querySelector('#primary-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-open');
      
      // Close menu when clicking outside
      if (!isExpanded) {
        document.addEventListener('click', function closeMenu(e) {
          if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.removeEventListener('click', closeMenu);
          }
        });
      }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

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

  // Accordion FAQ
  const faqQuestions = document.querySelectorAll('.faq__question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Close all other FAQs
      faqQuestions.forEach(q => {
        if (q !== this) {
          q.setAttribute('aria-expanded', 'false');
          q.nextElementSibling.hidden = true;
        }
      });
      
      // Toggle current FAQ
      this.setAttribute('aria-expanded', !isExpanded);
      answer.hidden = isExpanded;
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
});


