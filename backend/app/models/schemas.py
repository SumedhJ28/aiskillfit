from pydantic import BaseModel
from typing import Optional, List

class CandidateStart(BaseModel):
    name: str
    phone: str
    language: str # "kn", "hi", "en"
    district: str
    trade: str

class ClassificationResult(BaseModel):
    category: str # "Job Ready", "Needs Training", "Manual Review"
    job_category: str # "Blue-collar", "Polytechnic"
    confidence_score: float
    detected_skills: List[str]
