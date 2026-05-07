import json
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", "mock-key"))

def extract_skills_from_text(text: str):
    if not os.getenv("OPENAI_API_KEY"):
        # Mock response if no API key
        return {
            "skills": ["electrician", "wiring"],
            "experience_years": 2,
            "confidence_score": 0.85,
            "relevance_score": 0.90,
            "summary": "Candidate mentioned wiring and electrician work for 2 years."
        }

    prompt = f"""
    Analyze the following interview response from a blue-collar worker:
    "{text}"
    
    Extract the following information in JSON format:
    - skills: List of skills mentioned (e.g., electrician, driver, plumbing, circuit repair)
    - experience_years: Estimated years of experience (number)
    - confidence_score: Number between 0 and 1 indicating how confident the candidate sounds based on the text.
    - relevance_score: Number between 0 and 1 indicating how relevant the answer is.
    - summary: A short 1-2 sentence summary of their capabilities.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that analyzes interview responses and outputs valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" }
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error in LLM extraction: {e}")
        return {
            "skills": [],
            "experience_years": 0,
            "confidence_score": 0.0,
            "relevance_score": 0.0,
            "summary": "Failed to analyze response."
        }

def transcribe_audio(audio_file_path: str, language_code: str = "kn"):
    if not os.getenv("OPENAI_API_KEY"):
        return "ನಾನು ಎರಡು ವರ್ಷಗಳಿಂದ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ ಆಗಿ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೇನೆ." # Mock Kannada response
    
    try:
        with open(audio_file_path, "rb") as audio_file:
            # Whisper handles multi-lingual. We hint it if we know the language.
            # language code e.g. "kn" for Kannada, "hi" for Hindi, "en" for English
            transcript = client.audio.transcriptions.create(
              model="whisper-1", 
              file=audio_file,
              language=language_code if language_code in ["kn", "hi", "en"] else None
            )
            return transcript.text
    except Exception as e:
         print(f"Error in STT: {e}")
         return ""
