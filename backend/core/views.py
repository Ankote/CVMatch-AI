import os
import pdfplumber
import openai
from dotenv import load_dotenv
from rest_framework.decorators import api_view, parser_classes, authentication_classes, permission_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text
    return text

def match_cv(cv_text, job_description):
    messages = [
        {
            "role": "system",
            "content": "You are an expert HR assistant. Your job is to compare CVs to job descriptions and give a relevance score from 0 to 100 with explanations."
        },
        {
            "role": "user",
            "content": f"""
CV:
{cv_text}

Job Description:
{job_description}

Please evaluate the match and return:
- Score (0 to 100)
- Matching skills
- Missing skills
- Final evaluation summary
"""
        }
    ]
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # Replace with OpenRouter if needed
        messages=messages
    )
    return response['choices'][0]['message']['content']

@api_view(['POST'])
@parser_classes([MultiPartParser])
@authentication_classes([])         # Disable session auth (which expects CSRF)
@permission_classes([AllowAny])    # Allow anyone to access
def analyze_cv(request):
    cv_file = request.FILES.get('cv_file')
    job_description = request.data.get('job_description')

    if not cv_file or not job_description:
        return Response({"error": "cv_file and job_description are required"}, status=400)

    cv_text = extract_text_from_pdf(cv_file)
    result = match_cv(cv_text, job_description)

    return Response({
        "result": result
    })
