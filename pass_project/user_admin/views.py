from django.shortcuts import render

def user_management_view(request):
    return render(request, 'user_admin/user.html')

def group_management_view(request):
    return render(request, 'user_admin/group.html')

def group_management_view(request):
    groups = ["R&D", "QA", "AI Research", "group4"]  # 추후 DB에서 받아와도 됨
    return render(request, 'user_admin/group.html', {'groups': groups})
