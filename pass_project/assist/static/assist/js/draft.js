// 초안 관련 기능
App.draft = {
  // 특허 초안 표시 (마크다운 렌더링)
  display(content) {
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
      markdownDiv.innerHTML = App.utils.convertMarkdownToHTML(content);
      
      // 버튼 행 앞에 삽입
      const buttonRow = draftContent.querySelector('.button-row');
      draftContent.insertBefore(markdownDiv, buttonRow);
      
      // 버튼 상태 초기화
      const normalButtons = document.getElementById('normalButtons');
      const editButtons = document.getElementById('editButtons');
      if (normalButtons) normalButtons.style.display = 'flex';
      if (editButtons) editButtons.style.display = 'none';
    }
    
    App.utils.showNotification('📄 특허 명세서 초안이 마크다운 형식으로 생성되었습니다.');
  },

  // 저장 기능
  save() {
    // 직접 수정 모드인 경우 textarea의 내용을 가져옴
    const textarea = document.getElementById('draft_text');
    if (textarea) {
      App.data.currentDraftContent = textarea.value;
    }
    
    if (!App.data.currentDraftContent) {
      App.utils.showNotification('저장할 내용이 없습니다.');
      return;
    }
    
    const now = new Date();
    const timestamp = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0') + '_' + 
      String(now.getHours()).padStart(2, '0') + ':' + 
      String(now.getMinutes()).padStart(2, '0');
    
    App.utils.showNotification(`💾 특허명세서_${timestamp}로 저장되었습니다.`);
    
    // ============= [추가] 히스토리 최신 그룹에 버전 저장 =============
    if (App.history && typeof App.history.handleSaveWithVersion === 'function') {
      const latestGroup = App.history.data.myHistory[0];
      if (latestGroup) {
        App.history.handleSaveWithVersion(latestGroup.id);
      } else {
        // 히스토리 그룹이 하나도 없으면 새로 추가
        App.history.addToHistory("새로운 특허 명세서");
      }
    }
    // =============================================================
  },

  // 직접 수정 모드 활성화
  enableEdit() {
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
      textarea.value = App.data.currentDraftContent;
      
      // 버튼 행 앞에 삽입
      const buttonRow = draftContent.querySelector('.button-row');
      draftContent.insertBefore(textarea, buttonRow);
      
      // 버튼 변경
      normalButtons.style.display = 'none';
      editButtons.style.display = 'flex';
      
      textarea.focus();
      App.utils.showNotification('✏️ 수정 모드가 활성화되었습니다. 자유롭게 편집하세요.');
    }
  },

  // 수정 취소
  cancelEdit() {
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
      markdownDiv.innerHTML = App.utils.convertMarkdownToHTML(App.data.currentDraftContent);
      
      // 버튼 행 앞에 삽입
      const buttonRow = draftContent.querySelector('.button-row');
      draftContent.insertBefore(markdownDiv, buttonRow);
      
      // 버튼 변경
      editButtons.style.display = 'none';
      normalButtons.style.display = 'flex';
      
      App.utils.showNotification('🔄 수정이 취소되었습니다.');
    }
  },

  // 수정 완료
  saveEdit() {
    const textarea = document.getElementById('draft_text');
    const draftContent = document.getElementById('draftContent');
    const normalButtons = document.getElementById('normalButtons');
    const editButtons = document.getElementById('editButtons');
    
    if (textarea) {
      // 수정된 내용 저장
      App.data.currentDraftContent = textarea.value;
      
      // textarea 제거
      textarea.remove();
      
      // 마크다운 컨텐츠 영역 다시 생성
      const markdownDiv = document.createElement('div');
      markdownDiv.className = 'markdown-content';
      markdownDiv.innerHTML = App.utils.convertMarkdownToHTML(App.data.currentDraftContent);
      
      // 버튼 행 앞에 삽입
      const buttonRow = draftContent.querySelector('.button-row');
      draftContent.insertBefore(markdownDiv, buttonRow);
      
      // 버튼 변경
      editButtons.style.display = 'none';
      normalButtons.style.display = 'flex';
      
      App.utils.showNotification('✅ 수정이 완료되었습니다.');
    }
  },

  // AI 요청 기능
  requestAI() {
    const prompt = window.prompt('AI에게 요청할 수정 사항을 입력하세요:\n(예: "청구항을 더 구체적으로 작성해주세요", "기술분야 설명을 보완해주세요")');
    
    if (!prompt || !prompt.trim()) return;
    
    App.utils.showNotification('AI가 요청사항을 처리 중입니다...');
    
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
      App.utils.showNotification(`AI 요청 완료: ${randomResponse}`);
      
      // 실제로는 서버 API를 호출하여 AI가 수정한 내용을 받아와야 함
    }, 2000);
  },

  // 다운로드 기능 (모달 열기)
  download() {
    if (App.download) {
      App.download.openModal();
    } else {
      // 백업 다운로드 (모달 모듈이 없는 경우)
      this.fallbackDownload();
    }
  },

  // 백업 다운로드 함수
  fallbackDownload() {
    if (!App.data.currentDraftContent) {
      App.utils.showNotification('다운로드할 내용이 없습니다.');
      return;
    }
    
    const now = new Date();
    const timestamp = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0');
    
    // 마크다운 파일로 다운로드
    const blob = new Blob([App.data.currentDraftContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `특허명세서_초안_${timestamp}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    App.utils.showNotification('특허 명세서가 마크다운 파일로 다운로드되었습니다.');
  }
};