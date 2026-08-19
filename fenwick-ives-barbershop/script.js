// Fenwick & Ives — site behavior: sticky header shrink, scroll reveals,
// count-up stats, testimonial carousel, FAQ accordion, booking form.
(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- mobile nav toggle ---
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav){
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // --- header shrinks after a short scroll ---
  var header = document.querySelector('.site-header');
  if (header){
    var onScroll = function(){
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- scroll reveal, staggered within each group ---
  var groups = document.querySelectorAll('[data-reveal-group]');
  groups.forEach(function(group){
    var items = group.querySelectorAll('.reveal');
    items.forEach(function(el, i){ el.style.setProperty('--i', i); });
  });

  if (reduced || !('IntersectionObserver' in window)){
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  }

  // --- count-up stats ---
  var stats = document.querySelectorAll('[data-count-to]');
  if (stats.length){
    var animateCount = function(el){
      var to = parseInt(el.getAttribute('data-count-to'), 10);
      var from = parseInt(el.getAttribute('data-count-from') || '0', 10);
      if (reduced){ el.textContent = to; return; }
      var duration = 1100;
      var start = null;
      function step(ts){
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(from + (to - from) * eased);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = to;
      }
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window){
      var cio = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){ animateCount(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      stats.forEach(function(el){ cio.observe(el); });
    } else {
      stats.forEach(animateCount);
    }
  }

  // --- testimonial carousel ---
  var carousel = document.querySelector('.quote-carousel');
  if (carousel){
    var slides = carousel.querySelectorAll('.quote-slide');
    var dots = carousel.querySelectorAll('.quote-dots button');
    var idx = 0, timer = null;
    function show(n){
      idx = (n + slides.length) % slides.length;
      slides.forEach(function(s, i){ s.classList.toggle('active', i === idx); });
      dots.forEach(function(d, i){ d.classList.toggle('active', i === idx); });
    }
    function next(){ show(idx + 1); }
    function start(){ if (!reduced) timer = setInterval(next, 5500); }
    function stop(){ if (timer) clearInterval(timer); }
    dots.forEach(function(d, i){
      d.addEventListener('click', function(){ show(i); stop(); start(); });
    });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-item').forEach(function(item){
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;
    btn.addEventListener('click', function(){
      var isOpen = item.getAttribute('data-open') === 'true';
      document.querySelectorAll('.faq-item').forEach(function(other){
        other.setAttribute('data-open', 'false');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen){
        item.setAttribute('data-open', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- booking form ---
  var form = document.getElementById('booking-form');
  var confirmBox = document.getElementById('booking-confirm');
  if (form && confirmBox){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = form.querySelector('#bf-name').value.trim() || 'there';
      var day = form.querySelector('#bf-day').value;
      confirmBox.querySelector('.confirm-name').textContent = name;
      confirmBox.querySelector('.confirm-day').textContent = day || 'your preferred day';
      confirmBox.classList.add('show');
      form.reset();
      confirmBox.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });
  }
})();
