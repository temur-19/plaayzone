// Kirish va Ro'yxatdan o'tish tablarini almashtirish
function switchTab(t){
  document.getElementById('tab-login').classList.toggle('active', t === 'login');
  document.getElementById('tab-signup').classList.toggle('active', t === 'signup');
  document.getElementById('form-login').style.display = t === 'login' ? 'block' : 'none';
  document.getElementById('form-signup').style.display = t === 'signup' ? 'block' : 'none';
}

// Parolni ko'rsatish va yashirish (Ko'zcha belgisi)
function togglePw(id, icon){
  var inp = document.getElementById(id);
  if(inp.type === 'password'){
    inp.type = 'text';
    icon.className = 'bi bi-eye-slash';
  } else {
    inp.type = 'password';
    icon.className = 'bi bi-eye';
  }
}

// Avtorizatsiya blokiga silliq (smooth) harakatlanish
function scrollAuth(){
  document.getElementById('auth-section').scrollIntoView({behavior: 'smooth'});
}

// Statiskadagi raqamlarni noldan ko'tarilish animatsiyasi
var targets = [
  {id: 's1', val: 240, suffix: '+'},
  {id: 's2', val: 4, suffix: ''},
  {id: 's3', val: 1200, suffix: '+'},
  {id: 's4', val: 3500, suffix: '+'}
];

function animCount(el, target, suffix, dur){
  var start = 0, step = dur / 60;
  var timer = setInterval(function(){
    start += target / 60;
    if(start >= target){
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.round(start) + suffix;
  }, step);
}

var counted = false;
window.addEventListener('scroll', function(){
  if(!counted && window.scrollY > 200){
    counted = true;
    targets.forEach(function(t){
      animCount(document.getElementById(t.id), t.val, t.suffix, 1200);
    });
  }
});

// Skrol qilinganda bloklar silliq chiqish animatsiyasi (IntersectionObserver)
var observer = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      e.target.classList.add('visible');
    }
  });
}, {threshold: 0.1});

document.querySelectorAll('.fade-card').forEach(function(c){
  observer.observe(c);
});