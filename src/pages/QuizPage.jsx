import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import QuestionCard from "../components/QuestionCard";
import { fetchQuestions } from "../services/triviaApi";
import { saveResult } from "../utils/storage";

export default function QuizPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Settings from the address (sent by the Home page)
  const amount = searchParams.get("amount") || "10";
  const category = searchParams.get("category") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const type = searchParams.get("type") || "";

  // Loading the questions
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Playing the quiz
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function loadQuestions() {
      try {
        const list = await fetchQuestions({ amount, category, difficulty, type });
        if (!ignore) setQuestions(list);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadQuestions();

    return () => {
      ignore = true;
    };
  }, [amount, category, difficulty, type, reloadKey]);

  function handleRetry() {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }

  function handleAnswer(answer) {
    if (selectedAnswer !== null) return; // already answered

    const question = questions[currentIndex];
    setSelectedAnswer(answer);
    setUserAnswers((previous) => [
      ...previous,
      {
        question: question.question,
        category: question.category,
        difficulty: question.difficulty,
        correctAnswer: question.correctAnswer,
        selectedAnswer: answer,
        isCorrect: answer === question.correctAnswer,
      },
    ]);
  }

  function finishQuiz() {
    const result = {
      id: Date.now(),
      date: new Date().toISOString(),
      score: userAnswers.filter((a) => a.isCorrect).length,
      total: userAnswers.length,
      // If a category was chosen, all questions are from it
      category: category ? questions[0].category : "Any category",
      difficulty: difficulty || "any",
      type: type || "any",
      settings: searchParams.toString(), // used by "Play again"
      answers: userAnswers,
    };

    saveResult(result);

    // replace: true → the browser's Back button won't return to a finished quiz
    navigate("/results", { replace: true, state: { result } });
  }

  function handleNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((index) => index + 1);
      setSelectedAnswer(null);
    } else {
      finishQuiz();
    }
  }

  // 1) Still loading
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" className="mb-3" />
        <p>Loading questions…</p>
      </div>
    );
  }

  // 2) Something went wrong
  if (error) {
    return (
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Alert variant="danger">
            <Alert.Heading>Couldn't start the quiz</Alert.Heading>
            <p>{error}</p>
            <div className="d-flex flex-wrap gap-2">
              <Button variant="danger" onClick={handleRetry}>
                Try again
              </Button>
              <Button as={Link} to="/" variant="outline-secondary">
                Change settings
              </Button>
            </div>
          </Alert>
        </Col>
      </Row>
    );
  }

  // 3) Show the current question
  const question = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <Row className="justify-content-center">
      <Col md={10} lg={8}>
        <QuestionCard
          question={question}
          number={currentIndex + 1}
          total={questions.length}
          selectedAnswer={selectedAnswer}
          onAnswer={handleAnswer}
        />

        {selectedAnswer !== null && (
          <div className="text-end mt-3">
            <Button size="lg" onClick={handleNext}>
              {isLastQuestion ? "See results" : "Next question →"}
            </Button>
          </div>
        )}
      </Col>
    </Row>
  );
}