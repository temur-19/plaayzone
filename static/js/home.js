// ── FADE IN ──────────────────────────────────────────────────────
var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-card').forEach(function (c) {
  observer.observe(c);
});

// ── AUTH TABS ────────────────────────────────────────────────────
function switchTab(t) {
  document.getElementById('tab-login').classList.toggle('active', t === 'login');
  document.getElementById('tab-signup').classList.toggle('active', t === 'signup');
  document.getElementById('form-login').style.display  = t === 'login'  ? 'block' : 'none';
  document.getElementById('form-signup').style.display = t === 'signup' ? 'block' : 'none';
}