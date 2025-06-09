// 전역 변수
let currentDraftContent = '';
let isEvaluationMode = false;
let historyData = {
  myHistory: [
    {
      id: 1,
      title: '항공업 자동 예약 시스템',
      items: [
        { id: 11, title: '생성된 특허 명세서 초안 1', content: '...' },
        { id: 12, title: '생성된 특허 명세서 초안 2', content: '...' }
      ],
      expanded: true
    },
    {
      id: 2,
      title: '최적화된 항공 혼잡 해결...',
      items: [
        { id: 21, title: '특허 명세서 초안', content: '...' }
      ],
      expanded: false
    }
  ],
  teamHistory: [
    {
      id: 1,
      name: 'dbwlsdl01 님',
      items: [
        { id: 11, title: '항공편 자동 예약 시스템', content: '...' },
        { id: 12, title: '특허 명세서 초안 33333', content: '...' },
        { id: 13, title: '특허허허 명세서 초안', content: '...' }
      ],
      expanded: true
    },
    {
      id: 2,
      name: 'rodnfl02 님',
      items: [],
      expanded: false
    },
    {
      id: 3,
      name: 'tpwlsdl98 님',
      items: [],
      expanded: false
    }
  ]
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  initializeEventListeners();
  setupHeaderTrigger();
  initializeHistoryPanel();
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
  // 글자 수 카운팅
  const textInputs = document.querySelectorAll('.text-input, .textarea-input');
  textInputs.forEach(input => {
    input.addEventListener('input', function() {
      updateCharCounter(this);
    });
    updateCharCounter(input);
  });
  
  // 폼 제출
  const templateForm = document.getElementById('templateForm');
  if (templateForm) {
    templateForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleFormSubmit();
    });
  }
  
  // QA 입력 필드 Enter 키 이벤트
  document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const qaInput = document.getElementById('qaInput');
      const qaInputResponse = document.getElementById('qaInputResponse');
      
      if (e.target === qaInput) {
        e.preventDefault();
        sendQuestion();
      } else if (e.target === qaInputResponse) {
        e.preventDefault();
        sendFollowupQuestion();
      }
    }
  });
}

// 헤더 트리거 설정
function setupHeaderTrigger() {
  const hiddenHeader = document.getElementById('hiddenHeader');
  const mainContainer = document.querySelector('.main-container');
  
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

// 히스토리 패널 초기화
function initializeHistoryPanel() {
  renderMyHistory();
  renderTeamHistory();
}

// 히스토리 패널 토글
function toggleHistoryPanel() {
  const historyPanel = document.getElementById('historyPanel');
  historyPanel.classList.toggle('collapsed');
}

// My History 렌더링
function renderMyHistory() {
  const container = document.getElementById('myHistoryItems');
  container.innerHTML = '';
  
  historyData.myHistory.forEach(group => {
    const groupElement = createHistoryItemElement(group);
    container.appendChild(groupElement);
  });
}

// Team History 렌더링
function renderTeamHistory() {
  const container = document.getElementById('teamHistoryItems');
  container.innerHTML = '';
  
  historyData.teamHistory.forEach(team => {
    const teamElement = createTeamGroupElement(team);
    container.appendChild(teamElement);
  });
}

// 히스토리 아이템 요소 생성
function createHistoryItemElement(group) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'history-item';
  itemDiv.innerHTML = `
    <div class="history-item-header" onclick="toggleHistoryItem(this)">
      <span class="item-title editable" onclick="editTitle(event, this)">${group.title}</span>
      <div class="item-actions">
        <button class="action-btn edit-btn" onclick="editHistoryItem(event, this, ${group.id})" title="수정">✏️</button>
        <button class="action-btn delete-btn" onclick="deleteHistoryItem(event, this, ${group.id})" title="삭제">🗑️</button>
        <button class="toggle-btn">${group.expanded ? '▼' : '▶'}</button>
      </div>
    </div>
    <div class="history-item-content ${group.expanded ? '' : 'collapsed'}">
      ${group.items.map(item => `
        <div class="sub-item" onclick="loadHistoryItem(this, ${item.id})">
          <span class="sub-icon">📄</span>
          <span>${item.title}</span>
        </div>
      `).join('')}
    </div>
  `;
  
  return itemDiv;
}

