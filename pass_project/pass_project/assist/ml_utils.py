# # ml_utils.py
# from transformers import AutoModelForCausalLM, AutoTokenizer
# import torch
# import os
# import time

# class GemmaModel:
#     def __init__(self):
#         self.model_name = "codingtree/gemma3_pass"
#         self.tokenizer = None
#         self.model = None
#         self.load_model()
    
#     def load_model(self):
#         """모델과 토크나이저를 로드합니다."""
#         start_time = time.time()
#         try:
#             print(f"CPU에서 '{self.model_name}' 모델 로드 시작...")
            
#             # 1. 토크나이저 로드
#             self.tokenizer = AutoTokenizer.from_pretrained(
#                 self.model_name,
#                 use_fast=False  # SentencePiece 토크나이저는 use_fast=False 필요
#             )
#             print("토크나이저 로드 성공!")
            
#             # 2. CPU 메모리 사용량 최적화 설정
#             # 정량화를 사용하여 메모리 사용량 줄이기
#             try:
#                 from transformers import BitsAndBytesConfig
#                 quantization_config = BitsAndBytesConfig(
#                     load_in_4bit=True,  # 4비트 정량화 (8비트보다 더 메모리 효율적)
#                     bnb_4bit_compute_dtype=torch.float16,
#                     bnb_4bit_quant_type="nf4"
#                 )
                
#                 # 모델 로드 (4비트 정량화 사용)
#                 self.model = AutoModelForCausalLM.from_pretrained(
#                     self.model_name,
#                     quantization_config=quantization_config,
#                     device_map="cpu",  # 명시적으로 CPU 사용
#                     torch_dtype=torch.float16,  # 메모리 사용량 줄이기
#                     low_cpu_mem_usage=True  # CPU 메모리 사용량 최적화
#                 )
#                 print("정량화된 모델 로드 성공!")
#             except ImportError:
#                 # BitsAndBytes를 사용할 수 없는 경우, 일반 모델 로드
#                 print("정량화 라이브러리를 찾을 수 없어 일반 모델을 로드합니다.")
#                 self.model = AutoModelForCausalLM.from_pretrained(
#                     self.model_name,
#                     device_map="cpu",
#                     torch_dtype=torch.float16,
#                     low_cpu_mem_usage=True
#                 )
            
#             load_time = time.time() - start_time
#             print(f"모델 로드 완료! (소요시간: {load_time:.2f}초)")
            
#         except Exception as e:
#             print(f"모델 로드 중 오류 발생: {e}")
    
#     def generate_text(self, input_text, max_length=512):  # 생성 길이 제한
#         """텍스트를 생성합니다. CPU에서는 길이를 제한하세요."""
#         if not self.model or not self.tokenizer:
#             return "모델이 로드되지 않았습니다."
        
#         try:
#             print(f"텍스트 생성 시작: '{input_text[:50]}...'")
#             start_time = time.time()
            
#             # 1. 입력 토큰화
#             inputs = self.tokenizer(input_text, return_tensors="pt")
            
#             # 2. 메모리 절약을 위한 생성 설정
#             with torch.no_grad():  # 그래디언트 계산 비활성화로 메모리 절약
#                 output = self.model.generate(
#                     inputs.input_ids,
#                     max_new_tokens=max_length,  # 새 토큰 수 제한
#                     do_sample=True,
#                     temperature=0.7,
#                     top_p=0.9,
#                     pad_token_id=self.tokenizer.eos_token_id,
#                     num_return_sequences=1,  # 하나의 결과만 생성
#                     # CPU에서의 성능을 위해 batch_size=1 사용
#                 )
            
#             # 3. 생성된 텍스트 디코딩
#             generated_text = self.tokenizer.decode(output[0], skip_special_tokens=True)
            
#             # 4. 입력 텍스트를 제외한 생성된 부분만 반환
#             result = generated_text[len(input_text):].strip()
            
#             gen_time = time.time() - start_time
#             print(f"텍스트 생성 완료 (소요시간: {gen_time:.2f}초)")
            
#             return result
            
#         except Exception as e:
#             print(f"텍스트 생성 중 오류 발생: {e}")
#             return f"텍스트 생성 중 오류 발생: {e}"
    
#     def evaluate_text(self, input_text):
#         """텍스트를 평가합니다."""
#         # 평가는 짧은 결과만 필요하므로 더 적은 토큰 생성
#         try:
#             eval_prompt = f"다음 특허 초안을 평가하세요:\n\n{input_text[:1000]}...\n\n평가 결과:"
#             evaluation_result = self.generate_text(eval_prompt, max_length=256)
#             return f"🧠 AI 평가 결과: {evaluation_result}"
#         except Exception as e:
#             return f"평가 중 오류 발생: {e}"

# # 싱글톤 인스턴스 생성
# patent_generator = GemmaModel()

# # 필요한 패키지 설치 안내 출력
# print("\n모델이 제대로 작동하지 않는 경우 다음 패키지를 설치하세요:")
# print("pip install transformers torch sentencepiece accelerate bitsandbytes")