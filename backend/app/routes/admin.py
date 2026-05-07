from fastapi import APIRouter

router = APIRouter()

@router.get("/candidates")
def get_candidates(district: str = None, trade: str = None, classification: str = None):
    # Mock data for admin dashboard
    mock_candidates = [
        {
            "id": "c1",
            "name": "Ramesh K.",
            "trade": "Electrician",
            "district": "Bengaluru Urban",
            "classification": "Job Ready",
            "score": 85,
            "status": "pending_review"
        },
        {
            "id": "c2",
            "name": "Suresh P.",
            "trade": "Plumber",
            "district": "Mysuru",
            "classification": "Needs Training",
            "score": 45,
            "status": "pending_review"
        },
        {
             "id": "c3",
             "name": "Unknown",
             "trade": "Welder",
             "district": "Tumakuru",
             "classification": "Suspected Fraud",
             "score": 10,
             "status": "flagged"
        }
    ]
    return mock_candidates

@router.post("/action/{candidate_id}")
def admin_action(candidate_id: str, action: str):
    # action: "approve", "reject", "training"
    return {"message": f"Candidate {candidate_id} marked as {action}."}
