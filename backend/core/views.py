import requests
import json
from decouple import config
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
import PyPDF2
from io import BytesIO
import sys
import openai
from django.http import JsonResponse

from dotenv import load_dotenv

# GET RESPONSES USING DEEPSEE
@api_view(['POST'])
@authentication_classes([])  # Disable CSRF/session check
@permission_classes([AllowAny])
def openrouter_match(request):
    
    if request.method == "POST" and request.FILES.get("pdf"):
        pdf_file = request.FILES["pdf"]
        job_details = request.POST.get("job_details")
        
        # Use BytesIO to work with file-like object
        pdf_reader = PyPDF2.PdfReader(BytesIO(pdf_file.read()))

        cv_text = ""
        for page in pdf_reader.pages:
            cv_text += page.extract_text() or ""  # some pages might return None
    if not cv_text  or not job_details:
        return Response({"error": "Missing 'cv' or 'job details'"}, status=400)


    headers = {
        "Authorization": f"Bearer {config('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8000",  # Optional
        "X-Title": "CVMatcher"
    }

    payload = {
        "model": "deepseek/deepseek-r1-0528:free",
        "messages": [
            {
                "role": "user",
                "content": f"""
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
            }
        ]
    }


    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            data=json.dumps(payload),
            timeout=15  # prevent hanging forever
        )

        if response.status_code != 200:
            return Response({
                "error": f"OpenRouter error {response.status_code}",
                "details": response.text
            }, status=500)

        data = response.json()

        # # Step 1: Extract the inner JSON string
        # result_json_string = response["result"]

        # # Step 2: Convert it to a dictionary
        # result_dict = json.loads(result_json_string)

        # # Now you can access it like normal
        # print(result_dict["score"], file=sys.stderr)   # → 95
        # print(result_dict["reason"], file=sys.stderr)  # → The CV demonstrates...
        return Response({
            "result": data["choices"][0]["message"]["content"]
        })

    except requests.exceptions.Timeout:
        return Response({"error": "Request to OpenRouter timed out"}, status=504)

    except Exception as e:
        return Response({"error": str(e)}, status=500)



# GET RESPONSE USING OPENAI

# from django.views.decorators.csrf import csrf_exempt

# @csrf_exempt
# def ask_openai(request):
#     try:
#         response = openai.ChatCompletion.create(
#             model="gpt-3.5-turbo",
#             messages=[{"role": "user", "content": "Hello, world!"}]
#         )
#         return JsonResponse({"response": response.choices[0].message["content"]})
    
#     except openai.error.RateLimitError:
#         return JsonResponse({"error": "Rate limit exceeded. Please wait and try again later."}, status=429)
    
#     except openai.error.OpenAIError as e:
#         return JsonResponse({"error": str(e)}, status=500)
