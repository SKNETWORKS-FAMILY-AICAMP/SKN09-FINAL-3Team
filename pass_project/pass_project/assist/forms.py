from django import forms
from .models import Template

class TemplateForm(forms.ModelForm):
    class Meta:
        model = Template
        fields = [
            'tech_name',
            'tech_description',
            'problem_solved',
            'tech_differentiation',
            'application_field',
            'components_functions',
            'implementation_example',
            'drawing_description',
            'application_info',
            'inventor_info'
        ]
        widgets = {
            'tech_description': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
            'problem_solved': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
            'tech_differentiation': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
            'application_field': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
            'components_functions': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
            'implementation_example': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
            'drawing_description': forms.Textarea(attrs={'rows': 4, 'cols': 40}),
            'application_info': forms.TextInput(attrs={'size': 40}),
            'inventor_info': forms.TextInput(attrs={'size': 40}),
        }
        labels = {
            'tech_name': '기술명',
            'tech_description': '기술 설명',
            'problem_solved': '해결하고자 하는 문제',
            'tech_differentiation': '기술 차별성',
            'application_field': '활용 분야',
            'components_functions': '구성 요소 및 기능',
            'implementation_example': '구현 방식 예',
            'drawing_description': '도면 설명',
            'application_info': '출원인 정보',
            'inventor_info': '발명자 정보'
        }