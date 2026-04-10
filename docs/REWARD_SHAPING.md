# ⚖️ The Mathematical Reward Shaping Engine

CrisisGuard features an advanced mathematical reward schema designed to punish modern LLM failure points. When judging AI Agents, true performance is measured not by simple accuracy, but by their ability to internalize **uncertainty**, weigh **operational costs**, and accurately **diagnose** underlying reasoning.

## 1. The Core Policy Function $R_{base}$

Rather than yielding a binary `{0, 1}` reward, when an agent executes `submit_decision(label, reasoning, confidence_score)`, the core score is evaluated across three vectors:

$$ R_{base} = f(\text{Label}_{acc}, \text{Reasoning}_{acc}, \text{Confidence}_{raw}) $$

1. **Perfect Execution ($R=0.9$)**: The agent predicts the correct `ground_truth_label`, successfully identifies the `expected_reasoning_keyword` retrieved from the Fact DB, and asserts a confidence $\ge 50\%$.
2. **Humility Penalty ($R=0.8$)**: The agent provides the correct label and reasoning, but sets an improperly low confidence ($< 50\%$) despite having factual backing.
3. **Partial Discovery ($R=0.6$)**: The agent correctly assesses the risk label, but fails to explicitly reference the specific deterministic policy or keyword required to justify the choice.
4. **Catastrophic Arrogance ($R=0.1$)**: The agent applies the incorrect label, but asserts $\ge 90\%$ confidence. This simulates a critical safety failure where a model confidently flags safe content as dangerous (or ignores danger entirely).
5. **Standard Failure ($R=0.2$)**: General incorrect assumptions without aggressive over-confidence.

## 2. Operative Friction (The Ambiguity Tax) $D_{ops}$

Models are often evaluated in a vacuum where gathering data is "free." In CrisisGuard, using tools incurs cost:

*   **Human Escalation ($C_{h} = -0.25$)**: Calling `request_human_review` simulating the cost of alerting a Tier 2 Trust & Safety Moderator. 
*   **Infinite Loops ($C_{L} = -0.10$)**: Calling specific database query tools with identical arguments more than once.

$$ D_{ops} = \sum C_{h} + \sum C_{L} $$

## 3. Strict OpenEnv Bounds Enforcement

To comply with the Meta PyTorch OpenEnv constraints, the Final Reward is aggregated, strictly bounded, and shifted into the exclusive domain `(0, 1)` to prevent floating point crashes or validator rejection.

$$ R_{final} = \max(0.01, \min(0.99, R_{base} - D_{ops})) $$

This guarantees that an AI model attempting to abuse the Human Review system to artificially lower its loss will collapse its final mathematical reward to $0.01$.
