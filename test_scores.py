"""
Local Score Validation Test
============================
Verifies that all task scores produced by TaskGrader and MisinfoEnvironment
are strictly within (0, 1) — i.e. NOT exactly zero and NOT exactly one.

Run with:
    python test_scores.py
"""

from tasks import TaskGrader, TASKS
from environment import MisinfoEnvironment
from schemas import Action

PASS = "\033[92m✓ PASS\033[0m"
FAIL = "\033[91m✗ FAIL\033[0m"

errors = []

def check_score(score: float, label: str):
    """Assert score is strictly between 0 and 1."""
    valid = 0.001 < score < 0.999
    status = PASS if valid else FAIL
    print(f"  {status}  {label}: score = {score}")
    if not valid:
        errors.append(f"{label}: score={score} is OUT OF RANGE (must be strictly 0 < score < 1)")

# ── 1. TaskGrader — all boundary combinations ──────────────────────────────
print("\n=== TaskGrader.evaluate_submission() boundary tests ===")

for task_id in TASKS.keys():
    data = TASKS[task_id]
    grader = TaskGrader(task_id)

    # Best case: correct label + correct keyword + tool used
    grader.tool_calls = [{"name": "search_fact_db", "args": {"query": "test"}}]
    score = grader.evaluate_submission(
        label=data["ground_truth_label"],
        reasoning=f"This post is wrong because of {data['expected_reasoning_keyword']}",
        confidence_score=80
    )
    check_score(score, f"Task {task_id} — perfect answer")

    # Worst case: wrong label, wrong reasoning, no tools
    grader2 = TaskGrader(task_id)
    score2 = grader2.evaluate_submission(
        label="WRONG_LABEL",
        reasoning="I have no idea",
        confidence_score=95  # high confidence when wrong → extra penalty
    )
    check_score(score2, f"Task {task_id} — worst case")

    # Score = 0.999 edge: correct everything + task_id=1 (free tool pts)
    grader3 = TaskGrader(task_id)
    grader3.tool_calls = [{"name": "search_fact_db", "args": {}}]
    score3 = grader3.evaluate_submission(
        label=data["ground_truth_label"],
        reasoning=data["expected_reasoning_keyword"],
        confidence_score=75
    )
    check_score(score3, f"Task {task_id} — all correct, confidence=75")

    # Low confidence when score=0.999 (penalty branch)
    grader4 = TaskGrader(task_id)
    grader4.tool_calls = [{"name": "search_fact_db", "args": {}}]
    score4 = grader4.evaluate_submission(
        label=data["ground_truth_label"],
        reasoning=data["expected_reasoning_keyword"],
        confidence_score=30  # low confidence penalty
    )
    check_score(score4, f"Task {task_id} — all correct, low confidence")

# ── 2. MisinfoEnvironment — submit_decision path ───────────────────────────
print("\n=== MisinfoEnvironment submit_decision path ===")

env = MisinfoEnvironment()

for task_id in TASKS.keys():
    data = TASKS[task_id]

    # Correct submission
    obs = env.reset(task_id=task_id)
    _, reward = env.step(Action(
        tool_name="submit_decision",
        tool_args={
            "label": data["ground_truth_label"],
            "reasoning": f"Because of {data['expected_reasoning_keyword']}",
            "confidence_score": 80
        }
    ))
    check_score(reward.score, f"Task {task_id} env — correct submission")

    # With heavy deductions (request_human_review before submit)
    obs = env.reset(task_id=task_id)
    env.step(Action(tool_name="request_human_review", tool_args={}))  # -0.25 deduction
    _, reward2 = env.step(Action(
        tool_name="submit_decision",
        tool_args={
            "label": "WRONG",
            "reasoning": "bad reasoning",
            "confidence_score": 5
        }
    ))
    check_score(reward2.score, f"Task {task_id} env — wrong + human review penalty")

# ── 3. Inference exception path ────────────────────────────────────────────
print("\n=== Inference exception-path score ===")
exception_score = 0.1  # The value we hardcoded in inference.py
rewards = [exception_score]
print(f"  Rewards fallback: {rewards}")

print("\n=== Step reward clamp (min=0.1, max=0.9) ===")
# Example of the line: step_reward = min(max(reward.score, 0.1), 0.9)
step_reward_1 = min(max(0.999, 0.1), 0.9)
step_reward_2 = min(max(0.001, 0.1), 0.9)
import random
test_raw = [0.001, 0.1, 0.5, 0.9, 0.999, 1.5, -0.5]
for raw in test_raw:
    clamped = max(raw, 0.1)
    clamped = min(clamped, 0.9)
    check_score(clamped, f"raw={raw} → clamped={clamped}")

# ── Summary ────────────────────────────────────────────────────────────────
print("\n" + "="*50)
if errors:
    print(f"\033[91m✗ {len(errors)} SCORE(S) OUT OF RANGE:\033[0m")
    for e in errors:
        print(f"  - {e}")
else:
    print("\033[92m✓ ALL SCORES are strictly within (0, 1). Safe to submit!\033[0m")
print("="*50)
