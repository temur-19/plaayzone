function toggleLoginPassword() {
    const passwordField = document.getElementById('login_pw_input');
    const iconSpan = document.getElementById('login_pw_icon');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        iconSpan.innerText = '🙈';
    } else {
        passwordField.type = 'password';
        iconSpan.innerText = '👁️';
    }
}