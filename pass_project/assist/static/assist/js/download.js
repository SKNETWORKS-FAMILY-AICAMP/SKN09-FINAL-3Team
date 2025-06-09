// 다운로드 관련 기능
App.download = {
  // 다운로드 모달 열기
  openModal() {
    if (!App.data.currentDraftId && !App.data.currentDraftContent) {
      App.utils.showNotification('다운로드할 초안이 없습니다.');
      return;
    }
    
    const modal = document.getElementById('downloadModal');
    if (modal) {
      modal.style.display = 'flex';
      
      // 첫 번째 옵션(docx) 선택
      const firstOption = modal.querySelector('input[name="fileFormat"]');
      if (firstOption) {
        firstOption.checked = true;
      }
      
      // ESC 키로 모달 닫기
      document.addEventListener('keydown', this.handleEscKey);
    }
  },
  
  // 다운로드 모달 닫기
  closeModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
      modal.style.display = 'none';
      document.removeEventListener('keydown', this.handleEscKey);
    }
  },
  
  // ESC 키 처리
  handleEscKey(event) {
    if (event.key === 'Escape') {
      App.download.closeModal();
    }
  },
  
  // 다운로드 확인
  confirmDownload() {
    const selectedFormat = document.querySelector('input[name="fileFormat"]:checked');
    
    if (!selectedFormat) {
      App.utils.showNotification('파일 형식을 선택해주세요.');
      return;
    }
    
    const format = selectedFormat.value;
    
    this.closeModal();
    this.downloadFile(format);
  },
  
  // 파일 다운로드 실행
  downloadFile(format) {
    if (!App.data.currentDraftId && !App.data.currentDraftContent) {
      App.utils.showNotification('다운로드할 초안이 없습니다.');
      return;
    }
    
    switch (format) {
      case 'pdf':
        this.downloadPDF();
        break;
      case 'docx':
        this.downloadDOCX();
        break;
      case 'hwp':
        this.downloadHWP();
        break;
      default:
        App.utils.showNotification('지원하지 않는 파일 형식입니다.');
    }
  },
  
  // PDF 다운로드
  downloadPDF() {
    if (App.data.currentDraftId) {
      // Django 백엔드 PDF 다운로드 사용
      window.location.href = `/assist/download/pdf/${App.data.currentDraftId}/`;
      App.utils.showNotification('📄 PDF 파일을 다운로드하고 있습니다...');
    } else {
      // 클라이언트 사이드 PDF 생성 (jsPDF 라이브러리 필요)
      this.generatePDFFromContent();
    }
  },
  
  // DOCX 다운로드
  downloadDOCX() {
    if (App.data.currentDraftId) {
      // Django 백엔드 DOCX 다운로드 사용
      window.location.href = `/assist/download/docx/${App.data.currentDraftId}/`;
      App.utils.showNotification('📄 DOCX 파일을 다운로드하고 있습니다...');
    } else {
      // 클라이언트 사이드 DOCX 생성
      this.generateDOCXFromContent();
    }
  },
  
  // HWP 다운로드
  downloadHWP() {
    if (App.data.currentDraftId) {
      // Django 백엔드 HWP 다운로드 사용 (현재는 텍스트 파일)
      window.location.href = `/assist/download/hwp/${App.data.currentDraftId}/`;
      App.utils.showNotification('📝 HWP 파일을 다운로드하고 있습니다... (텍스트 형식)');
    } else {
      // 클라이언트 사이드 텍스트 생성
      this.generateTextFromContent();
    }
  },
  
  // 클라이언트 사이드 PDF 생성
  generatePDFFromContent() {
    if (!App.data.currentDraftContent) {
      App.utils.showNotification('다운로드할 내용이 없습니다.');
      return;
    }
    
    // 기본 마크다운 다운로드 (PDF 라이브러리가 없는 경우)
    const now = new Date();
    const timestamp = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0');
    
    const blob = new Blob([App.data.currentDraftContent], { 
      type: 'text/plain;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `특허명세서_초안_${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    App.utils.showNotification('📄 텍스트 파일로 다운로드되었습니다. (PDF 변환 기능 준비 중)');
  },
  
  // 클라이언트 사이드 DOCX 생성
  generateDOCXFromContent() {
    if (!App.data.currentDraftContent) {
      App.utils.showNotification('다운로드할 내용이 없습니다.');
      return;
    }
    
    // 기본 마크다운 다운로드 (DOCX 라이브러리가 없는 경우)
    const now = new Date();
    const timestamp = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0');
    
    const blob = new Blob([App.data.currentDraftContent], { 
      type: 'text/markdown;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `특허명세서_초안_${timestamp}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    App.utils.showNotification('📄 마크다운 파일로 다운로드되었습니다. (DOCX 변환 기능 준비 중)');
  },
  
  // 클라이언트 사이드 텍스트 생성
  generateTextFromContent() {
    if (!App.data.currentDraftContent) {
      App.utils.showNotification('다운로드할 내용이 없습니다.');
      return;
    }
    
    const now = new Date();
    const timestamp = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0');
    
    const blob = new Blob([App.data.currentDraftContent], { 
      type: 'text/plain;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `특허명세서_초안_${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    App.utils.showNotification('📝 텍스트 파일로 다운로드되었습니다. (HWP 변환 기능 준비 중)');
  }
};

// 모달 외부 클릭 시 닫기
document.addEventListener('click', function(event) {
  const modal = document.getElementById('downloadModal');
  if (modal && event.target === modal) {
    App.download.closeModal();
  }
});