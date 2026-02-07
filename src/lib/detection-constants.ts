import sampleData from './sample-cases.json';

export const EMOTIONAL_KEYWORDS = [
  // General volatility
  "urgent", "panic", "fear", "danger", "threat", "contaminated", "watching",
  "destruction", "storm", "reckoning", "purge", "traitors", "no mercy", "enemy",
  "revolution", "rise up", "prepare yourselves",
  // Indian context / Medical Misinfo
  "videshi", "shadyantri", "betrayed", "holy duty", "sacrifice", "protect our women",
  "poison in water", "forced medication", "don't trust the clinic", "illegal immigrants",
  "looting our land", "save our heritage", "wake up before dawn", "they are coming"
];

export const CALL_TO_ACTION_KEYWORDS = [
  // Violence/Mobilization
  "kill", "attack", "burn", "gather", "revenge", "strike", "beat", "weapons", "force",
  "rise up", "join the resistance", "fight back", "arm yourselves", "mobilize",
  "coordinate attacks", "report to coordinates", "burn it all down", "ignite",
  "by any means necessary", "overthrow", "take back", "join the cause",
  // Specific tactical calls
  "reach the chowk", "block the highway", "refuse the drops", "surround the van",
  "show them our strength", "teach them a lesson", "don't let them enter"
];

export const SAMPLE_CASES = sampleData;

export const SAMPLE_THREAT = sampleData.linguistic[1];
