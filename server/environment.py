from schemas import Observation, Action, Reward
from tasks import TASKS, TaskGrader

class MisinfoEnvironment:
    def __init__(self):
        self.current_task_id = 1
        self.grader = TaskGrader(self.current_task_id)
        self.step_count = 0
        self.max_steps = 10
        self.last_tool_result = None
        self.agent_score_deductions = 0.0

    def reset(self, task_id: int = 1) -> Observation:
        if task_id not in TASKS:
            task_id = 1
        self.current_task_id = task_id
        self.grader = TaskGrader(task_id)
        self.step_count = 0
        self.last_tool_result = None
        self.agent_score_deductions = 0.0
        
        return self.get_state()

    def get_state(self) -> Observation:
        data = TASKS[self.current_task_id]
        return Observation(
            task_id=self.current_task_id,
            post_text=data["post_text"],
            post_author=data["post_author"],
            media_description=data["media_description"],
            previous_tool_result=self.last_tool_result,
            available_tools=["search_fact_db", "check_policy_db", "request_human_review", "submit_decision"],
            agent_score_deductions=self.agent_score_deductions
        )

    def step(self, action: Action) -> tuple[Observation, Reward]:
        # Loop Check
        if action.tool_name in ["search_fact_db", "check_policy_db"]:
            if any(call["name"] == action.tool_name and call["args"] == action.tool_args for call in self.grader.tool_calls):
                self.agent_score_deductions += 0.1

        self.step_count += 1
        self.grader.log_tool(action.tool_name, action.tool_args)
        
        is_done = False
        score = 0.0
        info_msg = ""
        
        if self.step_count >= self.max_steps:
            is_done = True
            info_msg = "Max steps reached."
            self.last_tool_result = "ERROR: Episode terminated due to max active steps."
        else:
            if action.tool_name == "search_fact_db":
                query = action.tool_args.get("query", "")
                self.last_tool_result = f"Fact Check Result: {self.grader.search_fact_db(query)}"
                info_msg = "Searched facts."
            elif action.tool_name == "check_policy_db":
                query = action.tool_args.get("query", "")
                self.last_tool_result = f"Policy DB Result: {self.grader.check_policy_db(query)}"
                info_msg = "Checked policy."
            elif action.tool_name == "request_human_review":
                self.agent_score_deductions += 0.25
                self.last_tool_result = self.grader.get_human_review()
                info_msg = "Consulted human reviewer. High cost penalty applied."
            elif action.tool_name == "submit_decision":
                label = action.tool_args.get("label", "")
                reasoning = action.tool_args.get("reasoning", "")
                confidence_score = action.tool_args.get("confidence_score", 100)
                
                base_score = self.grader.evaluate_submission(label, reasoning, confidence_score)
                final_score = max(base_score - self.agent_score_deductions, 0.0)
                
                self.last_tool_result = f"Decision submitted. Final Score: {final_score}"
                is_done = True
                score = final_score
                info_msg = f"Task completed."
            else:
                self.last_tool_result = "Invalid tool name provided."
                info_msg = "Error: Invalid tool."
                
        obs = self.get_state()
        reward = Reward(score=score, is_done=is_done, info={"message": info_msg, "step": self.step_count, "deductions": self.agent_score_deductions})
        return obs, reward
