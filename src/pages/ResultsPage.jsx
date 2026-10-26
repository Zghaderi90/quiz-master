import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Alert, Badge, Button, Card, Col, ListGroup, ProgressBar, Row } from "react-bootstrap";
import confetti from "canvas-confetti";

// Short message based on how well the player did
function getFeedback(percentage) {
  if (percentage === 100) return { text: "Perfect score! 🏆", variant: "success" };
  if (percentage >= 80) return { text: "Excellent work! 🎉", variant: "success" };
  if (percentage >= 50) return { text: "Good job! 👍", variant: "info" };
  return { text: "Keep practising! 💪", variant: "warning" };
}

export default function ResultsPage() {
  const location = useLocation();
  const result = location.state?.result;

  const percentage = result ? Math.round((result.score / result.total) * 100) : 0;

  // Confetti for good scores
  useEffect(() => {
    if (percentage >= 80) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        disableForReducedMotion: true, // respects users who turned off animations
      });
    }
  }, [percentage]);

  // Someone opened /results directly, without playing
  if (!result) {
    return (
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Alert variant="info">
            <Alert.Heading>No results yet</Alert.Heading>
            <p>Play a quiz first and your results will appear here.</p>
            <Button as={Link} to="/">
              Start a quiz
            </Button>
          </Alert>
        </Col>
      </Row>
    );
  }

  const feedback = getFeedback(percentage);

  return (
    <Row className="justify-content-center">
      <Col md={10} lg={8}>
        {/* Score summary */}
        <Card className="shadow-sm text-center mb-4">
          <Card.Body className="py-4">
            <h1 className="h3">{feedback.text}</h1>
            <p className="display-4 fw-bold mb-1">
              {result.score} / {result.total}
            </p>
            <p className="text-muted">{percentage}% correct</p>
            <ProgressBar
              now={percentage}
              variant={feedback.variant}
              className="mb-3"
              aria-label="Score"
            />
            <p className="mb-4">
              <Badge bg="secondary" className="me-1">
                {result.category}
              </Badge>
              <Badge bg="light" text="dark" className="text-capitalize">
                {result.difficulty} difficulty
              </Badge>
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Button as={Link} to={`/quiz?${result.settings}`}>
                🔁 Play again
              </Button>
              <Button as={Link} to="/" variant="outline-primary">
                New quiz
              </Button>
              <Button as={Link} to="/stats" variant="outline-secondary">
                📊 View stats
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Review of every answer */}
        <h2 className="h4 mb-3">Review your answers</h2>
        <ListGroup className="shadow-sm">
          {result.answers.map((answer, index) => (
            <ListGroup.Item key={index} className="py-3">
              <p className="fw-semibold mb-2">
                {answer.isCorrect ? "✅" : "❌"} {index + 1}. {answer.question}
              </p>
              <p className="mb-0 small">
                Your answer:{" "}
                <span className={answer.isCorrect ? "text-success fw-semibold" : "text-danger fw-semibold"}>
                  {answer.selectedAnswer}
                </span>
                {!answer.isCorrect && (
                  <>
                    {" "}
                    · Correct answer:{" "}
                    <span className="text-success fw-semibold">{answer.correctAnswer}</span>
                  </>
                )}
              </p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
    </Row>
  );
}