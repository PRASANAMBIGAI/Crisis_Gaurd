---
title: CrisisGuard OpenEnv
emoji: 🛡️
colorFrom: red
colorTo: gray
sdk: docker
pinned: false
---

# 🛡️ CrisisGuard: Misinformation Triage Platform & OpenEnv Benchmark

**CrisisGuard** is a dual-purpose Trust & Safety ecosystem designed to visualize, track, and ultimately delegate social media content moderation to safely calibrated frontier AI agents. 

This repository contains two primary components built for the **Meta PyTorch OpenEnv Hackathon**:
1. **The Application:** A sprawling dashboard and operational control tower designed to track regional disinformation spread, monitor anxiety-reduction metrics, and organize policies.
2. **The OpenEnv Benchmark (The Core Submission):** Found inside the `/openenv` directory, this is a fully functioning, containerized OpenEnv evaluation space that subjects LLMs to severe penalty constraints and operational decision-making loops regarding misinformation.

---

## 🏆 OpenEnv Benchmark Highlights
The most significant engineering effort for this Hackathon lives in the `/openenv` folder.

Instead of traditional puzzle games or math tests, we built a **Real-World Policy Moderation Environment**. AI Agents must correctly label dangerous social media posts (e.g., manipulated documents, out-of-context images, harmful health advice) by querying a mock Fact DB.

### Why this Environment Wins:
*   **Dynamic Loop Penalties:** The environment aggressively bleeds points (-0.1) from an agent if it gets stuck in an infinite loop querying the same string.
*   **The "Cost of Ambiguity" Metric:** LLMs have access to a `request_human_review` tool. This tests whether an AI can accurately balance its own uncertainty against the cost of human escalation (which incurs a -0.25 point penalty).
*   **Severe Confidence Calibration:** Agents must estimate their own reasoning accuracy. If an agent guesses incorrectly but claims `95%` confidence, it loses massive fractional points for dangerous hallucination.

---

## 📊 Baseline Performance Scores

Run `python inference.py` from the project root to reproduce. Typical scores with `gpt-4o`:

| Task | Difficulty | Expected Score |
|---|---|---|
| 1 — Spam / Medical Scam | Easy | 0.80 – 1.00 |
| 2 — Context Mismatch | Medium | 0.60 – 0.90 |
| 3 — Manipulated Document | Hard | 0.40 – 0.80 |
| 4 — Harmful Health Advice | Hard | 0.50 – 0.80 |
| 5 — Election Disinformation | Medium | 0.60 – 0.90 |
| **Average** | | **0.58 – 0.88** |

---

## 🚀 Repository Navigation

### `inference.py` (Project Root — Hackathon Entry Point)
The spec-compliant inference script that emits `[START]`/`[STEP]`/`[END]` output format. Uses the OpenAI client to evaluate any model.

### `openenv/` (Hackathon Submission)
Contains the entirety of the strictly typed OpenEnv architecture:
- `app.py`: The FastAPI server exposing `/reset`, `/step`, and `/state`.
- `schemas.py`: Pydantic configurations bounding the Observation and Action spaces.
- `tasks.py`: The mock database, penalty logic, and continuous reward shaping engine.
- `Dockerfile`: Secure, non-root HF Spaces containerization.

### `src/` & Application Root 
Contains the CrisisGuard Next.js / TypeScript front-end architecture, dashboard UI schemas, and policy visualization logic. 

### 🧠 RL Training Pipeline (New)
To go beyond evaluation and actively train an AI Agent using the environment constraints, we have provided two reference architectures:
- `collect_trajectories.py`: Runs a teacher model against the environment to build a "Golden" jsonl dataset suitable for Supervised Fine-Tuning (SFT) or DPO on smaller models.
- `train_rl.py`: A conceptual PyTorch skeleton showing how the environment's `Reward` tensor is used as a Reinforcement Learning loss signal (Policy Gradient) directly on a Hugging Face model (`meta-llama`).

---

## 💻 Local Testing

To run the OpenEnv benchmark against a frontier model locally:

```bash
# From the project root directory
pip install -r openenv/requirements.txt

export API_BASE_URL="https://router.huggingface.co/v1"
export MODEL_NAME="Qwen/Qwen2.5-72B-Instruct"
export HF_TOKEN="your-hf-token-here"

python inference.py
```

**Required Environment Variables:**

| Variable | Required | Default |
|---|---|---|
| `HF_TOKEN` | ✅ Mandatory | — (raises error if missing) |
| `API_BASE_URL` | Optional | `https://api.openai.com/v1` |
| `MODEL_NAME` | Optional | `gpt-4.1-mini` |
