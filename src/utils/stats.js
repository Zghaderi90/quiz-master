// Shorter category names for charts, e.g. "Entertainment: Video Games" → "Video Games"
export function shortCategory(name) {
  return name.replace("Entertainment: ", "").replace("Science: ", "");
}

// Percentage score of one quiz result
export function getPercentage(result) {
  return Math.round((result.score / result.total) * 100);
}

// Numbers for the summary cards
export function getSummary(history) {
  const totalQuestions = history.reduce((sum, result) => sum + result.total, 0);
  const totalCorrect = history.reduce((sum, result) => sum + result.score, 0);

  return {
    quizzes: history.length,
    questions: totalQuestions,
    average: totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    best: Math.max(...history.map(getPercentage)),
  };
}

// Data for the line chart: the last 20 quizzes
export function getScoreTimeline(history) {
  const start = Math.max(0, history.length - 20);
  return history.slice(start).map((result, index) => ({
    label: `#${start + index + 1}`,
    score: getPercentage(result),
  }));
}

// Data for the bar chart: accuracy per category, best first
export function getCategoryAccuracy(history) {
  const totals = {};

  for (const result of history) {
    for (const answer of result.answers) {
      const category = shortCategory(answer.category);
      if (!totals[category]) totals[category] = { correct: 0, total: 0 };
      totals[category].total += 1;
      if (answer.isCorrect) totals[category].correct += 1;
    }
  }

  return Object.entries(totals)
    .map(([category, { correct, total }]) => ({
      category,
      accuracy: Math.round((correct / total) * 100),
    }))
    .sort((a, b) => b.accuracy - a.accuracy);
}