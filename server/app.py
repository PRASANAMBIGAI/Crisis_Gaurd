import os
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from schemas import Action, Observation, Reward
from environment import MisinfoEnvironment

app = FastAPI(title="OpenEnv CrisisGuard Misinfo Triage")

# In-memory environment instance for standard HTTP testing
env_instance = MisinfoEnvironment()

class ResetRequest(BaseModel):
    task_id: int = 1

class StepResponse(BaseModel):
    observation: Observation
    reward: Reward

@app.post("/reset", response_model=Observation)
def reset_env(req: ResetRequest = ResetRequest()):
    return env_instance.reset(req.task_id)

@app.post("/step", response_model=StepResponse)
def step_env(action: Action):
    obs, reward = env_instance.step(action)
    return StepResponse(observation=obs, reward=reward)

@app.get("/state", response_model=Observation)
def state_env():
    return env_instance.get_state()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "CrisisGuard OpenEnv API running"}

def main():
    """Entry point for the OpenEnv server."""
    port = int(os.getenv("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)

if __name__ == '__main__':
    main()
