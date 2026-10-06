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
  // Sends the message through the /api/contact function. If that is unavailable
  // (for example when the page is opened as a local file), falls back to the
  // visitor's email app.
  var note = document.getElementById('form-note');
  var EMAIL = 'fieldstone.webagency@gmail.com';
  var button = form.querySelector('button[type="submit"]');

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

    var data = JSON.stringify(Object.fromEntries(new FormData(form).entries()));
    button.disabled = true;
    note.textContent = 'Sending...';

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    }).then(function (res) {
      if (!res.ok) throw new Error('Form request failed');
      form.reset();
      note.textContent = 'Thank you. We have your message and will reply within one business day.';
    }).catch(function () {
      var body = 'Name: ' + fields.name.value + '\nEmail: ' + fields.email.value +
        '\nWebsite: ' + (fields.site.value || 'n/a') + '\n\n' + fields.message.value;
      window.location.href = 'mailto:' + EMAIL + '?subject=' +
        encodeURIComponent('Free website review request') + '&body=' + encodeURIComponent(body);
      note.textContent = 'Opening your email app. If nothing opens, write to ' + EMAIL + '.';
    }).then(function () {
      button.disabled = false;
    });
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

  var pending = [];
  var demo = document.querySelector('.demo');
  var parallax = !reduce && demo && window.matchMedia('(min-width: 64rem)').matches;
  var ticking = false;

  function update() {
    ticking = false;
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (bar && !reduce) bar.style.setProperty('--p', max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);
    // Anything at or above the bottom of the screen is shown, even if the visitor
    // jumped past it without it ever intersecting.
    for (var i = pending.length - 1; i >= 0; i--) {
      if (pending[i].getBoundingClientRect().top < window.innerHeight * 0.92) {
        pending[i].classList.add('in');
        pending.splice(i, 1);
      }
    }
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
    pending.push(el);
    io.observe(el);
  });
})();
