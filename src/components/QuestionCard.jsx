import { Alert, Badge, Button, Card, ProgressBar } from "react-bootstrap";

const difficultyColors = { easy: "success", medium: "warning", hard: "danger" };

export default function QuestionCard({ question, number, total, selectedAnswer, onAnswer }) {
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correctAnswer;

  // Decides the button color after the user answers
  function getVariant(answer) {
    if (!answered) return "outline-primary";
    if (answer === question.correctAnswer) return "success";
    if (answer === selectedAnswer) return "danger";
    return "outline-secondary";
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
          <span className="text-muted">
            Question {number} of {total}
          </span>
          <div className="d-flex flex-wrap gap-1">
            <Badge bg="secondary">{question.category}</Badge>
            <Badge
              bg={difficultyColors[question.difficulty]}
              text={question.difficulty === "medium" ? "dark" : undefined}
              className="text-capitalize"
            >
              {question.difficulty}
            </Badge>
          </div>
        </div>

        <ProgressBar now={(number / total) * 100} className="mb-4" aria-label="Quiz progress" />

        <Card.Title as="h2" className="h4 mb-4">
          {question.question}
        </Card.Title>

        <div className="d-grid gap-2">
          {question.answers.map((answer) => (
            <Button
              key={answer}
              variant={getVariant(answer)}
              size="lg"
              className="answer-btn text-start"
              disabled={answered}
              onClick={() => onAnswer(answer)}
            >
              {answer}
            </Button>
          ))}
        </div>

        {answered && (
          <Alert variant={isCorrect ? "success" : "danger"} className="mt-3 mb-0" role="status">
            {isCorrect ? (
              "✅ Correct!"
            ) : (
              <>
                ❌ Not quite. The correct answer is <strong>{question.correctAnswer}</strong>.
              </>
            )}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}