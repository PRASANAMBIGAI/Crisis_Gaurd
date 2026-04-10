# Contributing to CrisisGuard OpenEnv

First off, thank you for considering contributing to the CrisisGuard Misinformation Triage Environment! This project is designed to scale dynamically, and adding new scenarios to our evaluation suite is incredibly straightforward.

## 🛠 Adding a New Evaluation Task

Our environment relies on a static scenario dictionary in `tasks.py` and `server/tasks.py`. To introduce a new misinformation threat scenario for LLM evaluation, you simply need to expand the `TASKS` dictionary.

### 1. The Task Schema

Locate the `TASKS` block in `tasks.py` and append your new scenario:

```python
6: {
    "post_author": "@EmergentThreat",
    "post_text": "This text represents the simulated misinformation post the LLM must evaluate.",
    "media_description": "Optional: Describe any attached images or videos.",
    # The 'facts' dictionary represents the ground truth database the LLM can query 
    # using the `search_fact_db` tool. 
    "facts": {
        "keyword": "The actual fact rectifying the misinformation."
    },
    # The 'policies' dictionary represents the trust & safety handbook the LLM queries.
    "policies": {
        "policy_type": "If X occurs, label as Y."
    },
    "ground_truth_label": "EXPECTED_LABEL",
    "expected_reasoning_keyword": "keyword"
}
```

### 2. Updating `openenv.yaml`

If your task operates outside the current boundary bounds, update the `openenv.yaml` manifest so the Hackathon validator recognizes the new index.

```yaml
tasks:
  - id: 6
    difficulty: hard
    description: "Your brief description of the new threat vector."
```

### 3. Testing Your Task

Ensure your new task does not break the strict mathematical bounds of our Reward Engine. Run the test suite:

```bash
make test
# OR
python test_scores.py
```

Ensure all scores report strictly within `(0.01, 0.99)`.

## 🧠 Modifying the Reward Penalty Engine

If you wish to augment the mathematical properties assigned to an agent's success or failure, refer to our [Reward Shaping Documentation](docs/REWARD_SHAPING.md). 

**Warning:** Any modifications to the `TaskGrader` static assignments (`0.1`, `0.6`, `0.8`, `0.9`) must adhere to strict mathematically observable boundaries. OpenEnv Hackathon limits strictly forbid integer rewards exactly equal to `0` or `1`.
