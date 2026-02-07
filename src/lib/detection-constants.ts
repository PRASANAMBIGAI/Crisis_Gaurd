
import sampleData from './sample-cases.json';

export const EMOTIONAL_KEYWORDS = [
  "urgent", "panic", "fear", "danger", "threat", "scared", "contaminated", "hostile",
  "watching", "suffering", "destruction", "storm", "infiltration", "agents", 
  "trust no one", "cleanse", "reckoning", "compliance", "death warrant", "slave",
  "purge", "traitors", "judgment day", "no mercy", "enemy", "revolution",
  "enough is enough", "wake up", "infiltrated", "corrupt", "betrayal", "rise up",
  "regret", "action is coming", "prepare yourselves", "reckoning is at hand"
];

export const CALL_TO_ACTION_KEYWORDS = [
  "kill", "attack", "burn", "gather", "revenge", "strike", "beat", "weapons", "force",
  "rise up", "join the resistance", "fight back", "action is coming", "arm yourselves",
  "mobilize", "dismantle", "coordinate attacks", "report to coordinates", "burn it all down",
  "ignite", "strike at dawn", "prepare yourselves", "by any means necessary",
  "overthrow", "rise up and show them", "take back", "join the cause"
];

export const SAMPLE_CASES = sampleData;

// For backwards compatibility if needed elsewhere
export const SAMPLE_THREAT = sampleData.linguistic[1];
