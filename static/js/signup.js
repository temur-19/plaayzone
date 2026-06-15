function toggleSignupPw(id, btn) {
    const field = document.getElementById(id);
    const span = btn.querySelector('span');
    if (field.type === 'password') {
        field.type = 'text';
        span.innerText = '🙈';
    } else {
        field.type = 'password';
        span.innerText = '👁️';
    }
}

function updateStrength(pw) {
    const bar = document.getElementById('strength_bar');
    const txt = document.getElementById('strength_text');
    let strength = 0;

    if (pw.length >= 8) strength += 25;
    if (/[A-Z]/.test(pw)) strength += 25;
    if (/[0-9]/.test(pw)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pw)) strength += 25;

    bar.style.width = strength + '%';

    if (strength <= 25) { bar.style.backgroundColor = '#f44336'; txt.innerText = 'Zaif'; }
    else if (strength <= 50) { bar.style.backgroundColor = '#ff9800'; txt.innerText = 'O\'rtacha'; }
    else if (strength <= 75) { bar.style.backgroundColor = '#ffeb3b'; txt.innerText = 'Yaxshi'; }
    else { bar.style.backgroundColor = '#4caf50'; txt.innerText = 'Kuchli'; }
}