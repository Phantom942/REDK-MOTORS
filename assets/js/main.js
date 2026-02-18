// RED-K MOTORS - Main JavaScript

// Scroll Progress Bar
document.addEventListener('DOMContentLoaded', function() {
  const scrollProgress = document.querySelector('.scroll-progress__indicator');
  if (scrollProgress) {
    window.addEventListener('scroll', function() {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      scrollProgress.style.width = scrolled + '%';
    });
  }

  // Back to Top Button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

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

  // Lazy Loading Images
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      if (img.dataset.src) {
        imageObserver.observe(img);
      } else {
        img.classList.add('loaded');
      }
    });
  }

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

  // Smooth scroll avec offset pour header sticky
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Amélioration de l'accessibilité du menu mobile (fermer avec ESC)
  if (navMenu) {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // Lazy loading amélioré pour les images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Form Handling with Validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      // Validate email format
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
          showFieldError(emailInput, 'Veuillez entrer une adresse email valide');
          isValid = false;
        }
      }

      // Validate phone format
      const phoneInput = form.querySelector('input[type="tel"]');
      if (phoneInput && phoneInput.value) {
        const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(phoneInput.value.replace(/\s/g, ''))) {
          showFieldError(phoneInput, 'Veuillez entrer un numéro de téléphone valide');
          isValid = false;
        }
      }

      if (isValid) {
        form.reset();
        form.querySelectorAll('.form__error').forEach(error => error.remove());
        // Redirection vers la page de remerciement
        const thankYouPath = window.location.pathname.includes('/blog/') ? '../merci.html' : 'merci.html';
        window.location.href = thankYouPath;
      }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateField(input);
      });
      
      input.addEventListener('input', function() {
        clearFieldError(input);
      });
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


