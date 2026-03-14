/* ========================================
   Portfolio Website - JavaScript
   Scroll animations, 3D effects, interactivity
   ======================================== */

// ========================================
// Particle Network Background
// ========================================
(function initParticleNetwork() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles, mouse;
  const PARTICLE_COUNT = 80;
  const CONNECTION_DISTANCE = 150;
  const MOUSE_RADIUS = 200;

  mouse = { x: null, y: null };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 0.5;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.alpha = this.baseAlpha;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction - particles drift gently toward cursor
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.01;
          this.vx += dx * force;
          this.vy += dy * force;
        }
      }

      // Dampen velocity
      this.vx *= 0.99;
      this.vy *= 0.99;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 136, ${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Mouse connections
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          const alpha = (1 - dist / MOUSE_RADIUS) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  init();
  animate();
})();


document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // Navbar scroll behavior
  // ========================================
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const sections = document.querySelectorAll('.section, .hero');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active nav link on scroll
  function updateActiveNav() {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ========================================
  // Scroll reveal animations
  // ========================================
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = getComputedStyle(entry.target).getPropertyValue('--delay');
        const delayMs = delay ? parseInt(delay) * 100 : 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delayMs);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========================================
  // Skill progress bars animation
  // ========================================
  const skillBars = document.querySelectorAll('.skill-progress');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width = target.getAttribute('data-width');
        target.style.setProperty('--target-width', width);
        target.classList.add('animate');
        skillObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ========================================
  // 3D Hero Card - Mouse tracking
  // ========================================
  const heroCard = document.getElementById('heroCard');

  if (heroCard) {
    const heroSection = document.querySelector('.hero');

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (mouseY / (rect.height / 2)) * -12;
      const rotateY = (mouseX / (rect.width / 2)) * 12;

      heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Update shine effect position
      const inner = heroCard.querySelector('.hero-card-inner');
      const relX = ((e.clientX - rect.left) / rect.width) * 100;
      const relY = ((e.clientY - rect.top) / rect.height) * 100;
      inner.style.setProperty('--mouse-x', `${relX}%`);
      inner.style.setProperty('--mouse-y', `${relY}%`);
    });

    heroSection.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
      heroCard.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => {
        heroCard.style.transition = 'transform 0.1s ease-out';
      }, 600);
    });
  }

  // ========================================
  // Project cards - 3D tilt on hover
  // ========================================
  const projectCards = document.querySelectorAll('.project-card-inner');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // ========================================
  // Skill cards - 3D tilt on hover
  // ========================================
  const skillCards = document.querySelectorAll('.skill-card-inner');

  skillCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ========================================
  // Contact form handling
  // ========================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalContent = btn.innerHTML;

      btn.innerHTML = '<span>Sending...</span>';
      btn.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        btn.innerHTML = '<span>Message Sent!</span>';
        btn.style.background = 'var(--green-600)';

        setTimeout(() => {
          btn.innerHTML = originalContent;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 2000);
      }, 1500);
    });
  }

  // ========================================
  // Smooth scroll for all anchor links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ========================================
  // Parallax background shapes
  // ========================================
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 0.03;
      shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

});
