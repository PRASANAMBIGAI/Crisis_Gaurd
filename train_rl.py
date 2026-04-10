"""
PyTorch RL Training Skeleton for CrisisGuard OpenEnv

This script demonstrates how to integrate the MisinfoEnvironment with a PyTorch 
training loop. Direct RL on language models (like PPO on Llama-3) requires 
heavy libraries like `trl` (Transformer Reinforcement Learning) and multiple GPUs.

Instead, this script uses a conceptual Policy Gradient (REINFORCE) approach on a 
smaller local model to illustrate how the OpenEnv `Reward` signal can be 
converted into a PyTorch loss function.
"""

import torch
import torch.nn as nn
import torch.optim as optim
from transformers import AutoTokenizer, AutoModelForCausalLM
from environment import MisinfoEnvironment
from schemas import Action

# ── Configuration ──────────────────────────────────────────────────
# For demonstration, we use a tiny standard model. 
# In a real hackathon setting, you would use a larger model or PEFT/LoRA.
MODEL_NAME = "gpt2" # Replace with "meta-llama/Meta-Llama-3-8B-Instruct" etc.
LEARNING_RATE = 1e-5
EPISODES = 5
MAX_STEPS = 5

# ── Load PyTorch Assets ────────────────────────────────────────────
print(f"Loading {MODEL_NAME}...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
# Set padding token to EOS if not present
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

# Initialize standard Hugging Face model
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Initialize standard PyTorch Optimizer
optimizer = optim.AdamW(model.parameters(), lr=LEARNING_RATE)

env = MisinfoEnvironment()

# ── Training Loop ──────────────────────────────────────────────────
for episode in range(EPISODES):
    print(f"\n--- Starting Episode {episode+1} ---")
    
    # Optional: cycle through tasks
    task_id = (episode % 5) + 1
    obs = env.reset(task_id=task_id)
    
    log_probs = []
    rewards_buffer = []
    done = False
    step = 0
    
    while not done and step < MAX_STEPS:
        # 1. State Construction
        # In a real setup, format this nicely using your structured prompts.
        state_text = f"Task: {obs.task_id}\nPost: {obs.post_text}\n"
        
        # 2. Forward Pass (Action Selection)
        inputs = tokenizer(state_text, return_tensors="pt").to(device)
        
        # Get logits for the next token (simplified conceptual approach)
        outputs = model(**inputs)
        next_token_logits = outputs.logits[0, -1, :]
        
        # Sample an action (token) using Categorical probabilities
        probs = torch.softmax(next_token_logits, dim=-1)
        m = torch.distributions.Categorical(probs)
        action_token = m.sample()
        
        # Track the log probability for the Policy Gradient loss
        log_prob = m.log_prob(action_token)
        log_probs.append(log_prob)
        
        # 3. Environment Step
        # Decode the token into text. 
        # (Note: In a true JSON-agent setup, you would generate a full JSON string)
        action_text = tokenizer.decode(action_token)
        
        # For this skeleton, we construct a dummy Action object since a single 
        # token won't form a valid JSON tool call.
        dummy_action = Action(
            tool_name="request_human_review",
            tool_args={}
        )
        
        next_obs, reward_obj = env.step(dummy_action)
        done = reward_obj.is_done
        
        # Crucial Hackathon Step: Extract reward metric
        r = reward_obj.score 
        rewards_buffer.append(r)
        
        obs = next_obs
        step += 1

    # 4. Compute Loss (Policy Gradient / REINFORCE)
    # R_t = sum of future rewards
    # Loss = -sum(log_prob * R)
    total_reward = sum(rewards_buffer)
    print(f"Episode {episode+1} Total Environmental Reward: {total_reward:.3f}")
    
    policy_loss = []
    for log_prob, r in zip(log_probs, rewards_buffer):
        # We want to MAXIMIZE reward, which means MINIMIZING negative reward
        policy_loss.append(-log_prob * r)
        
    optimizer.zero_grad()
    loss = torch.stack(policy_loss).sum()
    
    # 5. Backward Pass
    loss.backward()
    optimizer.step()
    
    print(f"Loss computed and weights updated. Value: {loss.item():.4f}")

print("\nTraining Skeleton execution completed. Model weights updated via PyTorch.")