// 팀 그룹 요소 생성
function createTeamGroupElement(team) {
  const teamDiv = document.createElement('div');
  teamDiv.className = 'team-group';
  teamDiv.innerHTML = `
    <div class="team-header" onclick="toggleTeamGroup(this, ${team.id})">
      <span>${team.name}</span>
      <button class="toggle-btn">${team.expanded ? '▲' : '▼'}</button>
    </div>
    <div class="team-content ${team.expanded ? '' : 'collapsed'}">
      ${team.items.map(item => `
        <div class="team-item" onclick="viewTeamItem(this, ${item.id})">
          <span class="team-icon">👥</span>
          <span>${item.title}</span>
        </div>
      `).join('')}
    </div>
  `;
  
  return teamDiv;
}

// 히스토리 아이템 토글
function toggleHistoryItem(element) {
  const content = element.nextElementSibling;
  const toggleBtn = element.querySelector('.toggle-btn');
  const isCollapsed = content.classList.contains('collapsed');
  
  content.classList.toggle('collapsed');
  toggleBtn.textContent = isCollapsed ? '▼' : '▶';
  
  // 데이터 업데이트
  const title = element.querySelector('.item-title').textContent;
  const group = historyData.myHistory.find(g => g.title === title);
  if (group) {
    group.expanded = isCollapsed;
  }
}

// 팀 그룹 토글
function toggleTeamGroup(element, teamId) {
  const content = element.nextElementSibling;
  const toggleBtn = element.querySelector('.toggle-btn');
  const isCollapsed = content.classList.contains('collapsed');
  
  content.classList.toggle('collapsed');
  toggleBtn.textContent = isCollapsed ? '▲' : '▼';
  
  // 데이터 업데이트
  const team = historyData.teamHistory.find(t => t.id === teamId);
  if (team) {
    team.expanded = isCollapsed;
  }
}

// 제목 편집
function editTitle(event, element) {
  event.stopPropagation();
  
  const originalText = element.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = originalText;
  input.className = 'edit-input';
  input.style.cssText = `
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 13px;
    color: #333;
    width: 100%;
  `;
  
  element.innerHTML = '';
  element.appendChild(input);
  input.focus();
  input.select();
  
  function saveEdit() {
    const newText = input.value.trim() || originalText;
    element.textContent = newText;
    
    // 데이터 업데이트
    const group = historyData.myHistory.find(g => g.title === originalText);
    if (group) {
      group.title = newText;
    }
    
    showNotification('제목이 수정되었습니다.');
  }
  
  input.addEventListener('blur', saveEdit);
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      element.textContent = originalText;
    }
  });
}

// 히스토리 아이템 편집
function editHistoryItem(event, element, groupId) {
  event.stopPropagation();
  showNotification('편집 기능이 구현될 예정입니다.');
}

// 히스토리 아이템 삭제
function deleteHistoryItem(event, element, groupId) {
  event.stopPropagation();
  
  if (confirm('이 항목을 삭제하시겠습니까?')) {
    // 데이터에서 삭제
    historyData.myHistory = historyData.myHistory.filter(g => g.id !== groupId);
    
    // UI에서 제거
    const historyItem = element.closest('.history-item');
    historyItem.remove();
    
    showNotification('항목이 삭제되었습니다.');
  }
}

// 히스토리 아이템 로드
function loadHistoryItem(element, itemId) {
  showNotification('히스토리 아이템을 로드하고 있습니다...');
  
  // 시뮬레이션된 로드
  setTimeout(() => {
    const sampleContent = `# 로드된 특허 명세서

## 기술분야
이것은 저장된 히스토리에서 로드된 특허 명세서 샘플입니다.

## 배경기술
기존 기술의 한계점과 문제점을 설명합니다.

## 해결하려는 과제
본 발명으로 해결하고자 하는 기술적 과제를 설명합니다.`;

    displayPatentDraft(sampleContent);
    currentDraftContent = sampleContent;
    showNotification('히스토리 아이템이 로드되었습니다.');
  }, 1000);
}

// 팀 아이템 보기 (읽기 전용)
function viewTeamItem(element, itemId) {
  showNotification('팀 아이템을 불러오고 있습니다...');
  
  setTimeout(() => {
    const sampleContent = `# 팀 공유 특허 명세서 (읽기 전용)

## 기술분야
팀원이 작성한 특허 명세서입니다.

## 배경기술
이 문서는 읽기 전용으로 제공됩니다.`;

    displayPatentDraft(sampleContent);
    currentDraftContent = sampleContent;
    showNotification('팀 아이템이 로드되었습니다. (읽기 전용)');
  }, 1000);
}

