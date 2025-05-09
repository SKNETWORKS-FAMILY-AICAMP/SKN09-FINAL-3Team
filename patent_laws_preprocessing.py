import os
import re
import pandas as pd
from pathlib import Path
from collections import Counter
from pypdf import PdfReader

# ✅ 줄바꿈 정제 함수 (번호 앞 줄바꿈만 유지 + 조건 추가)
def normalize_linebreaks_preserve_numbering(text):
    lines = text.split("\n")
    result = []

    for i, line in enumerate(lines):
        line = line.strip()
        if i == 0:
            result.append(line)
            continue

        prev = result[-1].strip()

        # ✅ 한글 + 줄바꿈 + 다. → 한 문장
        if re.search(r"[가-힣]다$", prev) and line.startswith("다."):
            result[-1] += " " + line
            continue

        # ✅ 숫자. + 줄바꿈 + 숫자. → 한 문장
        if re.match(r"^\d+\.$", prev) and re.match(r"^\d+\.", line):
            result[-1] += " " + line
            continue

        # ✅ 일반 번호 항목은 줄바꿈 유지
        if re.match(r"^(?:\d+\.\s*|[가-하]\.\s*)", line):
            result.append("\n" + line)
        else:
            result.append(" " + line)

    return "".join(result).strip()

# ✅ 푸터 판별 (법제처 + 번호 + 국가법령정보센터 + 제목줄)
def is_footer_block(lines):
    if len(lines) < 2:
        return False
    last = lines[-1].strip()
    second_last = lines[-2].strip()
    if (
        "법제처" in second_last and
        "국가법령정보센터" in second_last and
        any(tok.isdigit() for tok in second_last.split()) and
        len(last) < 40
    ):
        return True
    return False

# ✅ PDF 텍스트 추출 (푸터/헤더 제거)
def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    header_prefixes = []
    texts_by_page = []

    for page in reader.pages:
        text = page.extract_text()
        if not text:
            continue
        lines = text.strip().split("\n")
        texts_by_page.append(lines)
        if lines:
            header_prefix = re.split(r"\s*\(", lines[0])[0].strip()
            header_prefixes.append(header_prefix)

    header_counts = Counter(header_prefixes)
    common_header_prefixes = {k for k, v in header_counts.items() if v > 1}

    cleaned_text = ""
    for lines in texts_by_page:
        if not lines:
            continue
        first_line_prefix = re.split(r"\s*\(", lines[0])[0].strip()
        if first_line_prefix in common_header_prefixes:
            lines = lines[1:]
        if is_footer_block(lines):
            lines = lines[:-2]
        cleaned_text += "\n".join(lines) + "\n"

    return cleaned_text

# ✅ 항 텍스트 내부에 섞인 푸터/헤더 줄 제거
def clean_footer_header_inside_paragraph(text, law_name):
    lines = text.strip().split("\n")
    cleaned = []
    skip_next = False
    for i in range(len(lines)):
        if skip_next:
            skip_next = False
            continue
        line = lines[i].strip()
        if (
            "법제처" in line and
            "국가법령정보센터" in line and
            any(tok.isdigit() for tok in line.split())
        ):
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                if law_name.replace("_", "")[:6] in next_line.replace(" ", ""):
                    skip_next = True
            continue
        cleaned.append(line)
    return "\n".join(cleaned).strip()

