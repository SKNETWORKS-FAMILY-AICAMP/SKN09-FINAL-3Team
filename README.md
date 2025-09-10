# SK Networks AI CAMP 9기 - FINAL 3Team: PASS

- **주제:** AI 활용 애플리케이션 개발  
- **개발 기간:** 2025.04.23 ~ 2025.06.20  

---

## 📌 목차

### 1️. 팀 소개  
### 2️. 프로젝트 개요 
### 3. 프로젝트 기획
### 4. 기술 스택  
### 5. 시스템 아키텍처  
### 6. WBS
### 7. DATA
### 8. RAG 
### 10. FINE TUNING 
### 11. SERVER  
### 12. 프로젝트 개선 노력  
### 13. 수행 결과 및 데모 시연  
### 14. 향후 계획  
### 15. 한 줄 회고  

---

## 01. 팀 소개

### ✅ 팀명: PASS

### ✅ 팀원 소개

|[@박유진](https://github.com/YUJINDL01)  |[@윤환](https://github.com/MNYH) |[@이세진](https://github.com/tpwls9494) | [@전성원](https://github.com/Hack012) |[@조민훈](https://github.com/alche22)|
|-----------------------------------------|----------------------------------------|------------------------------------------|------------------------------------------|----------------------------------------|
|<img src="https://github.com/user-attachments/assets/c8ce1260-d6ca-4659-89c3-5d9f06847812" width="150" height="150" /> | <img src="https://github.com/user-attachments/assets/c8ce1260-d6ca-4659-89c3-5d9f06847812" width="150" height="150" /> | <img src="https://github.com/user-attachments/assets/c8ce1260-d6ca-4659-89c3-5d9f06847812" width="150" height="150"> | <img src="https://github.com/user-attachments/assets/c8ce1260-d6ca-4659-89c3-5d9f06847812" width="150" height="150" /> |<img src="https://github.com/user-attachments/assets/c8ce1260-d6ca-4659-89c3-5d9f06847812" width="150" height="150"> |

---

## 02. 프로젝트 개요

### ✅ 프로젝트 명: PASS(Patent AI Support Service)  
### ✅ 프로젝트 정의: 인공지능 도메인 특화 특허 지원 AI 서비스

**PASS** 는 **사내 임직원**이 **자신들의 기술 아이디어**를 기반으로 특허 명세서 초안을 손쉽게 작성·수정·평가·추천을 받을 수 있도록 돕는 **AI 도메인 특화 특허 지원 서비스**입니다.  

### ✅ 주제 선정 배경

![thumb-5270caaafa14cb226a124f0b547a9383_1743653685_7314_600x286](https://github.com/user-attachments/assets/cdab7320-a414-418a-b239-2a551085fa79)

<br>

[출처: https://ifs.or.kr/bbs/board.php?bo_table=research&wr_id=11034]


![185279441_4623737574308186_1514906092467285508_n](https://github.com/user-attachments/assets/e1a269bb-4e1f-4a12-a60f-ce4e016cc9dc)

<br>

[출처: https://hai.stanford.edu/ai-index/2025-ai-index-report]


![스크린샷 2025-06-23 102936](https://github.com/user-attachments/assets/95a1f387-4ff9-4161-b000-5a4d976349dc)

<br>

[출처: https://www.etoday.co.kr/news/view/2364975]

<br>

**국내 AI 시장은 급격히 성장**하고 있으며, 2030년에는 147억 달러 규모로 확대될 것으로 전망됩니다.  
대한민국은 **인구 대비 AI 특허 수 1위**를 기록할 만큼 AI 기술 개발과 특허 출원에 높은 관심을 보이고 있습니다.  
하지만 이를 뒷받침할 **전문 변리사와 같은 인프라가 부족해**, AI 기술을 특허로 발전시키기 위한 지원 체계가 미흡한 상황입니다.  
PASS는 이러한 한계를 극복하고, **사내 임직원이 자신의 기술 아이디어를 손쉽게 특허 명세서로 발전**시킬 수 있도록 돕기 위해 기획되었습니다.

<br>

➡️ 상황분석 : 빠르게 발전하는 AI기술을 누구보다 전문적으로 이해하고 **특허로 까지 발전시킬 수 있는 인력이 크게 부족한 상황** 

<br>

### ✅ 사용자 요구사항 분석

특허는 비전문 인력에게 시간적, 비용적, 절차적 측면에서 큰 어려움으로 다가가고 있었습니다  
이를 분석한 결과 주요 문제는 다음과 같았습니다.

<br>

1️⃣ 특허 전문가(변리사)를 선임하는 데 드는 시간과 비용의 부담  
2️⃣ 청구항, 기재불비 등 익숙하지 않은 특허 용어  
3️⃣ 최소 6개월에서 최대 수 년이 소요되는 복잡한 출원 절차  

<br>

이에 따라 저희는 사용자의 핵심 요구를 다음과 같이 정의했습니다.
- **특허에 대해 전문적인 서비스를 제공받고 싶어요!**
- **특허 출원까지 소요되는 시간과 비용을 줄이고 싶어요!**
- **사내에서 팀 단위 협업과 이력 관리가 가능한 서비스가 필요해요!**

<br>

PASS는 이러한 요구를 해결하기 위해,  
**사내 임직원이 쉽게 사용할 수 있는 AI 기반 특허 지원 서비스** 

<br>

### ✅ 서비스 차별점

| 항목                 | **PASS**         | 국내 A사                   | 해외 B사                   |
|----------------------|-----------------|----------------------------|----------------------------|
| **서비스 제공 대상**  | **사내 임직원**  | 변리사 등 특허 전문가       | 변리사 등 특허 전문가       |
| **특허 명세서 전체 제공** | O               | X                          | X                          |
| **응답 시간**         | **2분**          | 30분                        | 10분                        |
| **협업 기능**         | O               | X                          | X                          |
| **추가 비용**         | X               | O                          | O                          |

<br>

PASS는 기존 특허 관련 서비스들과 다음과 같은 뚜렷한 차별점을 가집니다.

<br>

- **1. 서비스 제공 대상**  
  타 서비스는 변리사 등 **특허 전문 인력을 대상**으로 설계되어,  
  사용자 입력 단계에서부터 청구항 작성 등의 **고난이도 입력을 요구**합니다.  
  반면 PASS는 사내 임직원이 **기술 아이디어만 입력**하면 쉽게 이용할 수 있도록 설계되었습니다.

<br>

- **2. 제공 범위**  
  기존 서비스는 **이미 작성된 특허 명세서의 일부 항목만을 지원**하는 경우가 많지만,  
  PASS는 **특허 명세서 전체 초안 생성부터 수정, 평가, 추천**까지 지원합니다.

<br>

- **3. 협업 기능**  
  기존 서비스는 **협업 기능을 제공하지 않지만**,  
  PASS는 **팀 단위 협업과 이력 관리 기능**을 내장하여 실무 활용도를 높였습니다.

<br>

- **4. 응답 시간**  
  기존 서비스는 **평균 응답 시간이 10분~30분 이상 소요**되는 반면,  
  PASS는 **평균 2분 이내의 빠른 응답**을 제공합니다.

<br>

- **5. 비용**  
  타 서비스는 인당 월 20만원 이상 비용이 발생하는 **유료 서비스**가 많지만,  
  PASS는 **추가 비용 부담 없이 사내에서 바로 활용**할 수 있습니다.
  
<br>

### ✅ 기대 효과

- **비용 절감**  
  PASS를 통해 특허 1건당 평균 변리사 선임 비용 약 500만원을 절감

- **시간 단축**  
  일반적으로 특허 명세서 **초안 작성**에 소요되는 약 672시간 단축

- **진입장벽 완화**  
  직관적인 템플릿 입력 구조를 통해 특허 작성의 **용어적, 절차적 장벽**을 낮춥니다.

<br>

➡️ **미래 경쟁력 확보**  
PASS를 사용함으로써 지식 재산권 선점을 통한 기업의 미래 경쟁력 강화가 가능합니다.

<br>

---

## 03. 프로젝트 기획 

### ✅ 요구사항 정의서 
![image](https://github.com/user-attachments/assets/93da56b3-b2fb-4855-810b-d6d4d3026f14)

<br>

### ✅ 화면 기획서

<br>

---

## 04. 기술 스택


| 카테고리 | 기술 스택 |
|----------|-------------------------------------------|
| **사용 언어** | ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white) |
| **프레임워크** | ![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=Django&logoColor=white) |
| **LLM / 연동** | ![Qwen3](https://img.shields.io/badge/Qwen3-FFB000?style=for-the-badge&logo=OpenAI&logoColor=white) ![LangChain](https://img.shields.io/badge/LangChain-005F73?style=for-the-badge&logo=Chainlink&logoColor=white) |
| **벡터 데이터베이스** | ![FAISS](https://img.shields.io/badge/FAISS-009688?style=for-the-badge&logo=Apache&logoColor=white) |
| **임베딩 모델** | ![BGE-M3](https://img.shields.io/badge/BGE--M3-8C9E90?style=for-the-badge&logo=HuggingFace&logoColor=white) |
| **모델 튜닝 / 학습 프레임워크** | ![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=PyTorch&logoColor=white) ![Transformers](https://img.shields.io/badge/Transformers-FFCC00?style=for-the-badge&logo=HuggingFace&logoColor=black) ![LoRA](https://img.shields.io/badge/LoRA-F76D57?style=for-the-badge&logo=HuggingFace&logoColor=white) |
| **UI / 프론트엔드** | <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> |
| **실행 환경** | ![RunPod](https://img.shields.io/badge/RunPod-FF4500?style=for-the-badge&logo=Render&logoColor=white) ![AWS EC2](https://img.shields.io/badge/AWS%20EC2-FF9900?style=for-the-badge&logo=Amazon%20AWS&logoColor=white) |
| **배포 및 컨테이너** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white) ![Docker Compose](https://img.shields.io/badge/Docker--Compose-1488C6?style=for-the-badge&logo=Docker&logoColor=white) |
| **DB 및 기타** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white) ![python-decouple](https://img.shields.io/badge/python--decouple-3776AB?style=for-the-badge&logo=Python&logoColor=white) |
| **형상 관리 / 협업** | ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white) ![Google Drive](https://img.shields.io/badge/Google%20Drive-4285F4?style=for-the-badge&logo=Google%20Drive&logoColor=white) |
| **테스트** | ![Pytest](https://img.shields.io/badge/pytest-%23ffffff.svg?style=for-the-badge&logo=pytest&logoColor=2f9fe3) |


<br>

---

## 05. 시스템 아키덱쳐

<br>

![image](https://github.com/user-attachments/assets/725f65b9-00cb-4b9c-bcfc-e089df219d49)

<br>

PASS는 사용자 질의부터 특허 명세서 초안 생성, 수정, 평가, 추천에 이르는 전체 프로세스를 다음과 같은 구조로 제공합니다.

### **Server**

- **Amazon EC2** 인스턴스에서 서비스가 구동되며, Docker와 Docker Compose를 통해 환경을 컨테이너화합니다.
- **Nginx**는 리버스 프록시 및 로드 밸런서 역할을 하여 클라이언트 요청을 처리합니다.
- **Gunicorn**은 Django 애플리케이션을 WSGI 서버로 구동시켜, 효율적인 서버 관리와 스케일링을 지원합니다.
- **Django**는 사용자 인증, 요청 관리, 응답 출력 및 관리 인터페이스를 제공하는 핵심 백엔드 프레임워크입니다.

### **API**

- **FastAPI**는 Server와 Model 간 API 요청/응답을 처리하며, 빠르고 비동기적인 API 서버를 구성합니다.
- **RunPod** 환경에서 API 서버 및 모델 연동을 호스팅하여 GPU 자원을 효율적으로 활용합니다.

### **Model**

- **Qwen3** 모델이 중심 LLM으로, 사용자 입력과 RAG 검색 결과를 기반으로 특허 명세서 초안 생성, 수정, 평가, 추천을 수행합니다.
- **FAISS 기반 벡터 데이터베이스**(RAG)는 BGE-M3 임베딩 모델을 활용해 구축되었으며, 대규모 특허/법률 데이터에 대한 고속·고정밀 검색을 지원합니다.
- **Hugging Face Hub**에서 모델과 벡터 DB 파일을 불러와 초기화 및 로드됩니다.

### **Database**

- **AWS RDS (MySQL)** 를 사용하여 사용자 입력, 질의/응답 내역, 히스토리, 설정 정보를 안전하게 저장·관리합니다.

### **흐름**

사용자가 질문을 입력 → Django 서버가 요청을 수신 → Nginx와 Gunicorn을 통해 FastAPI로 전달 → FastAPI가 RunPod 상의 Qwen3 모델로 API 요청 → Qwen3은 RAG 검색과 결합된 응답을 생성 → 응답이 서버를 통해 사용자에게 전달 → 요청/응답 데이터는 MySQL DB에 저장

<br>

---

## 06. WBS 

![스크린샷 2025-06-23 111518](https://github.com/user-attachments/assets/0be70a9e-0732-47e2-8798-b73140d59a33)

<br>

[wbs 원본] (https://docs.google.com/spreadsheets/d/1EYrBlNBK-5qRG5Ga8phmV_6vRXk_tkHADsQ1S-oVP-U/edit?gid=637664726#gid=637664726)

<br>

---

## 11. 한 줄 회고

- ❤️ **박유진**
  - 파인튜닝 데이터를 직접 설계하고 SFT 방식으로 Qwen3 모델을 학습시키며, 단순한 생성형 AI 응답을 넘어 실제 기술 설명을 특허 명세서 형식으로 변환하는 과정에서 특허 도메인과 AI 도메인 지식을 융합 학습시키는 어려움과 추가 학습의 필요성을 깊이 체감할 수 있었습니다.
  - 
- 💛 **윤환**  
  - 기획부터 배포까지 전 과정을 경험하며,  **서비스가 왜 필요한지, 누구에게 어떤 가치를 줄 수 있는지를 이해하는 것이 가장 핵심**적임을 깨달았습니다. 이를 위해 **사용자 입장에서 문제를 정의하고 해결책**을 고민해보며, 결과적으로 기획·설계·개발·배포가 어떻게 **유기적으로 맞물리는지 실감**할 수 있었습니다.

- 💚 **이세진**  
  - Docker를 이용해 FastAPI 모델 서버를 컨테이너화하면서, 환경 일관성 확보의 중요성과 Docker의 유용성을 알게 되었습니다. 이 경험을 통해 Django와 FastAPI 서버를 분리해도 안정적으로 배포 및 실행이 가능함을 직접 확인할 수 있었습니다.

- 💙 **전성원**  
  - 실제 이혼 상담 흐름을 구현하기 위해 프론트와 백엔드를 유기적으로 연결하며 실무형 챗봇을 완성해가는 과정이 인상 깊었습니다. 사용자 중심의 UX 설계와 법률 도메인 특화 AI 개발이 함께 성장한 값진 경험이었습니다.
 
- 💜 **전성원**  
  - 실제 이혼 상담 흐름을 구현하기 위해 프론트와 백엔드를 유기적으로 연결하며 실무형 챗봇을 완성해가는 과정이 인상 깊었습니다. 사용자 중심의 UX 설계와 법률 도메인 특화 AI 개발이 함께 성장한 값진 경험이었습니다.

---
