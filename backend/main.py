from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session
import datetime

# --- Database Setup ---
# Using SQLite for local development. Easy to swap to Postgres later.
SQLALCHEMY_DATABASE_URL = "sqlite:///./workouts.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- SQLAlchemy Model (Database Table) ---
class Workout(Base):
    __tablename__ = "workouts"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    exercise_name = Column(String, index=True)
    sets = Column(Integer)
    reps = Column(Integer)
    weight = Column(Float)

# Create the database table
Base.metadata.create_all(bind=engine)

# --- Pydantic Schemas (Data Validation) ---
class WorkoutCreate(BaseModel):
    exercise_name: str
    sets: int
    reps: int
    weight: float

class WorkoutResponse(WorkoutCreate):
    id: int
    date: datetime.datetime

    class Config:
        from_attributes = True

# --- FastAPI App Initialization ---
app = FastAPI(title="Workout Tracker API")

# Enable CORS so your future React frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---

@app.post("/workouts/", response_model=WorkoutResponse)
def create_workout(workout: WorkoutCreate, db: Session = Depends(get_db)):
    """Logs a new workout routine into the database."""
    db_workout = Workout(**workout.model_dump())
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout

@app.get("/workouts/", response_model=list[WorkoutResponse])
def read_workouts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Fetches the history of logged workouts."""
    workouts = db.query(Workout).offset(skip).limit(limit).all()
    return workouts