# ✅ 텍스트 → DataFrame (장/조/항 구조화)
def parse_pdf_to_final_df(text, law_name):
    chapter_pattern = r"(제\s*\d+\s*장(?:\s+[^\n\d제조]{1,20})?)"
    article_pattern = r"(제\s*\d+\s*조\s*\(.*?\))"
    paragraph_pattern = r"([①-⑳])"

    rows = []
    current_chapter = ""

    chapter_split = re.split(chapter_pattern, text)
    for i in range(len(chapter_split)):
        part = chapter_split[i].strip()
        if re.match(chapter_pattern, part):
            current_chapter = part.strip()
        else:
            article_parts = re.split(article_pattern, part)
            for j in range(1, len(article_parts), 2):
                article_title = article_parts[j].strip()
                article_body = article_parts[j + 1].strip() if (j + 1) < len(article_parts) else ""

                para_parts = re.split(paragraph_pattern, article_body)
                if len(para_parts) > 1:
                    for k in range(1, len(para_parts), 2):
                        para_num = para_parts[k]
                        para_raw = para_parts[k + 1].strip() if (k + 1) < len(para_parts) else ""
                        para_clean = clean_footer_header_inside_paragraph(para_raw, law_name)
                        para_text = normalize_linebreaks_preserve_numbering(para_clean)
                        항목 = f"{current_chapter} {article_title} {para_num}".strip()
                        rows.append({
                            "법률규정": law_name,
                            "항목": 항목,
                            "내용": para_text
                        })
                else:
                    para_clean = clean_footer_header_inside_paragraph(article_body.strip(), law_name)
                    para_text = normalize_linebreaks_preserve_numbering(para_clean)
                    항목 = f"{current_chapter} {article_title}".strip()
                    rows.append({
                        "법률규정": law_name,
                        "항목": 항목,
                        "내용": para_text
                    })

    return pd.DataFrame(rows)

# ✅ 전체 PDF 처리 → TSV 저장
def process_all_laws(input_dir="./laws", output_dir="./laws_tsv"):
    os.makedirs(output_dir, exist_ok=True)
    pdf_files = list(Path(input_dir).glob("*.pdf"))

    for pdf_file in pdf_files:
        print(f"[INFO] 처리 중: {pdf_file.name}")
        try:
            law_name = pdf_file.stem
            text = extract_text_from_pdf(pdf_file)
            df = parse_pdf_to_final_df(text, law_name)

            output_path = Path(output_dir) / (law_name + ".tsv")
            df.to_csv(output_path, sep="\t", index=False)
            print(f"  → 저장 완료: {output_path.name} (항목 수: {len(df)})")
        except Exception as e:
            print(f"[ERROR] {pdf_file.name} 처리 중 오류 발생: {e}")

def merge_all_tsv(input_dir="./laws_tsv", output_path="./patent_laws_merged.tsv"):
    all_dfs = []
    tsv_files = list(Path(input_dir).glob("*.tsv"))

    for file in tsv_files:
        try:
            df = pd.read_csv(file, sep="\t", dtype=str)
            all_dfs.append(df)
            print(f"[INFO] 병합 대상: {file.name} (행 수: {len(df)})")
        except Exception as e:
            print(f"[ERROR] {file.name} 불러오기 실패: {e}")

    if not all_dfs:
        print("[WARN] 병합할 TSV가 없습니다!")
        return

    merged_df = pd.concat(all_dfs, ignore_index=True)
    merged_df.to_csv(output_path, sep="\t", index=False)
    print(f"\n✅ 병합 완료! 저장 경로: {output_path} (총 {len(merged_df)}개 항목)")


# ✅ TSV → JSONL 변환 (input: [법률명] 항목 / output: 내용)
def convert_tsv_to_jsonl(tsv_path="./patent_laws_merged.tsv", jsonl_path="./patent_laws_merged.jsonl"):
    if not Path(tsv_path).exists():
        print(f"[ERROR] TSV 파일이 존재하지 않습니다: {tsv_path}")
        return

    df = pd.read_csv(tsv_path, sep="\t", dtype=str)
    with open(jsonl_path, "w", encoding="utf-8") as f:
        for _, row in df.iterrows():
            law = row["법률규정"].strip()
            section = row["항목"].strip()
            content = row["내용"].strip()
            input_text = f"[{law}] {section}"
            f.write(f'{{"input": "{input_text}", "output": "{content}"}}\n')

    print(f"\n✅ JSONL 변환 완료! 저장 경로: {jsonl_path}")

if __name__ == "__main__":
    process_all_laws()
    merge_all_tsv()
    convert_tsv_to_jsonl()
