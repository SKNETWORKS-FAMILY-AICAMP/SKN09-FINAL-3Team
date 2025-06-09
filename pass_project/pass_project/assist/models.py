from django.db import models
import uuid

class User(models.Model):
    user_code = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=20, unique=True)
    user_pw = models.CharField(max_length=200)
    user_email = models.EmailField(max_length=50, blank=True, null=True)
    user_phone = models.BigIntegerField(blank=True, null=True)
    user_nickname = models.CharField(max_length=10)
    user_privilege = models.IntegerField(default=2)  # 1: 관리자, 2: 일반 사용자
    user_create_date = models.DateTimeField(auto_now_add=True)
    user_left_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.user_nickname


class Template(models.Model):
    template_id = models.AutoField(primary_key=True)
    # 이후 로그인페이지 만들 시 user_code를 반영시에만 들어갈 수 있도록 변경해야함
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


class Draft(models.Model):
    draft_id = models.AutoField(primary_key=True)
    template_id = models.ForeignKey(Template, on_delete=models.CASCADE)
    version = models.CharField(max_length=8, default='v0')
    draft_name = models.CharField(max_length=30)
    create_draft = models.TextField()
    create_time = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    draft_title = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.draft_name


class Image(models.Model):
    image_id = models.AutoField(primary_key=True)
    template_id = models.ForeignKey(Template, on_delete=models.CASCADE)
    image_url = models.CharField(max_length=3000)
    image_name = models.CharField(max_length=3000)
    image_extension = models.CharField(max_length=10)

    def __str__(self):
        return self.image_name


class LoginLog(models.Model):
    log_id = models.AutoField(primary_key=True)
    user_code = models.ForeignKey(User, on_delete=models.CASCADE)
    user_ip = models.CharField(max_length=20, blank=True, null=True)
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f'{self.user_code} - {self.login_time}'
