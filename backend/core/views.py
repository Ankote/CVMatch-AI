import requests
import json
from decouple import config
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
import PyPDF2, sys
from io import BytesIO

@api_view(['POST'])
@authentication_classes([])  # Disable CSRF/session check
@permission_classes([AllowAny])
def openrouter_match(request):
    print('the request arrived', file = sys.stderr)
    if request.method == "POST" and request.FILES.get("pdf"):
        pdf_file = request.FILES["pdf"]
        job_details = request.POST.get("job_details")

        # Extract text from PDF
        pdf_reader = PyPDF2.PdfReader(BytesIO(pdf_file.read()))
        cv_text = "".join(page.extract_text() or "" for page in pdf_reader.pages)

        if not cv_text.strip() or not job_details:
            return Response({"error": "Missing CV content or job details"}, status=400)
    else:
        return Response({"error": "PDF file not provided"}, status=400)

    headers = {
        "Authorization": f"Bearer {config('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "CVMatcher"
    }

    prompt = f"""
I will give you a CV and a job description.

Your task:
- Compare the CV to the job description.
- Return a JSON response with two fields:
  - "score": a number from 0 to 100 indicating how well the CV matches the job.
  - "reason": a short explanation for the score.

Respond in **valid JSON** only. Do not include any extra text or explanation.

CV:
{cv_text}

Job Description:
{job_details}
"""

    payload = {
        "model": "deepseek/deepseek-r1-0528:free",
        "messages": [{"role": "user", "content": prompt}]
    }

    try:
        api_response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            data=json.dumps(payload),
            timeout=15
        )

        if api_response.status_code != 200:
            return Response({
                "error": f"OpenRouter error {api_response.status_code}",
                "details": api_response.text
            }, status=500)

        result_text = api_response.json()["choices"][0]["message"]["content"].strip()

        # Remove markdown JSON code block if present
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]

        try:

            parsed_result = json.loads(result_text.strip())
            print("🔍 Raw result_text:", parsed_result, flush=True)
            return Response({"result": parsed_result})
        except json.JSONDecodeError:
            return Response({"result": 'result_text'}, status=200)

    except requests.exceptions.Timeout:
        return Response({"error": "Request to OpenRouter timed out"}, status=504)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
