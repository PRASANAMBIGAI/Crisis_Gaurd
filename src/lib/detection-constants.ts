
import sampleData from './sample-cases.json';

export const EMOTIONAL_KEYWORDS = ["urgent", "panic", "fear", "danger", "threat", "scared", "contaminated", "hostile"];
export const CALL_TO_ACTION_KEYWORDS = ["kill", "attack", "burn", "gather", "revenge", "strike", "beat", "weapons", "force"];

export const SAMPLE_CASES = sampleData;

// For backwards compatibility if needed elsewhere
export const SAMPLE_THREAT = sampleData.linguistic[0];