// 팀 히스토리 새로고침
function refreshTeamHistory() {
  showNotification('팀 히스토리를 새로고침하고 있습니다...');
  
  setTimeout(() => {
    renderTeamHistory();
    showNotification('팀 히스토리가 새로고침되었습니다.');
  }, 1000);
}

// 새 템플릿 생성
function createNewTemplate() {
  // 폼 초기화
  resetForm();
  
  showNotification('새 템플릿을 작성할 수 있습니다.');
}

// 사용자 관련 함수들
function goToMyPage() {
  showNotification('마이페이지로 이동합니다...');
  // 실제로는 마이페이지로 리디렉션
  // window.location.href = '/mypage';
}

function logout() {
  if (confirm('로그아웃 하시겠습니까?')) {
    showNotification('로그아웃 중입니다...');
    // 실제로는 로그아웃 처리
    // window.location.href = '/logout';
  }
}

// AI Q&A 화면으로 전환
function switchToQA() {
  const workArea = document.getElementById('workArea');
  const fullPanel = document.getElementById('fullPanelContainer');
  const evaluationLayout = document.getElementById('evaluationLayout');
  const qaLayout = document.getElementById('qaLayout');
  
  fullPanel.style.display = 'none';
  evaluationLayout.style.display = 'none';
  qaLayout.style.display = 'block';
  
  // 헤더 메뉴 업데이트
  updateHeaderMenu('qa');
  
  // Q&A 초기 화면으로 리셋
  resetQALayout();
}

// AI assist 화면으로 전환
function switchToAssist() {
  const fullPanel = document.getElementById('fullPanelContainer');
  const evaluationLayout = document.getElementById('evaluationLayout');
  const qaLayout = document.getElementById('qaLayout');
  
  fullPanel.style.display = 'flex';
  evaluationLayout.style.display = 'none';
  qaLayout.style.display = 'none';
  
  // 헤더 메뉴 업데이트
  updateHeaderMenu('assist');
}

// 헤더 메뉴 업데이트
function updateHeaderMenu(activeMenu) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
    
    if (activeMenu === 'qa' && item.textContent === 'AI Q&A') {
      item.classList.add('active');
    } else if (activeMenu === 'assist' && item.textContent === 'AI assist') {
      item.classList.add('active');
    }
  });
}

// Q&A 레이아웃 초기화
function resetQALayout() {
  const qaInitial = document.getElementById('qaInitial');
  const qaResponse = document.getElementById('qaResponse');
  const qaInput = document.getElementById('qaInput');
  
  qaInitial.style.display = 'flex';
  qaResponse.style.display = 'none';
  qaInput.value = '';
}

// 질문 전송
function sendQuestion() {
  const qaInput = document.getElementById('qaInput');
  const question = qaInput.value.trim();
  
  if (!question) {
    showNotification('❓ 질문을 입력해주세요.');
    return;
  }
  
  // 로딩 표시
  showNotification('🤖 AI가 답변을 생성하고 있습니다...');
  
  // 답변 화면으로 전환
  setTimeout(() => {
    showAnswer(question);
  }, 1500);
}

// 추가 질문 전송
function sendFollowupQuestion() {
  const qaInputResponse = document.getElementById('qaInputResponse');
  const question = qaInputResponse.value.trim();
  
  if (!question) {
    showNotification('❓ 추가 질문을 입력해주세요.');
    return;
  }
  
  showNotification('🤖 AI가 답변을 생성하고 있습니다...');
  
  // 기존 답변에 추가
  setTimeout(() => {
    addFollowupAnswer(question);
    qaInputResponse.value = '';
  }, 1500);
}

// 답변 표시
function showAnswer(question) {
  const qaInitial = document.getElementById('qaInitial');
  const qaResponse = document.getElementById('qaResponse');
  const userQuestion = document.getElementById('userQuestion');
  const aiAnswer = document.getElementById('aiAnswer');
  
  qaInitial.style.display = 'none';
  qaResponse.style.display = 'flex';
  
  userQuestion.textContent = question;
  aiAnswer.innerHTML = generateAIAnswer(question);
  
  showNotification('✅ 답변이 완료되었습니다.');
}

