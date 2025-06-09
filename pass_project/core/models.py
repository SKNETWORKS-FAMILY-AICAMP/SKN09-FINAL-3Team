from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


# ✅ 사용자 모델
class User(AbstractUser):
    user_code = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_nickname = models.CharField(max_length=150, blank=True, null=True)
    is_auto_login = models.IntegerField(blank=True, null=True)
    user_left_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.username


# ✅ 로그인 로그
class LoginLog(models.Model):
    log_id = models.AutoField(primary_key=True)
    user_code = models.ForeignKey(User, on_delete=models.CASCADE)
    user_ip = models.CharField(max_length=50, blank=True, null=False)
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} - {self.login_time}'


# ✅ 팀 모델
class Team(models.Model):
    team_id = models.AutoField(primary_key=True)
    team_name = models.CharField(max_length=50)

    def __str__(self):
        return self.team_name


# ✅ 팀 활동 로그
class TeamLog(models.Model):
    team_log_id = models.AutoField(primary_key=True)
    user_code = models.ForeignKey(User, on_delete=models.CASCADE)
    team_id = models.ForeignKey(Team, on_delete=models.CASCADE)
    action_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.team.team_name} - {self.user.username} - {self.action}'


# ✅ 템플릿
class Template(models.Model):
    template_id = models.AutoField(primary_key=True)
    user_code = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    tech_name = models.CharField(max_length=200)
    tech_description = models.TextField()
    problem_solved = models.TextField()
    tech_differentiation = models.TextField()
    application_field = models.TextField(blank=True, null=True)
    components_functions = models.TextField()
    implementation_example = models.TextField()
    drawing_description = models.TextField(blank=True, null=True)
    application_info = models.CharField(max_length=100)
    inventor_info = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    template_title = models.CharField(max_length=50)

    def __str__(self):
        return self.template_title


# ✅ 드래프트
class Draft(models.Model):
    draft_id = models.AutoField(primary_key=True)
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    version = models.CharField(max_length=8, default='v0')
    draft_name = models.CharField(max_length=30)
    create_draft = models.TextField()
    create_time = models.DateTimeField(auto_now_add=True)
    draft_title = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.draft_name


# ✅ 도면 이미지
class Image(models.Model):
    image_id = models.AutoField(primary_key=True)
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    image_url = models.CharField(max_length=3000)
    image_name = models.CharField(max_length=3000)
    image_extension = models.CharField(max_length=10)

    def __str__(self):
        return self.image_name


# ✅ 초안 평가
class Evaluation(models.Model):
    eval_id = models.AutoField(primary_key=True)
    draft = models.ForeignKey(Draft, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'평가 {self.eval_id} - {self.draft.draft_name}'
