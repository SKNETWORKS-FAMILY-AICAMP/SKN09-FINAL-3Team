// Q&A 관련 기능
App.qa = {
  // Q&A 레이아웃 초기화
  resetLayout() {
    const qaInitial = document.getElementById('qaInitial');
    const qaResponse = document.getElementById('qaResponse');
    const qaInput = document.getElementById('qaInput');
    
    if (qaInitial) qaInitial.style.display = 'flex';
    if (qaResponse) qaResponse.style.display = 'none';
    if (qaInput) qaInput.value = '';
  },
  
  // 추천 질문 설정
  setQuestion(question) {
    const qaInput = document.getElementById('qaInput');
    if (qaInput) {
      qaInput.value = question;
      qaInput.focus();
    }
  },
  
  // 질문 전송
  async sendQuestion() {
    const qaInput = document.getElementById('qaInput');
    const question = qaInput.value.trim();
    
    if (!question) {
      App.utils.showNotification('❓ 질문을 입력해주세요.');
      return;
    }
    
    // 로딩 표시
    App.utils.showNotification('🤖 AI가 답변을 생성하고 있습니다...');
    
    try {
      const response = await fetch(window.location.pathname, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCSRFToken()
        },
        body: JSON.stringify({ question: question })
      });
      
      const result = await response.json();
      
      if (result.success) {
        this.showAnswer(question, result.answer);
      } else {
        App.utils.showNotification('❌ ' + result.message);
      }
      
    } catch (error) {
      console.error('Network error:', error);
      App.utils.showNotification('❌ 네트워크 오류가 발생했습니다.');
      
      // 오류 시 기본 답변 표시
      setTimeout(() => {
        this.showAnswer(question);
      }, 1000);
    }
  },
  
  // 추가 질문 전송
  async sendFollowupQuestion() {
    const qaInputResponse = document.getElementById('qaInputResponse');
    const question = qaInputResponse.value.trim();
    
    if (!question) {
      App.utils.showNotification('❓ 추가 질문을 입력해주세요.');
      return;
    }
    
    App.utils.showNotification('🤖 AI가 답변을 생성하고 있습니다...');
    
    try {
      const response = await fetch(window.location.pathname, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCSRFToken()
        },
        body: JSON.stringify({ question: question })
      });
      
      const result = await response.json();
      
      if (result.success) {
        this.addFollowupAnswer(question, result.answer);
        qaInputResponse.value = '';
      } else {
        App.utils.showNotification('❌ ' + result.message);
      }
      
    } catch (error) {
      console.error('Network error:', error);
      App.utils.showNotification('❌ 네트워크 오류가 발생했습니다.');
      
      // 오류 시 기본 답변 표시
      setTimeout(() => {
        this.addFollowupAnswer(question);
        qaInputResponse.value = '';
      }, 1000);
    }
  },
  
  // 답변 표시
  showAnswer(question, answer = null) {
    const qaInitial = document.getElementById('qaInitial');
    const qaResponse = document.getElementById('qaResponse');
    const userQuestion = document.getElementById('userQuestion');
    const aiAnswer = document.getElementById('aiAnswer');
    
    if (qaInitial) qaInitial.style.display = 'none';
    if (qaResponse) qaResponse.style.display = 'flex';
    
    if (userQuestion) {
      // 새로운 구조에 맞게 질문 표시
      const questionText = userQuestion.querySelector('.question-text');
      if (questionText) {
        questionText.textContent = question;
      } else {
        // 기존 구조 지원 (하위 호환성)
        userQuestion.textContent = question;
      }
    }
    
    if (aiAnswer) {
      aiAnswer.innerHTML = answer || this.generateAnswer(question);
    }
    
    App.utils.showNotification('✅ 답변이 완료되었습니다.');
  },
  
  // 추가 답변 추가
  addFollowupAnswer(question, answer = null) {
    const qaConversation = document.querySelector('.qa-conversation');
    
    if (!qaConversation) return;
    
    // 새 질문 박스 추가
    const newQuestionBox = document.createElement('div');
    newQuestionBox.className = 'user-question-box';
    newQuestionBox.innerHTML = `
      <div class="question-icon">💡 질문 내용</div>
      <div class="question-text">${question}</div>
    `;
    
    // 새 답변 박스 추가
    const newAnswerBox = document.createElement('div');
    newAnswerBox.className = 'ai-answer-box';
    newAnswerBox.innerHTML = `
      <h4 class="answer-title">답변</h4>
      <div class="ai-answer">${answer || this.generateAnswer(question)}</div>
    `;
    
    qaConversation.appendChild(newQuestionBox);
    qaConversation.appendChild(newAnswerBox);
    
    // 스크롤을 아래로
    qaConversation.scrollTop = qaConversation.scrollHeight;
    
    App.utils.showNotification('✅ 추가 답변이 완료되었습니다.');
  },
  
  // CSRF 토큰 가져오기
  getCSRFToken() {
    const csrfCookie = document.cookie.split(';')
      .find(row => row.trim().startsWith('csrftoken='));
    
    if (csrfCookie) {
      return csrfCookie.split('=')[1];
    }
    
    // meta 태그에서 CSRF 토큰 찾기
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    if (csrfMeta) {
      return csrfMeta.getAttribute('content');
    }
    
    // hidden input에서 CSRF 토큰 찾기
    const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
    if (csrfInput) {
      return csrfInput.value;
    }
    
    return '';
  },
  
  // AI 답변 생성 (시뮬레이션)
  generateAnswer(question) {
    const answers = {
      "특허 출원 절차와 필요 서류는 무엇인가요?": `
        <h3>특허 출원 절차</h3>
        <p>특허 출원은 다음과 같은 단계로 진행됩니다:</p>
        <ol>
          <li><strong>발명의 완성</strong> - 실제로 구현 가능한 발명이어야 함</li>
          <li><strong>선행기술조사</strong> - 출원하려는 발명이 이미 공개되었는지 확인</li>
          <li><strong>특허명세서 작성</strong> - 발명의 내용을 상세히 기술</li>
          <li><strong>출원서류 제출</strong> - 특허청에 필요 서류와 함께 출원</li>
          <li><strong>심사청구</strong> - 출원일로부터 3년 이내에 심사 요청</li>
          <li><strong>특허심사</strong> - 특허청 심사관의 신규성, 진보성 등 검토</li>
          <li><strong>특허등록</strong> - 심사 통과 시 특허권 부여</li>
        </ol>
        
        <h4>출원시 준비 서류</h4>
        <ul>
          <li>특허출원서</li>
          <li>명세서 (발명의 설명, 특허청구범위 포함)</li>
          <li>도면 (필요시)</li>
          <li>요약서</li>
          <li>우선권증명서류 (해당시)</li>
          <li>위임장 (대리인 선임시)</li>
          <li>출원료 납부서</li>
        </ul>
        
        <p>출원료는 출원 시 납부하며, 심사청구료는 별도로 납부해야 합니다.</p>
      `,
      
      "선행기술조사는 어떻게 진행하나요?": `
        <h3>선행기술조사의 목적</h3>
        <p><strong>선행기술조사</strong>는 출원하려는 발명이 이미 공개된 기술과 동일하거나 유사한지 확인하는 과정입니다.</p>
        
        <h4>조사 방법</h4>
        <ol>
          <li><strong>키워드 선정</strong> - 발명과 관련된 핵심 키워드 추출</li>
          <li><strong>데이터베이스 검색</strong> - 특허DB, 논문DB 등을 활용한 검색</li>
          <li><strong>분류코드 활용</strong> - IPC, CPC 등 특허분류 코드 활용</li>
          <li><strong>인용문헌 추적</strong> - 관련 특허의 인용문헌 확인</li>
        </ol>
        
        <h4>주요 검색 데이터베이스</h4>
        <ul>
          <li><strong>국내</strong> - KIPRIS (특허청 특허정보검색서비스)</li>
          <li><strong>미국</strong> - USPTO, Google Patents</li>
          <li><strong>유럽</strong> - Espacenet</li>
          <li><strong>일본</strong> - J-PlatPat</li>
          <li><strong>중국</strong> - CNIPA</li>
          <li><strong>국제</strong> - WIPO Global Brand Database</li>
        </ul>
        
        <p>전문적인 조사를 위해서는 특허법무법인이나 특허청 검색서비스를 활용하는 것을 권장합니다.</p>
      `,
      
      "선출원주의는 어떤 적용원리는 무엇인가요?": `
        <h3>선출원주의 개념</h3>
        <p><strong>선출원주의</strong>는 동일한 발명에 대해 여러 출원이 있을 경우, 가장 먼저 출원한 자에게 특허권을 부여하는 제도입니다.</p>
        
        <h4>적용 원리</h4>
        <ul>
          <li><strong>출원일 우선</strong> - 동일한 발명에 대해 출원일이 빠른 것이 우선권을 가집니다</li>
          <li><strong>공개원칙</strong> - 출원일을 기준으로 기술 공개를 촉진합니다</li>
          <li><strong>신속성 장려</strong> - 발명 후 빠른 출원을 유도합니다</li>
        </ul>
        
        <h4>주요 특징</h4>
        <ul>
          <li><strong>출원일 기준</strong> - 발명일이 아닌 출원일을 기준으로 판단</li>
          <li><strong>객관적 판단</strong> - 출원 순서가 명확하여 분쟁 소지가 적음</li>
          <li><strong>신속한 출원 장려</strong> - 빠른 출원을 통한 기술 공개 촉진</li>
        </ul>
        
        <p>우리나라를 포함한 대부분의 국가에서 선출원주의를 채택하고 있습니다.</p>
      `,
      
      "특허권의 존속기간과 연장은 어떻게 되나요?": `
        <h3>특허권 존속기간</h3>
        <p>특허권의 존속기간은 <strong>출원일부터 20년</strong>입니다.</p>
        
        <h4>존속기간 연장</h4>
        <ul>
          <li><strong>의약품 특허</strong> - 식품의약품안전처 허가로 인한 지연기간만큼 연장 (최대 5년)</li>
          <li><strong>농약 특허</strong> - 농촌진흥청 등록으로 인한 지연기간만큼 연장 (최대 4년)</li>
          <li><strong>원자력 관련 특허</strong> - 원자력안전위원회 허가 지연기간만큼 연장</li>
        </ul>
        
        <h4>연장 조건</h4>
        <ul>
          <li>해당 특허발명을 실시하기 위해 법률에 의한 허가 등이 필요한 경우</li>
          <li>허가 등을 위한 절차로 인해 상당한 기간 특허발명을 실시할 수 없었던 경우</li>
          <li>특허권자의 책임이 아닌 사유로 지연된 경우</li>
        </ul>
        
        <p>연장신청은 특허권 존속기간 만료 전 3개월 이내에 해야 합니다.</p>
      `,
      
      "PCT 국제출원의 장점은 무엇인가요?": `
        <h3>PCT 국제출원 제도</h3>
        <p><strong>PCT(Patent Cooperation Treaty)</strong>는 하나의 출원으로 여러 국가에서 특허보호를 받을 수 있는 국제적인 특허협력 조약입니다.</p>
        
        <h4>주요 장점</h4>
        
        <h4>1. 절차의 간소화</h4>
        <ul>
          <li>하나의 출원서로 여러 국가에 동시 출원 효과</li>
          <li>각국 개별 출원보다 절차가 간단</li>
          <li>통일된 출원 양식 사용</li>
        </ul>
        
        <h4>2. 시간적 이익</h4>
        <ul>
          <li><strong>30개월의 여유기간</strong> - 각국 진입 시점을 늦출 수 있음</li>
          <li>시장 상황을 파악한 후 진입국 결정 가능</li>
          <li>추가 연구개발 시간 확보</li>
        </ul>
        
        <h4>3. 비용 절감</h4>
        <ul>
          <li>초기 출원비용 절약</li>
          <li>번역비용 지연 가능</li>
          <li>불필요한 국가 진입 방지</li>
        </ul>
        
        <p>현재 150여 개국이 PCT에 가입되어 있어 대부분의 주요국에서 활용 가능합니다.</p>
      `
    };
    
    // 질문에 대한 맞춤 답변이 있으면 반환, 없으면 일반 답변 생성
    if (answers[question]) {
      return answers[question];
    }
    
    // 일반적인 AI 답변 생성
    return `
      <p>귀하의 질문 "<strong>${question}</strong>"에 대해 답변드리겠습니다.</p>
      
      <h3>답변</h3>
      <p>특허 관련 질문에 대한 답변을 제공해드립니다. 구체적인 사안의 경우 전문가와의 상담을 권장합니다.</p>
      
      <h4>참고사항</h4>
      <ul>
        <li>특허 관련 법령은 지속적으로 개정되므로 최신 정보 확인이 필요합니다.</li>
        <li>개별 사안에 따라 다른 결과가 나올 수 있습니다.</li>
        <li>정확한 판단을 위해서는 특허청 또는 특허법무법인과 상담하시기 바랍니다.</li>
      </ul>
      
      <p>추가 질문이 있으시면 언제든 말씀해 주세요.</p>
    `;
  }
};

// 페이지 로드 시 Q&A 초기화
document.addEventListener('DOMContentLoaded', function() {
  // Q&A 페이지인 경우에만 초기화
  if (document.getElementById('qaLayout')) {
    App.qa.resetLayout();
  }
});