/**
 * RED-K MOTORS - Effets Futuristes
 * Design unique que aucun garage en France n'a
 */

(function() {
  'use strict';

  // ============================================
  // 1. CURSEUR PERSONNALISÉ AVEC TRAIL
  // ============================================
  class CustomCursor {
    constructor() {
      this.cursor = document.createElement('div');
      this.cursor.className = 'custom-cursor';
      this.cursorTrail = [];
      this.trailLength = 5; // Réduit de 10 à 5 pour moins d'intrusion
      this.init();
    }

    init() {
      if (window.matchMedia('(pointer: fine)').matches) {
        document.body.appendChild(this.cursor);
        this.createTrail();
        this.bindEvents();
      }
    }

    createTrail() {
      for (let i = 0; i < this.trailLength; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.opacity = (i + 1) / this.trailLength * 0.15; // Plus discret
        trail.style.transform = `scale(${0.5 + (i / this.trailLength) * 0.5})`;
        document.body.appendChild(trail);
        this.cursorTrail.push(trail);
      }
    }

    bindEvents() {
      let mouseX = 0, mouseY = 0;
      let cursorX = 0, cursorY = 0;
      const speed = 0.1;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      // Animer le curseur principal
      function animate() {
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        this.cursor.style.left = cursorX + 'px';
        this.cursor.style.top = cursorY + 'px';

        // Animer la traînée
        this.cursorTrail.forEach((trail, index) => {
          const prevIndex = index === 0 ? null : index - 1;
          const prevX = prevIndex === null ? cursorX : parseFloat(this.cursorTrail[prevIndex].style.left);
          const prevY = prevIndex === null ? cursorY : parseFloat(this.cursorTrail[prevIndex].style.top);
          
          const trailX = prevIndex === null ? cursorX : prevX + (cursorX - prevX) * 0.3;
          const trailY = prevIndex === null ? cursorY : prevY + (cursorY - prevY) * 0.3;
          
          trail.style.left = trailX + 'px';
          trail.style.top = trailY + 'px';
        });

        requestAnimationFrame(animate.bind(this));
      }
      animate.call(this);

      // Effets au survol
      const hoverElements = document.querySelectorAll('a, button, .card, .services-links__card, .btn');
      hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          this.cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
          this.cursor.classList.remove('cursor-hover');
        });
      });
    }
  }

  // ============================================
  // 2. PARTICULES ANIMÉES EN ARRIÈRE-PLAN
  // ============================================
  class ParticleSystem {
    constructor() {
      this.particles = [];
      this.particleCount = 50;
      this.canvas = null;
      this.ctx = null;
      this.init();
    }

    init() {
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'particle-canvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '1';
      this.canvas.style.opacity = '0.6';
      document.body.appendChild(this.canvas);

      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.createParticles();
      this.animate();

      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    createParticles() {
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.particles.forEach((particle, i) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

        // Dessiner la particule
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(179, 18, 23, ${particle.opacity})`;
        this.ctx.fill();

        // Connecter les particules proches
        this.particles.slice(i + 1).forEach(p2 => {
          const dx = particle.x - p2.x;
          const dy = particle.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(179, 18, 23, ${0.2 * (1 - distance / 150)})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.stroke();
          }
        });
      });

      requestAnimationFrame(() => this.animate());
    }
  }

  // ============================================
  // 3. EFFET 3D SUR LES CARTES - DÉSACTIVÉ
  // ============================================
  function init3DCards() {
    // Effet 3D désactivé à la demande
    // const cards = document.querySelectorAll('.card, .services-links__card');
    // 
    // cards.forEach(card => {
    //   card.addEventListener('mousemove', (e) => {
    //     const rect = card.getBoundingClientRect();
    //     const x = e.clientX - rect.left;
    //     const y = e.clientY - rect.top;
    //
    //     const centerX = rect.width / 2;
    //     const centerY = rect.height / 2;
    //
    //     const rotateX = (y - centerY) / 10;
    //     const rotateY = (centerX - x) / 10;
    //
    //     card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    //   });
    //
    //   card.addEventListener('mouseleave', () => {
    //     card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    //   });
    // });
  }

  // ============================================
  // 4. EFFET PARALLAXE AVANCÉ
  // ============================================
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = el.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    });
  }

  // ============================================
  // 5. TEXTE ANIMÉ EN TRAVERSÉE
  // ============================================
  function initTextAnimations() {
    const animatedTexts = document.querySelectorAll('h2');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedTexts.forEach(text => {
      if (text.closest('.hero')) return;
      text.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      text.style.opacity = '0';
      text.style.transform = 'translateY(20px)';
      observer.observe(text);
    });
  }

  // ============================================
  // 6. EFFET LIQUIDE SUR BOUTONS
  // ============================================
  function initLiquidButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // ============================================
  // INITIALISATION
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Désactiver sur mobile pour les performances
    if (window.innerWidth > 768) {
      // new CustomCursor(); // Désactivé temporairement
      // new ParticleSystem(); // DÉSACTIVÉ - Créait des points rouges indésirables
    }
    
    init3DCards();
    initParallax();
    initTextAnimations();
    initLiquidButtons();
  }

})();
