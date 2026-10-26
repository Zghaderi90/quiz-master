import he from "he";

const BASE_URL = "https://opentdb.com";

// Gets the list of quiz categories from Open Trivia DB
export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/api_category.php`);

  if (!response.ok) {
    throw new Error(`Server error (${response.status})`);
  }

  const data = await response.json();

  // Sort the categories alphabetically by name
  return data.trivia_categories.sort((a, b) => a.name.localeCompare(b.name));
}

// Friendly messages for the API's response codes
const ERROR_MESSAGES = {
  1: "There aren't enough questions for these settings. Try fewer questions, another difficulty or a different category.",
  2: "Some quiz settings were invalid. Please go back and choose again.",
  5: "Too many requests right now. Please wait a few seconds and try again.",
};

// Waits for the given number of milliseconds
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Returns a shuffled copy of an array (Fisher–Yates shuffle)
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Turns one question from the API into a cleaner object for our app
function prepareQuestion(apiQuestion, index) {
  const correctAnswer = he.decode(apiQuestion.correct_answer);
  const incorrectAnswers = apiQuestion.incorrect_answers.map((answer) => he.decode(answer));

  return {
    id: index,
    question: he.decode(apiQuestion.question),
    category: he.decode(apiQuestion.category),
    difficulty: apiQuestion.difficulty,
    type: apiQuestion.type,
    correctAnswer,
    // True/False always in the same order; multiple choice shuffled
    answers:
      apiQuestion.type === "boolean"
        ? ["True", "False"]
        : shuffle([correctAnswer, ...incorrectAnswers]),
  };
}

// Sends the request, and retries if the API says we're going too fast
async function requestQuestions(url) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response;
    try {
      response = await fetch(url);
    } catch {
      throw new Error("Could not connect to the quiz server. Check your internet connection.");
    }

    const rateLimited = response.status === 429;
    if (!response.ok && !rateLimited) {
      throw new Error(`The quiz server had a problem (${response.status}). Please try again later.`);
    }

    const data = rateLimited ? { response_code: 5 } : await response.json();

    if (data.response_code === 0) {
      return data.results.map(prepareQuestion);
    }

    // Rate limit: wait 5 seconds and try again
    if (data.response_code === 5 && attempt < maxAttempts) {
      await wait(5000);
      continue;
    }

    throw new Error(ERROR_MESSAGES[data.response_code] ?? "Something went wrong while loading the questions.");
  }
}

// Requests that are already on their way (to avoid sending the same one twice)
const pendingRequests = new Map();

// Gets quiz questions with the user's settings
export function fetchQuestions({ amount, category, difficulty, type }) {
  const params = new URLSearchParams({ amount });
  if (category) params.set("category", category);
  if (difficulty) params.set("difficulty", difficulty);
  if (type) params.set("type", type);

  const url = `${BASE_URL}/api.php?${params}`;

  // If the exact same request is already running, reuse it instead of sending a new one
  if (!pendingRequests.has(url)) {
    const request = requestQuestions(url).finally(() => pendingRequests.delete(url));
    pendingRequests.set(url, request);
  }

  return pendingRequests.get(url);
}