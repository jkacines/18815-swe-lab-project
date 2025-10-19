from fastapi import FastAPI, HTTPException
from bson import ObjectId
from userData import UserLogin
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from passlib.hash import bcrypt

app = FastAPI()

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

@app.post("/register")
async def register_user(user: UserLogin):
    existing = await db.users.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_pw = bcrypt.hash(user.password)
    user_model_dump = user.model_dump()
    user_model_dump["password"] = hashed_pw
    await db.users.insert_one(user_model_dump)
    return {"message": "User registered successfully"}

@app.post("/login")
async def login_user(user: UserLogin):
    existing = await db.users.find_one({"username": user.username})
    if not existing or not bcrypt.verify(user.password, existing["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"message": f"Welcome {user.username}!"}

@app.get("/")
async def root():
    return {"message": "Welcome to the backend!"}