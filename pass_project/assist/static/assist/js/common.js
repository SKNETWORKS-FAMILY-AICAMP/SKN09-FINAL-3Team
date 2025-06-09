// 전역 App 객체
window.App = {
  // 공통 데이터
  data: {
    currentDraftContent: '',
    currentDraftId: null,
    isEvaluationMode: false
  },
  
  // 공통 유틸리티
  utils: {
    // 알림 표시
    showNotification(message) {
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
        document.body.removeChild(existingNotification);
      }
      
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 500);
      }, 3000);
    },
    
    // 글자 수 업데이트
    updateCharCounter(input) {
      const counter = input.nextElementSibling;
      if (counter && counter.classList.contains('char-counter')) {
        const currentCount = input.value.length;
        const maxLength = input.getAttribute('maxlength');
        
        const countDisplay = counter.querySelector('.current-count');
        if (countDisplay) {
          countDisplay.textContent = currentCount;
        }
        
        if (currentCount >= maxLength * 0.9) {
          counter.classList.add('limit-reached');
        } else {
          counter.classList.remove('limit-reached');
        }
      }
    },
    
    // 마크다운을 HTML로 변환
    convertMarkdownToHTML(markdown) {
      let html = markdown;
      
      // 헤더 변환
      html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
      html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
      html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
      html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
      
      // 굵은 글씨
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // 기울임
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // 구분선
      html = html.replace(/^---$/gm, '<hr>');
      
      // 청구항 특별 포맷팅
      html = html.replace(/\*\*청구항 (\d+)\*\*:/g, '<h4 style="color: #1a237e; margin-top: 20px;">청구항 $1:</h4>');
      
      // 일반 리스트 변환 (- 로 시작하는 것들)
      const lines = html.split('\n');
      let inList = false;
      let listItems = [];
      let result = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.match(/^- /)) {
          if (!inList) {
            inList = true;
          }
          listItems.push(line.replace(/^- /, ''));
        } else {
          if (inList) {
            result.push('<ul>');
            listItems.forEach(item => {
              result.push(`<li>${item}</li>`);
            });
            result.push('</ul>');
            listItems = [];
            inList = false;
          }
          result.push(line);
        }
      }
      
      // 마지막에 리스트가 끝나지 않은 경우
      if (inList) {
        result.push('<ul>');
        listItems.forEach(item => {
          result.push(`<li>${item}</li>`);
        });
        result.push('</ul>');
      }
      
      html = result.join('\n');
      
      // 줄바꿈을 <p> 태그로 변환
      const paragraphs = html.split('\n\n');
      html = paragraphs.map(p => {
        const trimmed = p.trim();
        if (trimmed && 
            !trimmed.includes('<h') && 
            !trimmed.includes('<ul') && 
            !trimmed.includes('<hr') && 
            !trimmed.includes('<li>') &&
            !trimmed.includes('</ul>') &&
            !trimmed.includes('</h')) {
          return `<p>${trimmed}</p>`;
        }
        return trimmed;
      }).join('\n\n');
      
      // 단일 줄바꿈을 <br>로 변환 (단, HTML 태그가 아닌 경우만)
      html = html.replace(/\n(?!<|$)/g, '<br>\n');
      
      return html;
    },
    
    // 영어 제목 생성
    generateEnglishTitle(koreanTitle) {
      if (!koreanTitle || koreanTitle.trim() === '') {
        return 'Innovative Technology System and Method';
      }
      
      const keywordMap = {
        '시스템': 'System',
        '방법': 'Method',
        '장치': 'Apparatus',
        '서비스': 'Service',
        '플랫폼': 'Platform',
        '솔루션': 'Solution',
        '기술': 'Technology',
        '인공지능': 'Artificial Intelligence',
        'AI': 'AI',
        '빅데이터': 'Big Data',
        '블록체인': 'Blockchain',
        '클라우드': 'Cloud',
        '모바일': 'Mobile',
        '스마트': 'Smart',
        '자동': 'Automatic',
        '통합': 'Integrated',
        '관리': 'Management',
        '분석': 'Analysis',
        '검색': 'Search',
        '추천': 'Recommendation',
        '보안': 'Security',
        '네트워크': 'Network'
      };
      
      let englishTitle = koreanTitle;
      for (const [korean, english] of Object.entries(keywordMap)) {
        englishTitle = englishTitle.replace(new RegExp(korean, 'g'), english);
      }
      
      if (/[가-힣]/.test(englishTitle)) {
        englishTitle = 'Innovative Technology System and Method';
      }
      
      return englishTitle;
    }
  },
  
  // 네비게이션 관련
  navigation: {
    switchToAssist() {
      window.location.href = '/assist/';
    },
    
    switchToQA() {
      window.location.href = '/assist/qa/';
    },
    
    backToNormal() {
      const fullPanel = document.getElementById('fullPanelContainer');
      const evaluationLayout = document.getElementById('evaluationLayout');
      
      if (fullPanel && evaluationLayout) {
        fullPanel.style.display = 'flex';
        evaluationLayout.style.display = 'none';
      }
      
      App.data.isEvaluationMode = false;
    }
  },
  
  // 사용자 관련
  user: {
    goToMyPage() {
      App.utils.showNotification('마이페이지로 이동합니다...');
      // 실제로는 마이페이지로 리디렉션
      // window.location.href = '/mypage';
    },
    
    logout() {
      if (confirm('로그아웃 하시겠습니까?')) {
        App.utils.showNotification('로그아웃 중입니다...');
        // 실제로는 로그아웃 처리
        // window.location.href = '/logout';
      }
    }
  }
};

// 공통 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 헤더 트리거 설정
  setupHeaderTrigger();
  
  // 글자 수 카운팅 초기화
  initCharCounters();
  
  // Enter 키 이벤트 설정
  setupKeyEvents();
});

function setupHeaderTrigger() {
  const hiddenHeader = document.getElementById('hiddenHeader');
  const mainContainer = document.querySelector('.main-container');
  
  if (!hiddenHeader || !mainContainer) return;
  
  // 마우스가 화면 상단 10px 영역에 있을 때 헤더 표시
  document.addEventListener('mousemove', function(e) {
    if (e.clientY <= 10) {
      hiddenHeader.classList.add('show');
      mainContainer.classList.add('header-visible');
    } else if (e.clientY > 80) {
      hiddenHeader.classList.remove('show');
      mainContainer.classList.remove('header-visible');
    }
  });
}

function initCharCounters() {
  const textInputs = document.querySelectorAll('.text-input, .textarea-input');
  textInputs.forEach(input => {
    input.addEventListener('input', function() {
      App.utils.updateCharCounter(this);
    });
    App.utils.updateCharCounter(input);
  });
}

function setupKeyEvents() {
  document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const qaInput = document.getElementById('qaInput');
      const qaInputResponse = document.getElementById('qaInputResponse');
      
      if (e.target === qaInput && App.qa) {
        e.preventDefault();
        App.qa.sendQuestion();
      } else if (e.target === qaInputResponse && App.qa) {
        e.preventDefault();
        App.qa.sendFollowupQuestion();
      }
    }
  });
}