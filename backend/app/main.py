from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import interview, admin

app = FastAPI(title="AI SkillFit Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview.router, prefix="/api/interview", tags=["Interview"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
def read_root():
    return {"message": "AI SkillFit Backend is running"}
