from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Duru ULV API")
api_router = APIRouter(prefix="/api")


# ===== Models =====
class QuoteCreate(BaseModel):
    full_name: str
    company: Optional[str] = ""
    phone: str
    email: str
    city: Optional[str] = ""
    message: Optional[str] = ""
    products: List[str] = []  # product slugs
    kvkk_accepted: bool


class Quote(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    company: str = ""
    phone: str
    email: str
    city: str = ""
    message: str = ""
    products: List[str] = []
    kvkk_accepted: bool
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ===== Routes =====
@api_router.get("/")
async def root():
    return {"message": "Duru ULV API", "status": "ok"}


@api_router.post("/quotes", response_model=Quote)
async def create_quote(payload: QuoteCreate):
    if not payload.kvkk_accepted:
        raise HTTPException(status_code=400, detail="KVKK onayı zorunludur")
    quote = Quote(**payload.model_dump())
    doc = quote.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.quotes.insert_one(doc)
    logger.info(f"New quote received: {quote.id} from {quote.full_name} ({quote.email})")
    return quote


@api_router.get("/quotes", response_model=List[Quote])
async def list_quotes():
    docs = await db.quotes.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
