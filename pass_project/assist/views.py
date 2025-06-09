from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.http import HttpResponse, JsonResponse
from .forms import TemplateForm
from .models import Template, Draft
from django.template.loader import get_template
from xhtml2pdf import pisa
from docx import Document
import json

# Mock AI 함수 (FastAPI로 교체 예정)
def mock_ai_edit(draft_text, prompt):
    return f"[Edited by AI based on: '{prompt}']\n\n{draft_text}"

def mock_ai_evaluate(draft_text):
    return "🧠 AI 평가 결과: 이 초안은 기술적 진보성이 우수합니다."

# def mock_ai_generate_draft(template_data):
#     """템플릿 데이터를 기반으로 마크다운 초안 생성"""
#     tech_name = template_data.get('tech_name', '혁신적인 기술 시스템')
    
#     draft_content = f"""# 발명의 명칭
# {tech_name}

# ## 기술분야
# {template_data.get('tech_description', '')}

# ## 배경기술
# {template_data.get('problem_solved', '')}

# 기존 기술들은 다양한 한계점을 가지고 있었습니다. 특히 효율성, 정확성, 경제성 측면에서 개선이 필요한 상황이었으며, 이러한 문제점들을 해결하기 위한 혁신적인 접근 방법이 요구되었습니다.

# ## 해결하려는 과제
# {template_data.get('problem_solved', '')}

# 본 발명은 **{tech_name}**을 통해 기존 기술의 한계를 극복하고, 더 나은 솔루션을 제공하는 것을 주요 목표로 합니다.

# ## 과제의 해결 수단
# {template_data.get('tech_differentiation', '')}

# 본 발명은 다음과 같은 혁신적인 방법론을 통해 기존 문제를 해결합니다:
# - 체계적이고 효율적인 접근 방식
# - 사용자 중심의 설계 철학
# - 확장 가능한 아키텍처 구현

# {f"## 활용 분야\n{template_data.get('application_field', '')}\n" if template_data.get('application_field') else ''}

# ## 발명의 효과
# 본 발명을 통해 다음과 같은 효과를 얻을 수 있습니다:

# - **성능 향상**: 기존 기술 대비 현저히 향상된 성능 및 효율성
# - **경제성 개선**: 비용 효율적인 솔루션 제공
# - **사용자 편의성**: 직관적이고 사용하기 쉬운 인터페이스
# - **확장성**: 다양한 분야에서의 실용적 활용 가능성
# - **안정성**: 기술적 안정성 및 신뢰성 확보

# ## 발명을 실시하기 위한 구체적인 내용

# ### 주요 구성 요소
# {template_data.get('components_functions', '')}

# ### 구현 방식
# {template_data.get('implementation_example', '')}

# 본 발명의 주요 구성 요소들이 유기적으로 연동하여 혁신적인 솔루션을 제공합니다.

# {f"### 도면의 간단한 설명\n{template_data.get('drawing_description', '')}\n" if template_data.get('drawing_description') else ''}

# ## 특허청구범위

# **청구항 1**: {tech_name}에 있어서,
# 상기 기술의 핵심 구성을 포함하여 혁신적인 기능을 제공하는 것을 특징으로 하는 시스템.

# **청구항 2**: 제1항에 있어서,
# {template_data.get('components_functions', '').split('.')[0] if template_data.get('components_functions') else '효율적인 데이터 처리 및 분석 기능'}을 추가로 포함하는 것을 특징으로 하는 시스템.

# **청구항 3**: 제1항 또는 제2항에 있어서,
# 사용자 친화적인 인터페이스를 통해 직관적인 조작이 가능한 것을 특징으로 하는 시스템.

# **청구항 4**: 제1항 내지 제3항 중 어느 한 항에 있어서,
# {template_data.get('tech_differentiation', '').split('.')[0] if template_data.get('tech_differentiation') else '보안 기능을 강화하여 안전한 시스템 운영을 보장'}하는 것을 특징으로 하는 시스템.

# ---

# ### 출원인 및 발명자 정보
# - **출원인**: {template_data.get('application_info', '')}
# - **발명자**: {template_data.get('inventor_info', '')}

