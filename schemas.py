from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class Observation(BaseModel):
    task_id: int = Field(..., description="The ID of the current task.")
    post_text: str = Field(..., description="The text of the social media post to analyze.")
    post_author: str = Field(..., description="The handle or name of the post author.")
    media_description: Optional[str] = Field(None, description="A text description of any attached media, if applicable.")
    previous_tool_result: Optional[str] = Field(None, description="Textual result from the previously executed tool, if any.")
    available_tools: List[str] = Field(..., description="A list of tools the agent can currently call: 'search_fact_db', 'check_policy_db', 'request_human_review', 'submit_decision'")
    agent_score_deductions: float = Field(0.001, description="Penalty points tracking loop costs (-0.1) or human escalation (-0.25).")

class Action(BaseModel):
    tool_name: str = Field(..., description="The name of the tool to execute.")
    tool_args: Dict[str, Any] = Field(default_factory=dict, description="A JSON dictionary of arguments for the tool.")

class Reward(BaseModel):
    score: float = Field(0.1, description="The current graded score of the task. Range 0.1 to 0.9.")
    is_done: bool = Field(False, description="Whether the episode is complete.")
    info: Dict[str, Any] = Field(default_factory=dict, description="Metadata and progress info over the episode.")
