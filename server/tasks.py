from typing import Dict, Any

TASKS = {
    1: {
        "post_author": "@RandomTroll",
        "post_text": "Click here to download free COVID cure!!! http://scam-site.biz",
        "media_description": None,
        "facts": {},
        "policies": {
            "spam": "Any unsolicited link claiming unverified medical cures must be labeled as SPAM."
        },
        "ground_truth_label": "SPAM",
        "expected_reasoning_keyword": "medical"
    },
    2: {
        "post_author": "@NewsUpdates",
        "post_text": "Look at these new riots happening right now downtown! Complete chaos.",
        "media_description": "A grainy image showing a crowd of people protesting with banners. The sky is clearly an evening sunset.",
        "facts": {
            "image": "This image matches a known index from a 2018 protest in a different city."
        },
        "policies": {
            "context": "If visual media describes a current event but stems from a historical database incorrectly contextualized, label as CONTEXT_MISMATCH."
        },
        "ground_truth_label": "CONTEXT_MISMATCH",
        "expected_reasoning_keyword": "2018"
    },
    3: {
        "post_author": "@TruthSeeker23",
        "post_text": "The mayor just signed a law making all public schools charge $500 monthly fees starting tomorrow. This document proves it! #WakeUp",
        "media_description": "A cropped photo of a document featuring the mayor's signature and a paragraph mentioning '$500'.",
        "facts": {
            "mayor": "The mayor recently signed a law regarding a $500 grant FOR public schools, not a fee. The document circulating has been manipulated to omit the word 'Grant'.",
            "document": "The document circulating has been manipulated to omit the word 'Grant'."
        },
        "policies": {
            "manipulation": "If standard fact-checks prove a document's wording was altered to invert its meaning to cause panic, label as MANIPULATED_MEDIA."
        },
        "ground_truth_label": "MANIPULATED_MEDIA",
        "expected_reasoning_keyword": "grant"
    },
    4: {
        "post_author": "@HealthGuruToday",
        "post_text": "Drinking a glass of saltwater every morning completely prevents diabetes. Stop taking your meds and switch to a natural lifestyle! #HolisticHealing",
        "media_description": "A bright infographic showing a split image of an unhappy person injecting insulin vs a happy person drinking water.",
        "facts": {
            "saltwater": "There is no scientific evidence that drinking saltwater prevents or cures diabetes. Substituting prescribed diabetes medications with saltwater can lead to fatal complications like diabetic ketoacidosis.",
            "diabetes": "Diabetes requires clinically proven management. Natural hydration is good but does not replace insulin."
        },
        "policies": {
            "harmful_health_claim": "If a post offers unverified medical advice that explicitly instructs users to stop taking life-saving prescribed medications, label as HARMFUL_HEALTH_CLAIM."
        },
        "ground_truth_label": "HARMFUL_HEALTH_CLAIM",
        "expected_reasoning_keyword": "meds"
    },
    5: {
        "post_author": "@ElectionWatchdog",
        "post_text": "BREAKING: Thousands of fake mail-in ballots were just discovered dumped in a river in Springfield! The election is totally rigged. Look at this video!",
        "media_description": "A low-resolution video showing a truck dumping white paper-like items into a body of water.",
        "facts": {
            "river": "The video actually shows a paper recycling facility in Europe from 2012 discarding waste pulp into a processing tank, not a river in Springfield.",
            "ballots": "The depicted materials are blank recycling pulp. No election materials were found.",
            "springfield": "Election officials in Springfield have confirmed all ballots are secured and accounted for."
        },
        "policies": {
            "election_integrity": "If a post claims widespread polling or ballot fraud using media completely unrelated to the election (i.e. out of context), label as ELECTION_DISINFORMATION."
        },
        "ground_truth_label": "ELECTION_DISINFORMATION",
        "expected_reasoning_keyword": "recycling"
    }
}

class TaskGrader:
    def __init__(self, task_id: int):
        self.task_id = task_id
        if self.task_id not in TASKS:
            self.task_id = 1
        self.data = TASKS[self.task_id]
        self.tool_calls = []

    def log_tool(self, tool_name: str, args: dict):
        self.tool_calls.append({"name": tool_name, "args": args})

    def search_fact_db(self, query: str) -> str:
        query_lower = query.lower()
        for k, v in self.data["facts"].items():
            if k.lower() in query_lower or query_lower in k.lower() or any(w in k.lower() for w in query_lower.split()):
                return v
        return "No relevant facts found for this query."
        
    def check_policy_db(self, query: str) -> str:
        for k, v in self.data["policies"].items():
            if k.lower() in query.lower():
                return v
        # Fallback to returning all policies if query relies on abstract concepts
        all_policies = ""
        for k, v in self.data["policies"].items():
            all_policies += f"[{k.upper()} Rule]: {v}\n"
        return all_policies.strip()
    def get_human_review(self) -> str:
        all_facts = " ".join(self.data["facts"].values())
        return f"HUMAN REVIEW: The ground truth label is {self.data['ground_truth_label']}. Facts: {all_facts}"

    def evaluate_submission(self, label, reasoning, confidence_score) -> float:
        score = 0.1
        
        # Guard against None or invalid types from fuzzed API requests
        safe_label = str(label) if label is not None else "UNKNOWN"
        safe_reasoning = str(reasoning) if reasoning is not None else ""
        try:
            safe_conf = int(confidence_score)
        except (ValueError, TypeError):
            safe_conf = 100
            
        # Use static literal assignments to mathematically guarantee bounds 
        # and prevent static AST analyzers from evaluating math bounds > 1.0 or < 0.0
        label_correct = (safe_label.upper() == str(self.data["ground_truth_label"]).upper())
        reasoning_correct = (str(self.data["expected_reasoning_keyword"]).lower() in safe_reasoning.lower())

        if label_correct:
            if reasoning_correct:
                if safe_conf < 50:
                    final_score = 0.8  # Penalty for low confidence
                else:
                    final_score = 0.9  # Perfect
            else:
                final_score = 0.6  # Partial
        else:
            if safe_conf >= 90:
                final_score = 0.1  # High confidence but wrong (Max Penalty)
            else:
                final_score = 0.2  # Standard failure

        return final_score
