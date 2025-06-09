// mypage.js

document.addEventListener('DOMContentLoaded', function () {
  // 유효성 검사
  const form = document.querySelector('form');
  const nicknameInput = document.getElementById('nickname');
  const departmentInput = document.getElementById('department');

  form.addEventListener('submit', function (e) {
    let isValid = true;
    let errors = [];

    const nickname = nicknameInput.value.trim();
    const department = departmentInput.value.trim();

    if (nickname.length < 2) {
      isValid = false;
      errors.push("닉네임은 2자 이상이어야 합니다.");
    }
    if (!/^[a-zA-Z가-힣0-9]+$/.test(nickname)) {
      isValid = false;
      errors.push("닉네임에 특수문자는 사용할 수 없습니다.");
    }
    if (department.length < 2 || /\s/.test(department)) {
      isValid = false;
      errors.push("부서는 공백 없이 2자 이상 입력해야 합니다.");
    }

    if (!isValid) {
      e.preventDefault();
      alert(errors.join("\n"));
    }
  });

  // 닉네임 모달
  const modal = document.getElementById('nicknameModal');
  const openBtn = document.querySelector('.btn-change');
  const cancelBtn = document.getElementById('cancelModal');
  const confirmBtn = document.getElementById('confirmChange');
  const resultMsg = document.getElementById('nicknameCheckResult');

  openBtn.addEventListener('click', function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    resultMsg.classList.add('hidden');
    document.getElementById('new_nickname').value = '';
  });

  cancelBtn.addEventListener('click', function () {
    modal.classList.add('hidden');
  });

  confirmBtn.addEventListener('click', function () {
    const newNickname = document.getElementById('new_nickname').value.trim();
    if (newNickname.length < 2) {
      resultMsg.textContent = "닉네임은 2자 이상이어야 합니다.";
      resultMsg.classList.remove('hidden');
      return;
    }
    alert(`닉네임이 '${newNickname}'(으)로 변경됩니다.`); // 서버 연동 필요
    modal.classList.add('hidden');
  });

  document.getElementById('checkDuplicate').addEventListener('click', function () {
    const value = document.getElementById('new_nickname').value.trim();
    if (value === '') {
      resultMsg.textContent = "닉네임을 입력하세요.";
      resultMsg.classList.remove('hidden');
      return;
    }
    const dummyTaken = ['admin', 'passai', 'dbwlsdl01'];
    if (dummyTaken.includes(value.toLowerCase())) {
      resultMsg.textContent = "닉네임이 이미 존재 합니다.";
    } else {
      resultMsg.textContent = "사용 가능한 닉네임 입니다.";
    }
    resultMsg.classList.remove('hidden');
  });

  // 비밀번호 재설정 영역 전환
  const btnPassword = document.querySelector('.btn-password');
  const infoPanel = document.getElementById('infoPanel');
  const passwordPanel = document.getElementById('passwordPanel');
  const passwordForm = document.getElementById('passwordForm');

  btnPassword.addEventListener('click', function (e) {
    e.preventDefault();
    infoPanel.classList.add('hidden');
    passwordPanel.classList.remove('hidden');
  });

  passwordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const current = document.getElementById('current_password').value.trim();
    const newPw = document.getElementById('new_password').value.trim();
    const confirm = document.getElementById('confirm_password').value.trim();

    if (!current || !newPw || !confirm) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (newPw.length < 8 || !/[A-Za-z]/.test(newPw) || !/[0-9]/.test(newPw) || !/[!@#$%^&*]/.test(newPw)) {
      alert("새 비밀번호는 8자 이상이며, 영문/숫자/특수문자를 포함해야 합니다.");
      return;
    }

    if (newPw !== confirm) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    alert("비밀번호가 성공적으로 변경되었습니다. (서버 요청 필요)");
    passwordForm.reset();
    infoPanel.classList.remove('hidden');
    passwordPanel.classList.add('hidden');
  });
});
