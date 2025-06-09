document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('password-form');
  const currentPw = document.getElementById('current-password');
  const newPw = document.getElementById('new-password');
  const confirmPw = document.getElementById('confirm-password');

  const currentError = document.getElementById('current-error');
  const newError = document.getElementById('new-error');
  const confirmError = document.getElementById('confirm-error');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const current = currentPw.value.trim();
    const newpass = newPw.value.trim();
    const confirm = confirmPw.value.trim();

    // 에러 메시지 초기화
    [currentError, newError, confirmError].forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });

    let isValid = true;

    // 유효성 검사
    if (current.length === 0) {
      currentError.textContent = "현재 비밀번호를 입력해주세요.";
      currentError.style.display = 'block';
      isValid = false;
    }

    if (newpass.length < 8 || newpass.length > 16 || 
        !/[A-Za-z]/.test(newpass) || 
        !/[0-9]/.test(newpass) || 
        !/[!@#$%^&*]/.test(newpass)) {
      newError.textContent = "※ 영문, 숫자, 특수문자를 함께 사용해 8자 이상 16자 이하의 비밀번호만 가능합니다.";
      newError.style.display = 'block';
      isValid = false;
    }

    if (newpass !== confirm) {
      confirmError.textContent = "※ 비밀번호가 일치하지 않습니다.";
      confirmError.style.display = 'block';
      isValid = false;
    }

    if (!isValid) return;

    // 임시 처리 로직
    if (current === '1234') {
      document.getElementById('success-modal').style.display = 'flex';
    } else {
      // 현재 페이지에서 실패 메시지만 표시하고 화면 전환 없이 유지
      currentError.textContent = "※ 현재 비밀번호가 올바르지 않습니다.";
      currentError.style.display = 'block';
    }
  });
});

// 성공 모달에서 확인 버튼 클릭 시 로그인 페이지로 이동
function goToLogin() {
  window.location.href = '/accounts/login/';
}

