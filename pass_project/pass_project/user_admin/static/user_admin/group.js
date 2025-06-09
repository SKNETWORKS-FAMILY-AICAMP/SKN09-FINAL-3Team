function toggleGroup(header) {
  const box = header.closest('.group-box');
  const isExpanded = box.classList.contains('expanded');
  const icon = header.querySelector('.toggle-icon');

  // 모든 그룹 닫기
  document.querySelectorAll('.group-box').forEach(g => {
    g.classList.remove('expanded');
    g.querySelector('.group-user-list').style.display = 'none';
    g.querySelector('.toggle-icon').src = '/static/user_admin/img/down.png';
  });

  // 클릭한 그룹만 열기
  if (!isExpanded) {
    box.classList.add('expanded');
    box.querySelector('.group-user-list').style.display = 'block';
    icon.src = '/static/user_admin/img/up.png';
  }
}
