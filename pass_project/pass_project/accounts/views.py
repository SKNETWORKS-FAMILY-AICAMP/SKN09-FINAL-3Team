
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.utils import timezone
from .utils import anonymous_required
from core.models import User, LoginLog
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

@login_required
def mypage_view(request):
    return render(request, 'accounts/mypage.html', {'user': request.user})

@login_required
def check_nickname(request):
    nickname = request.GET.get('nickname')
    is_taken = User.objects.filter(nickname=nickname).exists()
    return JsonResponse({'available': not is_taken})

@login_required
def update_nickname(request):
    if request.method == 'POST':
        new_nickname = request.POST.get('nickname')
        if not User.objects.filter(nickname=new_nickname).exists():
            request.user.nickname = new_nickname
            request.user.save()
            return JsonResponse({'success': True})
    return JsonResponse({'success': False})

import json



@ anonymous_required
def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('mypage')
        else:
            return render(request, 'login.html', {"error": "Invalid credentials"})
    return render(request, 'accounts/login.html')

# ajax: 로그인
def ajax_login(request):
    if request.method == 'POST':
        response_obj = {}
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            password = data.get('password')
            auto_login = data.get('auto_login')
            print("nickname:", user_id, "| password:", password, "| auto_login:", auto_login)

            user_obj = User.objects.filter(username=user_id)
            for user in user_obj:
                response_obj['user_id'] = user.username
                response_obj['password'] = user.password
                response_obj['is_auto_login'] = user.is_auto_login
            print("response::", response_obj)
            
            if response_obj == {}:
                return JsonResponse({'success':False, 'error': '아이디가 잘못되었습니다.'})
            
            if auto_login != response_obj['is_auto_login']:
                print("자동 로그인 정보를 업데이트 합니다...")
                for user in user_obj:
                    user.is_auto_login = auto_login
                    user.save(update_fields=['is_auto_login'])


            if user_id == response_obj["user_id"] and password == response_obj["password"]:
                return JsonResponse({"success": True, 'redirect_url': "/"})
            else:   
                if password != response_obj['password']:
                    return JsonResponse({"success": False, 'error': '비밀번호가 잘못되었습니다.'})

        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': '잘못된 JSON 형식입니다.'})
        
    return JsonResponse({'success': False, 'error': '잘못된 요청입니다.'})
    

# 로그인 로그 삽입
@csrf_exempt
def ajax_insert_login_log(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')

            user = User.objects.filter(username=user_id)
            user_code = ""
            for use in user:
                user_code = use.user_code
            if not user:
                return JsonResponse({'success':False, 'error': '유저를 찾을 수 없습니다.'})
            
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            user_ip = x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get("REMOTE_ADDR")

            print("user_code::", user_code)
            print("user_ip::", user_ip)

            LoginLog.objects.create(
                user_code_id = user_code,
                user_ip = user_ip,
                login_time=timezone.now()
            )

            return JsonResponse({"success": True})
        
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    else:
        return JsonResponse({"success": False, 'error': 'POST 요청이 필요합니다.'})

# ip가져오기기
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def get_prev_login_user(request):
    client_ip = get_client_ip(request)

    try:
        last_log = LoginLog.objects.select_related('user_code').filter(user_ip=client_ip).latest('login_time')
        user = last_log.user_code

        response_data = {
            'user_id': user.username,
            'is_auto_login': user.is_auto_login,
        }

        return JsonResponse({'success': True, 'data': response_data})
    
    except LoginLog.DoesNotExist:
        return JsonResponse({'success': False, 'error': '해당 IP로 로그인한 기록이 없습니다.'})

def mypage_view(request):
    return render(request, 'accounts/mypage.html')

def repassword_view(request):
    return render(request, 'accounts/repassword.html')

def update_view(request):
    return render(request, 'accounts/update.html')