// 추가 답변 추가
function addFollowupAnswer(question) {
  const qaConversation = document.querySelector('.qa-conversation');
  
  // 새 질문 추가
  const newQuestion = document.createElement('div');
  newQuestion.className = 'user-question';
  newQuestion.textContent = question;
  
  // 새 답변 추가
  const newAnswer = document.createElement('div');
  newAnswer.className = 'ai-answer';
  newAnswer.innerHTML = generateAIAnswer(question);
  
  qaConversation.appendChild(newQuestion);
  qaConversation.appendChild(newAnswer);
  
  // 스크롤을 아래로
  qaConversation.scrollTop = qaConversation.scrollHeight;
  
  showNotification('✅ 추가 답변이 완료되었습니다.');
}

// AI 답변 생성 (시뮬레이션)
function generateAIAnswer(question) {
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
      
      <h3>출원시 준비 서류</h3>
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
      
      <h4>조사 시 주의사항</h4>
      <ul>
        <li>다양한 키워드 조합으로 검색</li>
        <li>영문, 한글 등 다국어로 검색</li>
        <li>동의어, 유의어도 함께 검색</li>
        <li>최신 기술동향까지 포함하여 조사</li>
      </ul>
      
      <p>전문적인 조사를 위해서는 특허법무법인이나 특허청 검색서비스를 활용하는 것을 권장합니다.</p>
    `,
    
    "선출원주의라는 어떤 개념인가요?": `
      <h3>선출원주의 개념</h3>
      <p><strong>선출원주의</strong>는 동일한 발명에 대해 여러 출원이 있을 경우, 가장 먼저 출원한 자에게 특허권을 부여하는 제도입니다.</p>
      
      <h4>주요 특징</h4>
      <ul>
        <li><strong>출원일 기준</strong> - 발명일이 아닌 출원일을 기준으로 판단</li>
        <li><strong>객관적 판단</strong> - 출원 순서가 명확하여 분쟁 소지가 적음</li>
        <li><strong>신속한 출원 장려</strong> - 빠른 출원을 통한 기술 공개 촉진</li>
      </ul>
      
      <h4>선발명주의와의 차이</h4>
      <p>과거 미국에서 사용하던 <strong>선발명주의</strong>는 먼저 발명한 자에게 특허권을 부여하는 제도였으나, 2013년부터 선출원주의로 변경되었습니다.</p>
      
      <p>우리나라를 포함한 대부분의 국가에서 선출원주의를 채택하고 있습니다.</p>
    `,
        "특허권의 존속기간과 연장은 어떻게 되나요?": `
      <h3>특허권 존속기간</h3>
      <p>특허권의 존속기간은 <strong>출원일부터 20년</strong>입니다.</p>
      
      <h4>존속기간 연장</h4>
      <p>특정 조건 하에서 특허권 존속기간을 연장할 수 있습니다:</p>
      
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
      
      <h4>4. 사전 심사</h4>
      <ul>
        <li><strong>국제조사보고서</strong> - 특허성에 대한 사전 정보 제공</li>
        <li><strong>국제예비심사</strong> - 특허 가능성 사전 판단</li>
        <li>각국 심사에서 유리한 자료로 활용</li>
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

// 일반 모드로 돌아가기
function backToNormal() {
  const fullPanel = document.getElementById('fullPanelContainer');
  const evaluationLayout = document.getElementById('evaluationLayout');
  const qaLayout = document.getElementById('qaLayout');
  
  fullPanel.style.display = 'flex';
  evaluationLayout.style.display = 'none';
  qaLayout.style.display = 'none';
  
  // 헤더 메뉴 업데이트
  updateHeaderMenu('assist');
  
  isEvaluationMode = false;
}

// 글자 수 업데이트
function updateCharCounter(input) {
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
}

// 폼 제출 처리 (변환 버튼)
function handleFormSubmit() {
  const formData = getFormData();
  
  // 필수 항목 검증
  const requiredFields = [
    { field: 'techDescription', name: '기술 설명' },
    { field: 'problemSolved', name: '해결 문제' },
    { field: 'techDifferentiation', name: '기술 차별성' },
    { field: 'componentsFunctions', name: '구성 요소 및 기능' },
    { field: 'implementationExample', name: '구현 방식 예' },
    { field: 'applicantName', name: '출원인 이름' },
    { field: 'applicantNationality', name: '출원인 국적' },
    { field: 'applicantAddress', name: '출원인 주소' },
    { field: 'inventorName', name: '발명자 이름' },
    { field: 'inventorNationality', name: '발명자 국적' },
    { field: 'inventorAddress', name: '발명자 주소' }
  ];
  
  for (let required of requiredFields) {
    if (!formData[required.field] || !formData[required.field].trim()) {
      alert(`${required.name}을(를) 입력해주세요.`);
      return;
    }
  }
  
  // 마크다운 형식으로 특허 초안 생성
  generatePatentDraftMarkdown(formData);
  
  // 히스토리에 추가
  addToHistory(formData.techName);
}

// 히스토리에 추가
function addToHistory(techName) {
  const newId = Math.max(...historyData.myHistory.map(h => h.id), 0) + 1;
  const now = new Date();
  const timestamp = now.toLocaleString();
  
  const newHistoryItem = {
    id: newId,
    title: techName || '새로운 특허 명세서',
    items: [
      { 
        id: newId * 10 + 1, 
        title: `생성된 특허 명세서 초안 - ${timestamp}`, 
        content: currentDraftContent 
      }
    ],
    expanded: true
  };
  
  historyData.myHistory.unshift(newHistoryItem);
  renderMyHistory();
  
  showNotification('히스토리에 저장되었습니다.');
}

// 폼 데이터 수집
function getFormData() {
  return {
    techName: document.querySelector('input[name="tech_name"]')?.value || '',
    techDescription: document.querySelector('textarea[name="tech_description"]')?.value || '',
    problemSolved: document.querySelector('textarea[name="problem_solved"]')?.value || '',
    techDifferentiation: document.querySelector('textarea[name="tech_differentiation"]')?.value || '',
    applicationField: document.querySelector('textarea[name="application_field"]')?.value || '',
    componentsFunctions: document.querySelector('textarea[name="components_functions"]')?.value || '',
    implementationExample: document.querySelector('textarea[name="implementation_example"]')?.value || '',
    drawingDescription: document.querySelector('textarea[name="drawing_description"]')?.value || '',
    applicantName: document.querySelector('input[name="applicant_name"]')?.value || '',
    applicantNationality: document.querySelector('select[name="applicant_nationality"]')?.value || '',
    applicantAddress: document.querySelector('input[name="applicant_address"]')?.value || '',
    inventorName: document.querySelector('input[name="inventor_name"]')?.value || '',
    inventorNationality: document.querySelector('select[name="inventor_nationality"]')?.value || '',
    inventorAddress: document.querySelector('input[name="inventor_address"]')?.value || ''
  };
}

// 마크다운 형식으로 특허 초안 생성
function generatePatentDraftMarkdown(formData) {
  const techName = formData.techName.trim() || '혁신적인 기술 시스템';
  const englishTitle = generateEnglishTitle(techName);
  
  const draftContent = `# 발명의 명칭
${techName}
*${englishTitle}*

## 기술분야
${formData.techDescription}

## 배경기술
${formData.problemSolved}

기존 기술들은 다양한 한계점을 가지고 있었습니다. 특히 효율성, 정확성, 경제성 측면에서 개선이 필요한 상황이었으며, 이러한 문제점들을 해결하기 위한 혁신적인 접근 방법이 요구되었습니다.

## 해결하려는 과제
${formData.problemSolved}

본 발명은 **${techName}**을 통해 기존 기술의 한계를 극복하고, 더 나은 솔루션을 제공하는 것을 주요 목표로 합니다.

## 과제의 해결 수단
${formData.techDifferentiation}

본 발명은 다음과 같은 혁신적인 방법론을 통해 기존 문제를 해결합니다:
- 체계적이고 효율적인 접근 방식
- 사용자 중심의 설계 철학
- 확장 가능한 아키텍처 구현

${formData.applicationField ? `\n## 활용 분야\n${formData.applicationField}\n` : ''}

## 발명의 효과
본 발명을 통해 다음과 같은 효과를 얻을 수 있습니다:

- **성능 향상**: 기존 기술 대비 현저히 향상된 성능 및 효율성
- **경제성 개선**: 비용 효율적인 솔루션 제공
- **사용자 편의성**: 직관적이고 사용하기 쉬운 인터페이스
- **확장성**: 다양한 분야에서의 실용적 활용 가능성
- **안정성**: 기술적 안정성 및 신뢰성 확보

## 발명을 실시하기 위한 구체적인 내용

### 주요 구성 요소
${formData.componentsFunctions}

### 구현 방식
${formData.implementationExample}

본 발명의 주요 구성 요소들이 유기적으로 연동하여 혁신적인 솔루션을 제공합니다.

${formData.drawingDescription ? `\n### 도면의 간단한 설명\n${formData.drawingDescription}\n` : ''}

## 특허청구범위

**청구항 1**: ${techName}에 있어서,
상기 기술의 핵심 구성을 포함하여 혁신적인 기능을 제공하는 것을 특징으로 하는 시스템.

**청구항 2**: 제1항에 있어서,
${formData.componentsFunctions.split('.')[0] || '효율적인 데이터 처리 및 분석 기능'}을 추가로 포함하는 것을 특징으로 하는 시스템.

**청구항 3**: 제1항 또는 제2항에 있어서,
사용자 친화적인 인터페이스를 통해 직관적인 조작이 가능한 것을 특징으로 하는 시스템.

**청구항 4**: 제1항 내지 제3항 중 어느 한 항에 있어서,
${formData.techDifferentiation.split('.')[0] || '보안 기능을 강화하여 안전한 시스템 운영을 보장'}하는 것을 특징으로 하는 시스템.

---

### 출원인 정보
- **이름**: ${formData.applicantName}
- **국적**: ${formData.applicantNationality}
- **주소**: ${formData.applicantAddress}

### 발명자 정보
- **이름**: ${formData.inventorName}
- **국적**: ${formData.inventorNationality}
- **주소**: ${formData.inventorAddress}

---
*※ 본 특허청구범위는 특허법 제42조 제2~5항 및 시행규칙 제21조에 따라 작성되었습니다.*
*※ 모든 기술적 내용은 모범명세서 가이드에 따라 체계적으로 기술되어 있습니다.*`;

  displayPatentDraft(draftContent);
  currentDraftContent = draftContent;
}

// 영어 제목 생성
function generateEnglishTitle(koreanTitle) {
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

// 특허 초안 표시 (마크다운 렌더링)
function displayPatentDraft(content) {
  const noDraftMessage = document.getElementById('noDraftMessage');
  const draftContent = document.getElementById('draftContent');
  
  if (noDraftMessage) noDraftMessage.style.display = 'none';
  if (draftContent) {
    draftContent.style.display = 'block';
    
    // 기존 textarea 제거하고 마크다운 렌더링 영역 생성
    const existingTextarea = draftContent.querySelector('#draft_text');
    if (existingTextarea) {
      existingTextarea.remove();
    }
    
    const existingMarkdown = draftContent.querySelector('.markdown-content');
    if (existingMarkdown) {
      existingMarkdown.remove();
    }
    
    // 마크다운 컨텐츠 영역 생성
    const markdownDiv = document.createElement('div');
    markdownDiv.className = 'markdown-content';
    markdownDiv.innerHTML = convertMarkdownToHTML(content);
    
    // 버튼 행 앞에 삽입
    const buttonRow = draftContent.querySelector('.button-row');
    draftContent.insertBefore(markdownDiv, buttonRow);
    
    // 버튼 상태 초기화
    const normalButtons = document.getElementById('normalButtons');
    const editButtons = document.getElementById('editButtons');
    if (normalButtons) normalButtons.style.display = 'flex';
    if (editButtons) editButtons.style.display = 'none';
  }
  
  showNotification('📄 특허 명세서 초안이 마크다운 형식으로 생성되었습니다.');
}

// 간단한 마크다운을 HTML로 변환
function convertMarkdownToHTML(markdown) {
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
}

// 저장 기능
function saveDraft() {
  // 직접 수정 모드인 경우 textarea의 내용을 가져옴
  const textarea = document.getElementById('draft_text');
  if (textarea) {
    currentDraftContent = textarea.value;
  }
  
  if (!currentDraftContent) {
    showNotification('저장할 내용이 없습니다.');
    return;
  }
  
  const now = new Date();
  const timestamp = now.getFullYear() + '-' + 
    String(now.getMonth() + 1).padStart(2, '0') + '-' + 
    String(now.getDate()).padStart(2, '0') + '_' + 
    String(now.getHours()).padStart(2, '0') + ':' + 
    String(now.getMinutes()).padStart(2, '0');
  
  showNotification(`💾 특허명세서_${timestamp}로 저장되었습니다.`);
}

// 직접 수정 모드 활성화
function enableEdit() {
  const draftContent = document.getElementById('draftContent');
  const markdownContent = draftContent.querySelector('.markdown-content');
  const normalButtons = document.getElementById('normalButtons');
  const editButtons = document.getElementById('editButtons');
  
  if (markdownContent) {
    // 마크다운 렌더링 영역 제거
    markdownContent.remove();
    
    // textarea 생성
    const textarea = document.createElement('textarea');
    textarea.id = 'draft_text';
    textarea.className = 'textarea-input editing';
    textarea.value = currentDraftContent;
    
    // 버튼 행 앞에 삽입
    const buttonRow = draftContent.querySelector('.button-row');
    draftContent.insertBefore(textarea, buttonRow);
    
    // 버튼 변경
    normalButtons.style.display = 'none';
    editButtons.style.display = 'flex';
    
    textarea.focus();
    showNotification('✏️ 수정 모드가 활성화되었습니다. 자유롭게 편집하세요.');
  }
}

// 수정 취소
function cancelEdit() {
  const draftContent = document.getElementById('draftContent');
  const textarea = draftContent.querySelector('#draft_text');
  const normalButtons = document.getElementById('normalButtons');
  const editButtons = document.getElementById('editButtons');
  
  if (textarea) {
    // textarea 제거
    textarea.remove();
    
    // 마크다운 컨텐츠 영역 다시 생성
    const markdownDiv = document.createElement('div');
    markdownDiv.className = 'markdown-content';
    markdownDiv.innerHTML = convertMarkdownToHTML(currentDraftContent);
    
    // 버튼 행 앞에 삽입
    const buttonRow = draftContent.querySelector('.button-row');
    draftContent.insertBefore(markdownDiv, buttonRow);
    
    // 버튼 변경
    editButtons.style.display = 'none';
    normalButtons.style.display = 'flex';
    
    showNotification('🔄 수정이 취소되었습니다.');
  }
}

// 수정 완료
function saveEdit() {
  const textarea = document.getElementById('draft_text');
  const draftContent = document.getElementById('draftContent');
  const normalButtons = document.getElementById('normalButtons');
  const editButtons = document.getElementById('editButtons');
  
  if (textarea) {
    // 수정된 내용 저장
    currentDraftContent = textarea.value;
    
    // textarea 제거
    textarea.remove();
    
    // 마크다운 컨텐츠 영역 다시 생성
    const markdownDiv = document.createElement('div');
    markdownDiv.className = 'markdown-content';
    markdownDiv.innerHTML = convertMarkdownToHTML(currentDraftContent);
    
    // 버튼 행 앞에 삽입
    const buttonRow = draftContent.querySelector('.button-row');
    draftContent.insertBefore(markdownDiv, buttonRow);
    
    // 버튼 변경
    editButtons.style.display = 'none';
    normalButtons.style.display = 'flex';
    
    showNotification('✅ 수정이 완료되었습니다.');
  }
}

// AI 요청 기능
function requestAI() {
  const prompt = prompt('AI에게 요청할 수정 사항을 입력하세요:\n(예: "청구항을 더 구체적으로 작성해주세요", "기술분야 설명을 보완해주세요")');
  
  if (!prompt || !prompt.trim()) return;
  
  showNotification('AI가 요청사항을 처리 중입니다...');
  
  // 시뮬레이션된 AI 응답
  setTimeout(() => {
    const responses = [
      '청구항이 더욱 구체적으로 보완되었습니다.',
      '기술분야 설명이 상세히 추가되었습니다.',
      '발명의 효과 부분이 강화되었습니다.',
      '배경기술 설명이 개선되었습니다.',
      '특허청구범위가 법적 요건에 맞게 수정되었습니다.'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    showNotification(`AI 요청 완료: ${randomResponse}`);
    
    // 실제로는 서버 API를 호출하여 AI가 수정한 내용을 받아와야 함
  }, 2000);
}

// AI 평가 기능
function evaluateAI() {
  if (!currentDraftContent) {
    showNotification('평가할 초안이 없습니다.');
    return;
  }
  
  showNotification('AI가 특허 명세서를 평가 중입니다...');
  
  // 레이아웃 전환
  const fullPanel = document.getElementById('fullPanelContainer');
  const evaluationLayout = document.getElementById('evaluationLayout');
  
  fullPanel.style.display = 'none';
  evaluationLayout.style.display = 'flex';
  
  // 좌측에 마크다운 렌더링
  const leftPanel = evaluationLayout.querySelector('.draft-panel-left .panel-body');
  leftPanel.innerHTML = '';
  
  const markdownDiv = document.createElement('div');
  markdownDiv.className = 'markdown-content';
  markdownDiv.innerHTML = convertMarkdownToHTML(currentDraftContent);
  leftPanel.appendChild(markdownDiv);
  
  isEvaluationMode = true;
  
  // AI 평가 결과 생성 (시뮬레이션)
  setTimeout(() => {
    generateEvaluationResult();
    showNotification('AI 평가가 완료되었습니다.');
  }, 2000);
}

// AI 평가 결과 생성
function generateEvaluationResult() {
  const evaluationContent = document.getElementById('evaluationContent');
  
  const evaluationHTML = `
    <div class="evaluation-section">
      <h4>📊 전체 평가</h4>
      <div class="score">6/10점</div>
      <p>전반적으로 특허 명세서의 기본 구조는 갖추고 있으나, 일부 보완이 필요한 부분이 있습니다.</p>
    </div>
    
    <div class="evaluation-section">
      <h4>🎯 강점</h4>
      <ul>
        <li>기술 설명이 명확하고 구체적으로 작성되었습니다</li>
        <li>해결하고자 하는 문제가 잘 정의되어 있습니다</li>
        <li>발명의 효과가 체계적으로 설명되었습니다</li>
        <li>청구항의 기본 구조가 적절합니다</li>
      </ul>
    </div>
    
    <div class="evaluation-section">
      <h4>⚠️ 개선사항</h4>
      <div class="score">8/10점</div>
      <ul>
        <li>청구항에서 기술적 특징을 더욱 구체적으로 명시할 필요가 있습니다</li>
        <li>종속 청구항을 추가하여 특허 범위를 확장하는 것을 권장합니다</li>
        <li>배경기술 부분에서 선행기술과의 차이점을 더 명확히 할 필요가 있습니다</li>
        <li>도면 설명이 있다면 더욱 상세한 설명을 추가하는 것이 좋겠습니다</li>
      </ul>
    </div>
    
    <div class="evaluation-section">
      <h4>💡 추천</h4>
      <ul>
        <li><strong>우선순위 1:</strong> 청구항 1에서 핵심 기술 요소를 더 구체적으로 기재</li>
        <li><strong>우선순위 2:</strong> 종속 청구항 2-3개 추가 작성</li>
        <li><strong>우선순위 3:</strong> 실시예 부분에 구체적인 수치나 조건 추가</li>
      </ul>
    </div>
  `;
  
  evaluationContent.innerHTML = evaluationHTML;
}

// 다운로드 기능
function downloadDraft() {
  if (!currentDraftContent) {
    showNotification('다운로드할 내용이 없습니다.');
    return;
  }
  
  const now = new Date();
  const timestamp = now.getFullYear() + '-' + 
    String(now.getMonth() + 1).padStart(2, '0') + '-' + 
    String(now.getDate()).padStart(2, '0');
  
  // 마크다운 파일로 다운로드
  const blob = new Blob([currentDraftContent], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `특허명세서_초안_${timestamp}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showNotification('특허 명세서가 마크다운 파일로 다운로드되었습니다.');
}

// 알림 표시
function showNotification(message) {
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
}

// 폼 초기화
function resetForm() {
  const form = document.getElementById('templateForm');
  if (form) {
    form.reset();
    
    // 글자 수 카운터 초기화
    const counters = form.querySelectorAll('.char-counter .current-count');
    counters.forEach(counter => {
      counter.textContent = '0';
    });
    
    // 제한 도달 클래스 제거
    const charCounters = form.querySelectorAll('.char-counter');
    charCounters.forEach(counter => {
      counter.classList.remove('limit-reached');
    });
  }
  
  // 초안 패널 초기화
  const noDraftMessage = document.getElementById('noDraftMessage');
  const draftContent = document.getElementById('draftContent');
  
  if (noDraftMessage) noDraftMessage.style.display = 'block';
  if (draftContent) draftContent.style.display = 'none';
  
  currentDraftContent = '';
  
  showNotification('🔄 폼이 초기화되었습니다.');
}