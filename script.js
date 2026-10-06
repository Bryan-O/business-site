(function () {
  var browser = document.getElementById('browser');
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

  // Contact form: opens the visitor's email app with the details filled in.
  // Replace with a real form service or backend before launch.
  var form = document.getElementById('contact-form');
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

  document.getElementById('year').textContent = new Date().getFullYear();
})();
