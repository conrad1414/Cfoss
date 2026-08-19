// Fenwick & Ives — site behavior: nav toggle, scroll reveal, FAQ accordion, booking form.
(function(){
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav){
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length){
    if (reduced || !('IntersectionObserver' in window)){
      reveals.forEach(function(el){ el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      reveals.forEach(function(el){ io.observe(el); });
    }
  }

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
