from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
import numpy as np
import random
import torch
import torch.nn as nn
import torch.optim as optim
from datetime import datetime

# Initialize FastAPI
app = FastAPI()

# MongoDB Configuration
client = MongoClient("mongodb+srv://slotmatesih2024:1lcUSUznPr0b1Nf3@cluster0.rqzix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['slotmate']
user_collection = db['delivery_slots']

delivery_logs = db['delivery_logs']

# RL Model
class DQNAgent:
    def __init__(self, state_size, action_size):
        self.state_size = state_size
        self.action_size = action_size
        self.memory = []
        self.model = nn.Sequential(
            nn.Linear(state_size, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, action_size)
        )
        self.optimizer = optim.Adam(self.model.parameters(), lr=0.001)
        self.criterion = nn.MSELoss()

    def act(self, state, epsilon=0.1):
        if np.random.rand() < epsilon:
            return random.randrange(self.action_size)
        state_tensor = torch.FloatTensor(state).unsqueeze(0)
        q_values = self.model(state_tensor)
        return torch.argmax(q_values).item()

    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))
        if len(self.memory) > 2000:
            self.memory.pop(0)

    def replay(self, batch_size=32):
        if len(self.memory) < batch_size:
            return
        batch = random.sample(self.memory, batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)

        states = torch.FloatTensor(states)
        actions = torch.LongTensor(actions)
        rewards = torch.FloatTensor(rewards)
        next_states = torch.FloatTensor(next_states)
        dones = torch.FloatTensor(dones)

        q_values = self.model(states).gather(1, actions.unsqueeze(1)).squeeze(1)
        next_q_values = self.model(next_states).max(1)[0]
        expected_q_values = rewards + (0.99 * next_q_values * (1 - dones))

        loss = self.criterion(q_values, expected_q_values.detach())
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()


# Initialize RL Agent
state_size = 6  # Example state size
action_size = 6  # Number of time slots
agent = DQNAgent(state_size, action_size)


# Helper Functions
def get_user_state(user_id):
    user_data = user_collection.find_one({"mobile_number": user_id})
    if not user_data:
        raise ValueError("User not found")
    return np.array([
        user_data.get('success_rate_slot_1', 0.5),
        user_data.get('success_rate_slot_2', 0.5),
        user_data.get('success_rate_slot_3', 0.5),
        user_data.get('failure_rate_slot_4', 0.5),
        user_data.get('holiday_indicator', 0),
        user_data.get('day_of_week', 0)
    ])


def log_delivery(user_id, slot, success):
    delivery_logs.insert_one({
        "user_id": user_id,
        "slot": slot,
        "success": success,
        "timestamp": datetime.utcnow()
    })


def update_user_stats(user_id, slot, success):
    user_data = user_collection.find_one({"user_id": user_id}) or {"user_id": user_id}
    key = f"success_rate_slot_{slot + 1}"
    if success:
        user_data[key] = user_data.get(key, 0.5) * 0.9 + 0.1
    else:
        user_data[key] = user_data.get(key, 0.5) * 0.9
    user_collection.update_one({"user_id": user_id}, {"$set": user_data}, upsert=True)


# API Models
class RecommendSlotRequest(BaseModel):
    user_id: int


class UpdateSlotRequest(BaseModel):
    user_id: int
    slot: int
    success: bool


# API Endpoints
@app.post("/recommend-slot/")
def recommend_slot(request: RecommendSlotRequest):
    try:
        user_state = get_user_state(request.user_id)
        recommended_slot = agent.act(user_state)
        return {"recommended_slot": recommended_slot}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.post("/update-slot/")
def update_slot(request: UpdateSlotRequest):
    log_delivery(request.user_id, request.slot, request.success)
    update_user_stats(request.user_id, request.slot, request.success)
    return {"message": "Slot and user stats updated successfully"}