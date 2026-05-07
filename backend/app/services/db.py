import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

def get_supabase_client() -> Client:
    # Initialize only if credentials are provided
    if SUPABASE_URL and SUPABASE_KEY:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Mock client if keys are not provided (for simple testing without DB setup)
    class MockClient:
        def table(self, name):
            return self
        def insert(self, data):
            return self
        def execute(self):
            return {"data": data}
        def select(self, query):
            return self
    return MockClient()

db = get_supabase_client()
