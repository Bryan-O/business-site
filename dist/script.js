(function () {
  var browser = document.getElementById('browser');
  var form = document.getElementById('contact-form');
  document.getElementById('year').textContent = new Date().getFullYear();
  if (browser) initDemo();
  if (form) initForm();

  function initDemo() {
  var buttons = document.querySelectorAll('.seg');
  var touched = false;

  function setView(view) {
    browser.setAttribute('data-view', view);
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.view === view));
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      touched = true;
      setView(b.dataset.view);
    });
  });

  // One intro moment: show the cluttered "before", then settle on "after".
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    setTimeout(function () { if (!touched) setView('after'); }, 1600);
  } else {
    setView('after');
  }

  }

  function initForm() {
  // Contact form: opens the visitor's email app with the details filled in.
  // Replace with a real form service or backend before launch.
  var note = document.getElementById('form-note');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = form.elements;
    var missing = false;
    ['name', 'email', 'message'].forEach(function (n) {
      var f = fields[n];
      var bad = !f.value.trim() || (n === 'email' && !f.checkValidity());
      f.setAttribute('aria-invalid', String(bad));
      if (bad) missing = true;
    });
    note.className = 'form-note';
    if (missing) {
      note.className = 'form-note error';
      note.textContent = 'Please enter your name, a valid email and a short message.';
      return;
    }
    var body = 'Name: ' + fields.name.value + '\nEmail: ' + fields.email.value +
      '\nWebsite: ' + (fields.site.value || 'n/a') + '\n\n' + fields.message.value;
    window.location.href = 'mailto:hello@example.com?subject=' +
      encodeURIComponent('Free website review request') + '&body=' + encodeURIComponent(body);
    note.textContent = 'Opening your email app. If nothing opens, write to hello@example.com.';
  });

  }
})();

// Motion: scroll reveals, header shadow, progress bar and a light hero parallax.
// Everything is visible without this script, and it does nothing when the
// visitor has asked for reduced motion.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var bar = null;

  if (header) {
    bar = document.createElement('div');
    bar.className = 'progress';
    bar.setAttribute('aria-hidden', 'true');
    header.appendChild(bar);
  }

  var demo = document.querySelector('.demo');
  var parallax = !reduce && demo && window.matchMedia('(min-width: 64rem)').matches;
  var ticking = false;

  function update() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (bar && !reduce) bar.style.setProperty('--p', max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);
    if (parallax) demo.style.transform = 'translateY(' + (-Math.min(y, 600) * 0.06).toFixed(1) + 'px)';
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();

  if (reduce || !('IntersectionObserver' in window)) return;

  var selector = [
    '.section h2', '.section-lead', '.notice', '.rows > li', '.chips li', '.steps li',
    '.values li', '.packages li', '.project', '.promise li', '.faq details',
    '.form', '.cta-band', '.care', '.prose p', '.next li', '.next-h'
  ].join(',');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  document.querySelectorAll(selector).forEach(function (el) {
    // Anything already on screen stays put, so nothing flashes at load.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    var siblings = el.parentElement ? Array.prototype.slice.call(el.parentElement.children) : [el];
    el.style.setProperty('--i', Math.min(siblings.indexOf(el), 5));
    el.classList.add('reveal');
    io.observe(el);
  });
})();
