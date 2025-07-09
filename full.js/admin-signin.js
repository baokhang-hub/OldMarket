document.getElementById('signin-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const messageDiv = document.getElementById('message');

  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  fetch('./php/admin-login.php', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        localStorage.setItem('isAdminLoggedIn', 'true');
        showMessage('✅ Đăng nhập thành công!', 'success');
        setTimeout(() => window.location.href = 'admin.html', 1000);
      } else {
        showMessage(result.message || '❌ Sai thông tin đăng nhập.', 'error');
      }
    })
    .catch(err => {
      console.error('Login error:', err);
      showMessage('🚫 Lỗi máy chủ.', 'error');
    });

  function showMessage(message, type = 'error') {
    if (!messageDiv) return;
    messageDiv.className = '';
    messageDiv.classList.add(type);
    messageDiv.innerText = message;
    messageDiv.style.display = 'block';
    messageDiv.style.animation = 'slideDownFade 0.4s ease forwards';

    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 3000);
  }
});
