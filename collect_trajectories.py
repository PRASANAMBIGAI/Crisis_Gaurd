import json
import os
from inference import client, MODEL_NAME, PROMPT_TEMPLATE, _clean_llm_json, _fmt_action
from environment import MisinfoEnvironment
from schemas import Action

def collect_data(num_episodes=5, output_file="trajectories.jsonl"):
    """
    Runs the agent through the environment tasks and saves 'golden' trajectories 
    (prompt + correct response) to a JSONL dataset for future fine-tuning or RLHF.
    """
    env = MisinfoEnvironment()
    dataset = []

    print(f"Collecting trajectories using model: {MODEL_NAME}")
    
    # We will just iterate through the available tasks
    task_ids = [1, 2, 3, 4, 5]
    
    for episode in range(num_episodes):
        task_id = task_ids[episode % len(task_ids)]
        obs = env.reset(task_id)
        done = False
        step_num = 0
        
        while not done and step_num < 10:
            prompt = PROMPT_TEMPLATE.format(
                task_id=obs.task_id,
                post_author=obs.post_author,
                post_text=obs.post_text,
                media_description=obs.media_description,
                agent_score_deductions=obs.agent_score_deductions,
                previous_tool_result=obs.previous_tool_result,
            )

            # Let the teacher model (e.g., GPT-4o or Llama-3-70B) take an action
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0,
            )
            
            reply_content = response.choices[0].message.content.strip()
            clean_reply = _clean_llm_json(reply_content)
            
            try:
                action_data = json.loads(clean_reply)
                action = Action(**action_data)
            except Exception:
                # Skip invalid parses for dataset collection
                break

            # Step the environment
            next_obs, reward = env.step(action)
            done = reward.is_done
            
            # Save the trajectory transition
            transition = {
                "task_id": task_id,
                "step": step_num,
                "prompt": prompt,
                "completion": clean_reply,  # The JSON action the model took
                "reward": max(reward.score, 0.001) # We store the actual reward for RL algorithms
            }
            dataset.append(transition)
            
            obs = next_obs
            step_num += 1
            
        print(f"Episode {episode+1}/{num_episodes} (Task {task_id}) processed.")

    # Save to file
    with open(output_file, "a" if os.path.exists(output_file) else "w", encoding="utf-8") as f:
        for item in dataset:
            f.write(json.dumps(item) + "\n")
            
    print(f"Saved {len(dataset)} transitions to {output_file}")

if __name__ == "__main__":
    if "HF_TOKEN" not in os.environ and "OPENAI_API_KEY" not in os.environ:
        print("Please set HF_TOKEN or OPENAI_API_KEY to collect trajectories.")
    else:
        collect_data(num_episodes=5)