# ---
# *※ 본 특허청구범위는 특허법 제42조 제2~5항 및 시행규칙 제21조에 따라 작성되었습니다.*
# *※ 모든 기술적 내용은 모범명세서 가이드에 따라 체계적으로 기술되어 있습니다.*"""

#     return draft_content

def editor_view(request):
    if request.method == 'POST':
        # 템플릿 → 초안 생성 (AJAX 요청 처리)
        if request.headers.get('Content-Type') == 'application/json':
            try:
                data = json.loads(request.body)
                
                # Template 저장
                template = Template(
                    user_code=request.user if request.user.is_authenticated else None,
                    tech_name=data.get('tech_name', ''),
                    tech_description=data.get('tech_description', ''),
                    problem_solved=data.get('problem_solved', ''),
                    tech_differentiation=data.get('tech_differentiation', ''),
                    application_field=data.get('application_field', ''),
                    components_functions=data.get('components_functions', ''),
                    implementation_example=data.get('implementation_example', ''),
                    drawing_description=data.get('drawing_description', ''),
                    application_info=data.get('applicant_name', '') + ', ' + 
                                   data.get('applicant_nationality', '') + ', ' + 
                                   data.get('applicant_address', ''),
                    inventor_info=data.get('inventor_name', '') + ', ' + 
                                data.get('inventor_nationality', '') + ', ' + 
                                data.get('inventor_address', ''),
                    template_title=data.get('tech_name', '')[:50],
                    date=timezone.now()
                )
                template.save()

                # AI로 초안 생성
                draft_content = mock_ai_generate_draft(data)
                
                # Draft 저장
                draft = Draft.objects.create(
                    template_id=template,
                    draft_name=f"{template.tech_name}_draft",
                    create_draft=draft_content,
                    create_time=timezone.now()
                )
                
                return JsonResponse({
                    'success': True,
                    'draft_content': draft_content,
                    'draft_id': draft.draft_id,
                    'message': '특허 초안이 성공적으로 생성되었습니다.'
                })
                
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'error': str(e),
                    'message': '초안 생성 중 오류가 발생했습니다.'
                })
        
        # 기존 폼 처리 (하위 호환성)
        elif 'submit_template' in request.POST:
            form = TemplateForm(request.POST)
            if form.is_valid():
                template = form.save(commit=False)
                if request.user.is_authenticated:
                    template.user_code = request.user
                template.date = timezone.now()
                template.save()

                # 기존 로직으로 초안 생성
                template_data = {
                    'tech_name': template.tech_name,
                    'tech_description': template.tech_description,
                    'problem_solved': template.problem_solved,
                    'tech_differentiation': template.tech_differentiation,
                    'application_field': template.application_field,
                    'components_functions': template.components_functions,
                    'implementation_example': template.implementation_example,
                    'drawing_description': template.drawing_description,
                    'application_info': template.application_info,
                    'inventor_info': template.inventor_info,
                }
                
                draft_content = mock_ai_generate_draft(template_data)
                
                draft = Draft.objects.create(
                    template_id=template,
                    draft_name=f"{template.tech_name}_draft",
                    create_draft=draft_content,
                    create_time=timezone.now()
                )
                return redirect('assist:editor')

        # 직접 수정 저장
        elif 'save_draft' in request.POST:
            draft_id = request.POST.get('draft_id')
            new_text = request.POST.get('draft_text')
            draft = Draft.objects.get(draft_id=draft_id)
            draft.create_draft = new_text
            draft.save()

        # AI 수정
        elif 'ai_edit' in request.POST:
            draft_id = request.POST.get('draft_id')
            prompt = request.POST.get('prompt')
            draft = Draft.objects.get(draft_id=draft_id)
            draft.create_draft = mock_ai_edit(draft.create_draft, prompt)
            draft.save()

        # AI 평가
        elif 'ai_evaluate' in request.POST:
            draft_id = request.POST.get('draft_id')
            draft = Draft.objects.get(draft_id=draft_id)
            request.session['ai_feedback'] = mock_ai_evaluate(draft.create_draft)
            request.session['active_draft'] = draft.draft_id

        return redirect('assist:editor')

    # GET 요청 처리
    template = Template.objects.last()
    draft = Draft.objects.last()
    feedback = request.session.pop('ai_feedback', None) if draft else None
    
    return render(request, 'assist/editor.html', {
        'form': TemplateForm(),
        'template': template,
        'draft': draft,
        'feedback': feedback
    })

