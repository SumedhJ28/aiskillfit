from fastapi import APIRouter, File, UploadFile, Form, HTTPException, BackgroundTasks
from pydantic import BaseModel
import shutil
import os
import uuid
from typing import Optional

from app.models.schemas import CandidateStart
from app.ai.validator import validate_video
from app.ai.analyzer import transcribe_audio, extract_skills_from_text
from app.services.db import db

router = APIRouter()

# Temporary storage for MVP. In prod, upload to S3/Supabase directly from frontend
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/start")
def start_interview(candidate: CandidateStart):
    # In a real app, save to DB and get ID
    candidate_id = str(uuid.uuid4())
    
    # Predefined questions based on trade/language could be fetched here
    questions = [
        "Tell me about your work experience. What kind of work have you done before?",
        f"What specific skills do you have as a {candidate.trade}?",
        "Describe a time you fixed a difficult problem at work."
    ]
    
    return {
        "candidate_id": candidate_id,
        "status": "started",
        "questions": questions
    }

def process_video_background(candidate_id: str, file_path: str, language: str):
    print(f"Processing video for {candidate_id}")
    
    # 1. Validate Face
    is_valid, reason = validate_video(file_path)
    print(f"Validation: {is_valid}, {reason}")
    
    # 2. Extract Audio & Transcribe
    # For MVP, assume audio is extracted or Whisper can handle video directly (it often can if ffmpeg is installed, but safer to use audio).
    # Since we might not have ffmpeg locally in this environment, we will mock the transcription if it fails to read video.
    transcript = transcribe_audio(file_path, language)
    
    # 3. Analyze Text
    analysis = extract_skills_from_text(transcript)
    
    # 4. Determine Classification
    classification = "Manual Review"
    score = (analysis["confidence_score"] + analysis["relevance_score"]) / 2
    if score > 0.8:
        classification = "Job Ready"
    elif score > 0.5:
        classification = "Needs Training"
    else:
        classification = "Low Quality"
        
    if not is_valid:
        classification = "Suspected Fraud"

    # 5. Save to DB (Mocked for now)
    result = {
        "candidate_id": candidate_id,
        "transcript": transcript,
        "analysis": analysis,
        "classification": classification,
        "validation_passed": is_valid,
        "fraud_reason": reason if not is_valid else None
    }
    print(f"Processed result: {result}")
    # db.table("interviews").insert(result).execute()

@router.post("/upload")
async def upload_response(
    background_tasks: BackgroundTasks,
    candidate_id: str = Form(...),
    language: str = Form("kn"),
    video: UploadFile = File(...)
):
    # Save video locally
    file_extension = video.filename.split(".")[-1]
    file_path = os.path.join(UPLOAD_DIR, f"{candidate_id}_{uuid.uuid4()}.{file_extension}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)
        
    # Process in background
    background_tasks.add_task(process_video_background, candidate_id, file_path, language)
    
    return {"message": "Video uploaded and processing started.", "status": "processing"}

@router.get("/result/{candidate_id}")
def get_analysis(candidate_id: str):
    # In real app, fetch from DB
    return {
        "candidate_id": candidate_id,
        "status": "completed",
        "result": {
            "classification": "Job Ready",
            "overall_score": 82.81,
            "detected_skills": ["wiring", "motor repair", "circuit testing"],
            "confidence": 0.90,
            "relevance": 0.94,
            "fraud_score": 0.09,
            "interview_quality": "Good",
            "summary": "Candidate demonstrates good proficiency in Electrician work."
        }
    }
