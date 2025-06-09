window.App = window.App || {};

console.log('✅ history.js 로드됨');

App.history = {
  data: {
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
      { id: 2, name: 'rodnfl02 님', items: [], expanded: false },
      { id: 3, name: 'tpwlsdl98 님', items: [], expanded: false }
    ]
  },

  togglePanel() {
    document.getElementById('historyPanel')?.classList.toggle('collapsed');
  },

  init() {
    this.renderMyHistory();
    this.renderTeamHistory();
  },

  renderMyHistory() {
    const container = document.getElementById('myHistoryItems');
    if (!container) return;
    container.innerHTML = '';

    this.data.myHistory.forEach(group => {
      const el = this.createHistoryItemElement(group);
      container.appendChild(el);
    });
  },

  renderTeamHistory() {
    const container = document.getElementById('teamHistoryItems');
    if (!container) return;
    container.innerHTML = '';

    this.data.teamHistory.forEach(team => {
      container.appendChild(this.createTeamGroupElement(team));
    });
  },

  // 버전 저장
  handleSaveWithVersion(groupId) {
    const group = this.data.myHistory.find(g => g.id === groupId);
    if (!group) return;
    const existing = group.items
      .map(item => {
        const m = item.title.match(/^v(\d+)\b/);
        return m ? parseInt(m[1], 10) : 0;
      });
    const next = Math.max(...existing, 0) + 1;
    const versionLabel = `v${next}`;
    const newId = Math.max(...group.items.map(i => i.id), 0) + 1;
    const now = new Date();
    const newItem = {
      id: newId,
      title: `${versionLabel} - ${now.toLocaleString()}`,
      content: App.data?.currentDraftContent || ''
    };
    group.items.push(newItem);
    group.expanded = true;
    this.renderMyHistory();
    this.renderVersionHistory(groupId, true);
    App.utils?.showNotification?.(`${versionLabel}로 저장되었습니다.`);
  },

  // 버전별 히스토리 뷰어 (그룹 바로 밑에 표시)
  renderVersionHistory(groupId, scrollTo) {
    // 그룹 찾기
    const group = this.data.myHistory.find(g => g.id === groupId);
    if (!group) return;
    // vN으로 시작하는 것만 추출
    const versions = group.items.filter(item => /^v\d+\b/.test(item.title));
    // UI: 그룹 밑에만 추가 (중복 방지)
    let itemDiv = document.querySelector(`.history-item-header .item-title[title-id="${groupId}"]`)?.closest('.history-item');
    if (!itemDiv) {
      // fallback: 그룹 순서대로
      const idx = this.data.myHistory.findIndex(g => g.id === groupId);
      itemDiv = document.getElementById('myHistoryItems')?.children[idx];
    }
    // 기존 패널 제거
    const exist = itemDiv?.querySelector('.version-history-panel');
    if (exist) exist.remove();

    // 생성
    const versionPanel = document.createElement('div');
    versionPanel.className = 'version-history-panel';
    versionPanel.style.padding = '12px';
    versionPanel.style.background = '#f5f5fa';
    versionPanel.style.border = '1px solid #dcdcdc';
    versionPanel.style.marginTop = '10px';
    versionPanel.style.borderRadius = '8px';
    versionPanel.innerHTML = `<b>[${group.title}] 버전 목록</b><br><br>`;
    if (versions.length === 0) {
      versionPanel.innerHTML += '버전 저장 이력이 없습니다.';
    } else {
      versionPanel.innerHTML += versions.map(item =>
        `<div style="margin-bottom:8px">${item.title}</div>`
      ).join('');
    }
    if (itemDiv) {
      itemDiv.appendChild(versionPanel);
      if (scrollTo) versionPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

  createHistoryItemElement(group) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'history-item';

    // 헤더
    itemDiv.innerHTML = `
      <div class="history-item-header">
        <span class="item-title editable" title-id="${group.id}">${group.title}</span>
        <div class="item-actions">
          <button class="action-btn edit-btn" title="수정">✏️</button>
          <button class="action-btn delete-btn" title="삭제">🗑️</button>
          <button class="action-btn save-btn" title="버전 저장">💾</button>
          <button class="toggle-btn">${group.expanded ? '▼' : '▶'}</button>
        </div>
      </div>
      <div class="history-item-content ${group.expanded ? '' : 'collapsed'}"></div>
    `;

    // header 이벤트 (토글만)
    const header = itemDiv.querySelector('.history-item-header');
    header.addEventListener('click', e => {
      if (
        e.target.closest('.action-btn') ||
        e.target.classList.contains('item-title')
      ) return;
      this.toggleItem(header);
    });

    // 타이틀(이름) 편집
    const itemTitle = itemDiv.querySelector('.item-title');
    itemTitle.addEventListener('dblclick', e => {
      e.stopPropagation();
      this.editTitle(e, itemTitle, group);
    });

    // 삭제
    itemDiv.querySelector('.delete-btn').addEventListener('click', e => {
      e.stopPropagation();
      this.deleteItem(e, itemDiv, group.id);
    });

    // 편집
    itemDiv.querySelector('.edit-btn').addEventListener('click', e => {
      e.stopPropagation();
      this.editItem(e, itemDiv, group.id);
    });

    // 버전 저장
    itemDiv.querySelector('.save-btn').addEventListener('click', e => {
      e.stopPropagation();
      this.handleSaveWithVersion(group.id);
    });

    // 버전 보기 버튼
    const versionBtn = document.createElement('button');
    versionBtn.className = 'action-btn version-btn';
    versionBtn.textContent = '버전 목록';
    versionBtn.title = '버전 목록 보기';
    versionBtn.style.marginLeft = '4px';
    versionBtn.onclick = e => {
      e.stopPropagation();
      this.renderVersionHistory(group.id, true);
    };
    itemDiv.querySelector('.item-actions').appendChild(versionBtn);

    // 토글 버튼(▼/▶)
    itemDiv.querySelector('.toggle-btn').addEventListener('click', e => {
      e.stopPropagation();
      this.toggleItem(header);
    });

    // 서브 아이템(초안) 목록
    const contentDiv = itemDiv.querySelector('.history-item-content');
    group.items.forEach(item => {
      const subItemDiv = document.createElement('div');
      subItemDiv.className = 'sub-item';

      // 아이콘(이름변경)
      const iconSpan = document.createElement('span');
      iconSpan.className = 'sub-icon';
      iconSpan.textContent = '📄';
      iconSpan.style.cursor = 'pointer';
      iconSpan.addEventListener('click', e => {
        e.stopPropagation();
        this.renameDraft(e, group.id, item.id);
      });

      // 제목(로드)
      const titleSpan = document.createElement('span');
      titleSpan.className = 'sub-title';
      titleSpan.textContent = item.title;
      titleSpan.style.cursor = 'pointer';
      titleSpan.addEventListener('click', e => {
        e.stopPropagation();
        if (titleSpan.querySelector('input')) return;
        this.loadItem(group, item);
      });

      subItemDiv.appendChild(iconSpan);
      subItemDiv.appendChild(titleSpan);
      contentDiv.appendChild(subItemDiv);
    });

    return itemDiv;
  },

  // 이름 인라인 편집
  renameDraft(event, groupId, itemId) {
    const subItem = event.target.closest('.sub-item');
    const titleSpan = subItem.querySelector('.sub-title');
    const original = titleSpan.textContent.trim();
    if (titleSpan.querySelector('input')) return; // 이미 편집 중

    const input = document.createElement('input');
    input.type = 'text';
    input.value = original;
    input.className = 'edit-input';
    input.style.cssText = 'width:100%; box-sizing:border-box; padding:2px 4px; font-size:12px;';
    titleSpan.textContent = '';
    titleSpan.appendChild(input);
    input.focus();
    input.select();

    const save = () => {
      const v = input.value.trim() || original;
      titleSpan.textContent = v;
      // 데이터 반영
      const grp = this.data.myHistory.find(g => g.id === groupId);
      if (grp) {
        const itm = grp.items.find(i => i.id === itemId);
        if (itm) itm.title = v;
      }
      App.utils?.showNotification?.('초안 이름이 변경되었습니다.');
    };

    input.addEventListener('blur', save);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') save();
      if (e.key === 'Escape') titleSpan.textContent = original;
    });
  },

  // 그룹 타이틀 편집 (더블클릭)
  editTitle(event, element, group) {
    const originalText = element.textContent;
    if (element.querySelector('input')) return;
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

    const saveEdit = () => {
      const newText = input.value.trim() || originalText;
      element.textContent = newText;
      group.title = newText;
      App.utils?.showNotification?.('제목이 수정되었습니다.');
      this.renderMyHistory(); // 전체 갱신
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') saveEdit();
      if (e.key === 'Escape') element.textContent = originalText;
    });
  },

  // 히스토리 아이템 편집(임시)
  editItem(event, element, groupId) {
    App.utils?.showNotification?.('편집 기능이 구현될 예정입니다.');
  },

  // 삭제
  deleteItem(event, element, groupId) {
    if (confirm('이 항목을 삭제하시겠습니까?')) {
      this.data.myHistory = this.data.myHistory.filter(g => g.id !== groupId);
      element.remove();
      App.utils?.showNotification?.('항목이 삭제되었습니다.');
    }
  },

  // 펼치기/접기
  toggleItem(element) {
    const content = element.nextElementSibling;
    const toggleBtn = element.querySelector('.toggle-btn');
    const isCollapsed = content.classList.contains('collapsed');
    content.classList.toggle('collapsed');
    toggleBtn.textContent = isCollapsed ? '▼' : '▶';

    // 데이터 동기화
    const title = element.querySelector('.item-title').textContent;
    const group = this.data.myHistory.find(g => g.title === title);
    if (group) {
      group.expanded = isCollapsed;
    }
  },

  // 팀 그룹 생성
  createTeamGroupElement(team) {
    const teamDiv = document.createElement('div');
    teamDiv.className = 'team-group';
    teamDiv.innerHTML = `
      <div class="team-header">
        <span>${team.name}</span>
        <button class="toggle-btn">${team.expanded ? '▲' : '▼'}</button>
      </div>
      <div class="team-content ${team.expanded ? '' : 'collapsed'}"></div>
    `;

    // 토글
    const header = teamDiv.querySelector('.team-header');
    header.addEventListener('click', e => {
      this.toggleTeamGroup(header, team.id);
    });

    // 팀 초안 리스트
    const contentDiv = teamDiv.querySelector('.team-content');
    team.items.forEach(item => {
      const teamItemDiv = document.createElement('div');
      teamItemDiv.className = 'team-item';
      teamItemDiv.innerHTML = `<span class="team-icon">👥</span><span>${item.title}</span>`;
      teamItemDiv.addEventListener('click', e => {
        e.stopPropagation();
        this.viewTeamItem(teamItemDiv, item.id);
      });
      contentDiv.appendChild(teamItemDiv);
    });

    return teamDiv;
  },

  // 팀 그룹 펼치기/접기
  toggleTeamGroup(element, teamId) {
    const content = element.nextElementSibling;
    const toggleBtn = element.querySelector('.toggle-btn');
    const isCollapsed = content.classList.contains('collapsed');
    content.classList.toggle('collapsed');
    toggleBtn.textContent = isCollapsed ? '▲' : '▼';

    const team = this.data.teamHistory.find(t => t.id === teamId);
    if (team) {
      team.expanded = isCollapsed;
    }
  },

  // 히스토리 아이템 로드(실제 아이템 내용)
  loadItem(group, item) {
    App.utils?.showNotification?.('히스토리 아이템을 로드하고 있습니다...');
    setTimeout(() => {
      // 실제 저장된 content 사용
      const content = item.content || '내용 없음';
      if (App.draft) {
        App.draft.display(content);
        App.data.currentDraftContent = content;
      }
      App.utils?.showNotification?.('히스토리 아이템이 로드되었습니다.');
    }, 500);
  },

  // 팀 아이템 보기 (읽기 전용)
  viewTeamItem(element, itemId) {
    App.utils?.showNotification?.('팀 아이템을 불러오고 있습니다...');
    setTimeout(() => {
      const sampleContent = `# 팀 공유 특허 명세서 (읽기 전용)

## 기술분야
팀원이 작성한 특허 명세서입니다.

## 배경기술
이 문서는 읽기 전용으로 제공됩니다.`;

      if (App.draft) {
        App.draft.display(sampleContent);
        App.data.currentDraftContent = sampleContent;
      }
      App.utils?.showNotification?.('팀 아이템이 로드되었습니다. (읽기 전용)');
    }, 1000);
  },

  refreshTeam() {
    App.utils?.showNotification?.('팀 히스토리를 새로고침하고 있습니다...');
    setTimeout(() => {
      this.renderTeamHistory();
      App.utils?.showNotification?.('팀 히스토리가 새로고침되었습니다.');
    }, 1000);
  },

  addToHistory(techName) {
    const newId = Math.max(...this.data.myHistory.map(h => h.id), 0) + 1;
    const now = new Date();
    const timestamp = now.toLocaleString();

    const newHistoryItem = {
      id: newId,
      title: techName || '새로운 특허 명세서',
      items: [
        { 
          id: newId * 10 + 1, 
          title: `생성된 특허 명세서 초안 - ${timestamp}`, 
          content: App.data.currentDraftContent 
        }
      ],
      expanded: true
    };
    this.data.myHistory.unshift(newHistoryItem);
    this.renderMyHistory();
    App.utils?.showNotification?.('히스토리에 저장되었습니다.');
  }
};

// 페이지 로드 시 히스토리 초기화
document.addEventListener('DOMContentLoaded', () => {
  App.history.init();
});
