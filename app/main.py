from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.models import user, barber, service, appointment  # Import all models
from app.api.endpoints import users, barbers, services, appointments, reports # Import all routers

app = FastAPI(title="Barber Bot Backend")

# Set up CORS
origins = [
    "*"  # Allow all origins for now
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    # Create all database tables
    Base.metadata.create_all(bind=engine)


app.include_router(users.router) # Include the users router
app.include_router(barbers.router) # Include the barbers router
app.include_router(services.router) # Include the services router
app.include_router(appointments.router) # Include the appointments router
app.include_router(reports.router) # Include the reports router


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Barber Bot Backend!"}
