const STORAGE_KEY = "quiz-master-history";
const MAX_RESULTS = 100;

// Reads all saved quiz results (oldest first)
export function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    // Storage blocked or data broken: start with an empty history
    return [];
  }
}

// Adds one quiz result to the history
export function saveResult(result) {
  const history = [...loadHistory(), result].slice(-MAX_RESULTS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // If saving fails (e.g. private mode), the app still works, just without history
  }
}

// Deletes all saved results
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do
  }
}