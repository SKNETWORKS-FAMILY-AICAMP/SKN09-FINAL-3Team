
$(document).ready(function () {

    fetch('/accounts/get-prev-login-user/')
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                var { user_id, is_auto_login } = data.data;
                console.log(`이 PC에서 마지막으로 로그인한 사용자: ${user_id}, 자동 로그인: ${is_auto_login}`);
                if (is_auto_login == 1) {
                    $('#input-login-check').prop('checked', true);
                } else if (is_auto_login == 0) {
                    $('#input-login-check').prop('checked', false);
                }
            } else {
                console.warn(data.error);
            }
        })
        .catch(() => {
            console.error('서버 요청 실패');
        });

    $('#warn-id').hide();
    $('#warn-pw').hide();

  // CSRF 토큰 함수 (위와 동일)
  function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }
  const csrftoken = getCookie('csrftoken');

    $('#login-btn').click(function () {
        var id = $('#input-id').val();
        var pw = $('#input-pw').val();


        if (!id || !pw) {
            alert('아이디와 비밀번호를 입력해주세요.');
            false;
        }
    
        fetch('/accounts/ajax-login/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'user_id': id,
                    'password': pw,
                    'auto_login': $('#input-login-check').is(':checked') ? 1 : 0
                })
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                window.location.href = data.redirect_url;
                fetch('/accounts/ajax-insert-login-log', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrftoken,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'user_id': id
                    })
                })
                .then(response => response.json()) 
                .then(data => {
                    if(data.error){
                        console.log(data.error);
                    }
                })
            } else {
                if (data.error == "아이디가 잘못되었습니다.") {
                    $('#warn-id').show();
                    $('#warn-pw').hide();
                } else if (data.error == "비밀번호가 잘못되었습니다.") {
                    $('#warn-id').hide();
                    $('#warn-pw').show()
                }
            }
        })
        .catch(() => {
            console.error('서버 에러가 발생했습니다.');
        });
    });
});