def qa_view(request):
    """AI Q&A 페이지"""
    if request.method == 'POST' and request.headers.get('Content-Type') == 'application/json':
        try:
            data = json.loads(request.body)
            question = data.get('question', '')
            
            # Mock AI 답변 생성 (실제로는 AI 모델 호출)
            answer = mock_qa_answer(question)
            
            return JsonResponse({
                'success': True,
                'answer': answer,
                'message': '답변이 생성되었습니다.'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e),
                'message': '답변 생성 중 오류가 발생했습니다.'
            })
    
    return render(request, 'assist/qa.html')

def mock_qa_answer(question):
    """Q&A 답변 생성 (Mock)"""
    qa_responses = {
        "특허 출원 절차와 필요 서류는 무엇인가요?": """
        <h3>특허 출원 절차</h3>
        <p>특허 출원은 다음과 같은 단계로 진행됩니다:</p>
        <ol>
          <li><strong>발명의 완성</strong> - 실제로 구현 가능한 발명이어야 함</li>
          <li><strong>선행기술조사</strong> - 출원하려는 발명이 이미 공개되었는지 확인</li>
          <li><strong>특허명세서 작성</strong> - 발명의 내용을 상세히 기술</li>
          <li><strong>출원서류 제출</strong> - 특허청에 필요 서류와 함께 출원</li>
          <li><strong>심사청구</strong> - 출원일로부터 3년 이내에 심사 요청</li>
          <li><strong>특허심사</strong> - 특허청 심사관의 신규성, 진보성 등 검토</li>
          <li><strong>특허등록</strong> - 심사 통과 시 특허권 부여</li>
        </ol>
        """,
        
        "선출원주의는 어떤 적용원리는 무엇인가요?": """
        <h3>선출원주의 개념과 적용원리</h3>
        <p><strong>선출원주의</strong>는 동일한 발명에 대해 여러 출원이 있을 경우, 가장 먼저 출원한 자에게 특허권을 부여하는 제도입니다.</p>
        
        <h4>적용 원리</h4>
        <ul>
          <li><strong>출원일 우선</strong> - 동일한 발명에 대해 출원일이 빠른 것이 우선권을 가집니다</li>
          <li><strong>공개원칙</strong> - 출원일을 기준으로 기술 공개를 촉진합니다</li>
          <li><strong>신속성 장려</strong> - 발명 후 빠른 출원을 유도합니다</li>
        </ul>
        """,
    }
    
    return qa_responses.get(question, f"""
    <h3>답변</h3>
    <p>귀하의 질문 "{question}"에 대해 답변드리겠습니다.</p>
    <p>더 구체적인 질문을 해주시면 더 정확한 답변을 제공할 수 있습니다.</p>
    """)

# PDF 및 DOCX, HWP 다운로드 (기존 유지)
def download_pdf(request, draft_id):
    draft = get_object_or_404(Draft, draft_id=draft_id)
    template = get_template('assist/draft_pdf_template.html')  # 경로 수정
    html = template.render({'draft': draft})
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{draft.draft_name}.pdf"'
    pisa.CreatePDF(html, dest=response)
    return response

def download_docx(request, draft_id):
    draft = get_object_or_404(Draft, draft_id=draft_id)
    document = Document()
    document.add_heading(draft.draft_name, level=1)
    document.add_paragraph(draft.create_draft)

    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    response['Content-Disposition'] = f'attachment; filename="{draft.draft_name}.docx"'
    document.save(response)
    return response

def download_hwp(request, draft_id):
    """HWP 다운로드 (현재는 텍스트 파일로 대체)"""
    draft = get_object_or_404(Draft, draft_id=draft_id)
    
    # HWP 라이브러리가 없으므로 텍스트 파일로 대체
    content = f"{draft.draft_name}\n\n{draft.create_draft}"
    
    response = HttpResponse(content, content_type='text/plain; charset=utf-8')
    response['Content-Disposition'] = f'attachment; filename="{draft.draft_name}.txt"'
    return response