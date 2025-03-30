import numpy as np
import random
import torch
import torch.nn as nn
import torch.optim as optim
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient

# MongoDB Configuration
client = MongoClient("mongodb+srv://slotmatesih2024:1lcUSUznPr0b1Nf3@cluster0.rqzix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['delivery_db']
user_collection = db['users']
delivery_logs = db['delivery_logs']

# FastAPI Initialization
app = FastAPI()

# Model Definition
class RLModel(nn.Module):
    def __init__(self):
        super(RLModel, self).__init__()
        self.fc = nn.Sequential(
            nn.Linear(2, 128),  # Adjusted input size to 2 features
            nn.ReLU(),
            nn.Linear(128, 4)  # Output size is 4 (for 4 possible slots)
        )

    def forward(self, x):
        return self.fc(x)

# Reinforcement Learning Agent
class RLAgent:
    def __init__(self):
        self.model = RLModel()
        self.optimizer = optim.Adam(self.model.parameters(), lr=0.001)
        self.criterion = nn.MSELoss()
        self.memory = []

    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))
        if len(self.memory) > 1000:
            self.memory.pop(0)

    def act(self, state):
        with torch.no_grad():
            q_values = self.model(torch.FloatTensor(state))
            return torch.argmax(q_values).item()

    def train(self, batch_size=32):
        if len(self.memory) < batch_size:
            return
        batch = random.sample(self.memory, batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)
        states = torch.FloatTensor(states)
        next_states = torch.FloatTensor(next_states)
        rewards = torch.FloatTensor(rewards)
        dones = torch.FloatTensor(dones)
        actions = torch.LongTensor(actions)

        q_values = self.model(states)
        next_q_values = self.model(next_states)

        q_values = q_values.gather(1, actions.unsqueeze(1)).squeeze()
        next_q_values = next_q_values.max(1)[0]

        target = rewards + (1 - dones) * 0.99 * next_q_values

        loss = self.criterion(q_values, target)
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

# Initialize Agent
agent = RLAgent()

class SlotRequest(BaseModel):
    mobile_number: str
    is_holiday: bool

class SlotFeedback(BaseModel):
    mobile_number: str
    feedback: bool

slots = ["10:00 AM - 12:00 PM", "12:00 PM - 2:00 PM", "2:00 PM - 4:00 PM", "4:00 PM - 6:00 PM"]

@app.post("/recommend-slot/")
async def recommend_slot(request: SlotRequest):
    user_data = user_collection.find_one({"mobile_number": request.mobile_number})
    if not user_data:
        state = [int(request.is_holiday), 0]
    else:
        state = [int(request.is_holiday), user_data.get("previous_slot_feedback", 0)]

    action = agent.act(state)
    recommended_slot = slots[action]

    return {"mobile_number": request.mobile_number, "recommended_slot": recommended_slot}

@app.post("/provide-feedback/")
async def provide_feedback(feedback: SlotFeedback):
    user_data = user_collection.find_one({"mobile_number": feedback.mobile_number})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    last_state = [user_data.get("is_holiday", 0), user_data.get("previous_slot_feedback", 0)]
    last_action = user_data.get("last_action", 0)

    reward = 1 if feedback.feedback else -1
    next_state = [user_data.get("is_holiday", 0), reward]
    done = True

    agent.remember(last_state, last_action, reward, next_state, done)
    agent.train()

    user_collection.update_one(
        {"mobile_number": feedback.mobile_number},
        {"$set": {"previous_slot_feedback": reward}}
    )

    return {"message": "Feedback recorded successfully"}
