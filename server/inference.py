import os
import json
from openai import OpenAI
from environment import MisinfoEnvironment
from schemas import Action

API_BASE_URL = os.environ.get("API_BASE_URL", "https://api.openai.com/v1")
MODEL_NAME = os.environ.get("MODEL_NAME", "gpt-4o")
HF_TOKEN = os.environ.get("HF_TOKEN", os.environ.get("OPENAI_API_KEY", ""))

client = OpenAI(
    api_key=HF_TOKEN,
    base_url=API_BASE_URL
)

PROMPT_TEMPLATE = """You are a Misinformation Triage Agent.
Your tasks are to label social media posts accurately and provide a reasoning.
You have the following tools:
1. "search_fact_db" with arg "query" (string)
2. "check_policy_db" with arg "query" (string)
3. "request_human_review" with empty args {{}} - Use this ONLY if stuck (costs -0.25 points!).
4. "submit_decision" with args "label" (string), "reasoning" (string), "confidence_score" (integer 0-100).

Warning: You will lose -0.1 points if you query the exact same string multiple times!

Current Observation:
Task ID: {task_id}
Post Author: {post_author}
Post text: {post_text}
Media Description: {media_description}
Penalty Deductions So Far: {agent_score_deductions}
Previous Tool Result: {previous_tool_result}

Output strictly valid JSON matching this schema:
{{
  "tool_name": "...",
  "tool_args": {{ ... }}
}}
Do not write markdown block formatting like ```json.
"""

def run_task(task_id: int):
    print(f"\n--- Running Task {task_id} ---")
    env = MisinfoEnvironment()
    obs = env.reset(task_id)
    
    is_done = False
    max_steps = 10
    step = 0
    final_score = 0.1  # Must be strictly > 0.0 for hackathon validator
    
    while not is_done and step < max_steps:
        step += 1
        prompt = PROMPT_TEMPLATE.format(
            task_id=obs.task_id,
            post_author=obs.post_author,
            post_text=obs.post_text,
            media_description=obs.media_description,
            agent_score_deductions=obs.agent_score_deductions,
            previous_tool_result=obs.previous_tool_result
        )
        
        # Call LLM
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0
        )
        
        reply_content = response.choices[0].message.content.strip()
        
        if reply_content.startswith("```json"):
            reply_content = reply_content.replace("```json", "", 1).strip()
            if reply_content.endswith("```"):
                reply_content = reply_content[:-3].strip()
        elif reply_content.startswith("```"):
            reply_content = reply_content.replace("```", "", 1).strip()
            if reply_content.endswith("```"):
                reply_content = reply_content[:-3].strip()
                
        try:
            action_data = json.loads(reply_content)
            action = Action(**action_data)
        except Exception as e:
            print(f"Error parsing LLM output: {e}. Raw content: {reply_content}")
            action = Action(tool_name="submit_decision", tool_args={"label": "ERROR", "reasoning": str(e)})
            
        print(f"> Step {step} Action: {action.tool_name} {action.tool_args}")
        obs, reward = env.step(action)
        print(f"  Result: {obs.previous_tool_result}")
        if reward.is_done:
            is_done = True
            final_score = min(max(reward.score, 0.1), 0.9)  # Clamp strictly within (0, 1)
            break
            
    print(f"Task {task_id} completed. Final Score: {final_score}")
    return final_score if final_score is not None else 0.1

if __name__ == "__main__":
    if not HF_TOKEN:
         print("Warning: HF_TOKEN or OPENAI_API_KEY environment variable not set. LLM calls may fail.")
         
    scores = []
    for t_id in [1, 2, 3, 4, 5]:
        s = run_task(t_id)
        scores.append(s)
        
    print("\n====================")
    print("BASELINE RUN SUMMARY")
    print(f"Task 1: {scores[0]}")
    print(f"Task 2: {scores[1]}")
    print(f"Task 3: {scores[2]}")
    print(f"Task 4: {scores[3]}")
    print(f"Task 5: {scores[4]}")
    avg = sum(scores) / len(scores) if scores else 0.1
    print(f"Average Score: {avg}")
