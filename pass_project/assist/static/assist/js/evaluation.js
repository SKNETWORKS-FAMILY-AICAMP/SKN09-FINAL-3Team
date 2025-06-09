// 평가 관련 기능
App.evaluation = {
  // AI 평가 시작
  start() {
    if (!App.data.currentDraftContent) {
      App.utils.showNotification('평가할 초안이 없습니다.');
      return;
    }
    
    App.utils.showNotification('AI가 특허 명세서를 평가 중입니다...');
    
    // 레이아웃 전환
    const fullPanel = document.getElementById('fullPanelContainer');
    const evaluationLayout = document.getElementById('evaluationLayout');
    
    if (fullPanel && evaluationLayout) {
      fullPanel.style.display = 'none';
      evaluationLayout.style.display = 'flex';
    }
    
    // 좌측에 마크다운 렌더링
    const leftPanel = evaluationLayout.querySelector('.draft-panel-left .panel-body');
    if (leftPanel) {
      leftPanel.innerHTML = '';
      
      const markdownDiv = document.createElement('div');
      markdownDiv.className = 'markdown-content';
      markdownDiv.innerHTML = App.utils.convertMarkdownToHTML(App.data.currentDraftContent);
      leftPanel.appendChild(markdownDiv);
    }
    
    App.data.isEvaluationMode = true;
    
    // AI 평가 결과 생성 (시뮬레이션)
    setTimeout(() => {
      this.generateResult();
      App.utils.showNotification('AI 평가가 완료되었습니다.');
    }, 2000);
  },
  
  // AI 평가 결과 생성
  generateResult() {
    const evaluationContent = document.getElementById('evaluationContent');
    
    if (!evaluationContent) return;
    
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
      
      <div class="evaluation-section">
        <h4>📈 품질 지표</h4>
        <ul>
          <li><strong>명확성:</strong> 7/10 - 기술 내용이 대체로 명확하나 일부 보완 필요</li>
          <li><strong>완성도:</strong> 6/10 - 기본 구조는 완성되었으나 세부 내용 보강 필요</li>
          <li><strong>특허성:</strong> 7/10 - 특허로서의 요건을 대체로 만족</li>
          <li><strong>법적 적합성:</strong> 8/10 - 특허법 요건에 대체로 부합</li>
        </ul>
      </div>
      
      <div class="evaluation-section">
        <h4>🔧 구체적 개선 제안</h4>
        <ul>
          <li><strong>청구항 보강:</strong> "상기 시스템은 [구체적 기술요소]를 포함하여..." 형태로 수정</li>
          <li><strong>배경기술 보완:</strong> 기존 기술의 구체적 한계점과 문제점을 수치로 제시</li>
          <li><strong>실시예 확장:</strong> 최소 2개 이상의 구체적 실시예 추가</li>
          <li><strong>도면 연계:</strong> 도면 부호와 설명의 일치성 확인 및 보완</li>
        </ul>
      </div>
    `;
    
    evaluationContent.innerHTML = evaluationHTML;
  },
  
  // 평가 기준별 점수 계산 (실제 구현 시 사용)
  calculateScores(content) {
    // 실제 AI 평가 로직이 들어갈 부분
    const scores = {
      clarity: this.evaluateClarity(content),
      completeness: this.evaluateCompleteness(content),
      patentability: this.evaluatePatentability(content),
      legalCompliance: this.evaluateLegalCompliance(content)
    };
    
    return scores;
  },
  
  // 명확성 평가
  evaluateClarity(content) {
    // 기술 설명의 명확성을 평가하는 로직
    let score = 5;
    
    // 기본 섹션 존재 여부 확인
    if (content.includes('## 기술분야')) score += 1;
    if (content.includes('## 배경기술')) score += 1;
    if (content.includes('## 해결하려는 과제')) score += 1;
    if (content.includes('## 특허청구범위')) score += 2;
    
    return Math.min(score, 10);
  },
  
  // 완성도 평가
  evaluateCompleteness(content) {
    let score = 4;
    
    // 필수 요소들 확인
    const requiredSections = [
      '발명의 명칭',
      '기술분야',
      '배경기술',
      '해결하려는 과제',
      '과제의 해결 수단',
      '발명의 효과',
      '특허청구범위'
    ];
    
    requiredSections.forEach(section => {
      if (content.includes(section)) score += 1;
    });
    
    return Math.min(score, 10);
  },
  
  // 특허성 평가
  evaluatePatentability(content) {
    let score = 6;
    
    // 신규성 관련 키워드 확인
    if (content.includes('혁신') || content.includes('새로운') || content.includes('개선')) score += 1;
    if (content.includes('차별')) score += 1;
    if (content.includes('효과')) score += 1;
    if (content.includes('해결')) score += 1;
    
    return Math.min(score, 10);
  },
  
  // 법적 적합성 평가
  evaluateLegalCompliance(content) {
    let score = 7;
    
    // 청구항 형식 확인
    if (content.includes('청구항 1')) score += 1;
    if (content.includes('출원인')) score += 1;
    if (content.includes('발명자')) score += 1;
    
    return Math.min(score, 10);
  }
};