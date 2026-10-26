import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Alert, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { fetchCategories } from "../services/triviaApi";

export default function HomePage() {
  const navigate = useNavigate();

  // Data from the API
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // The user's choices in the form
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState(10);

  // Load categories when the page opens (and again when "Try again" is clicked)
  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const list = await fetchCategories();
        if (!ignore) setCategories(list);
      } catch {
        if (!ignore) {
          setError("Could not load categories. Check your internet connection and try again.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadCategories();

    // Cleanup: if the page closes before the answer arrives, ignore the answer
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  function handleRetry() {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }

  function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page

    // Put the settings in the address, e.g. /quiz?amount=10&category=9
    const params = new URLSearchParams({ amount });
    if (category) params.set("category", category);
    if (difficulty) params.set("difficulty", difficulty);
    if (type) params.set("type", type);

    navigate(`/quiz?${params}`);
  }

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <div className="text-center mb-4">
          <h1>🧠 Quiz Master</h1>
          <p className="lead">Pick a topic, set the difficulty and test your knowledge!</p>
        </div>

        <Card className="shadow-sm">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {/* Category */}
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Category</Form.Label>
                {loading ? (
                  <div className="d-flex align-items-center gap-2 text-muted">
                    <Spinner animation="border" size="sm" role="status" />
                    Loading categories…
                  </div>
                ) : (
                  <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Any category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Form.Select>
                )}
                {error && (
                  <Alert variant="danger" className="mt-2 d-flex justify-content-between align-items-center gap-2">
                    <span>{error}</span>
                    <Button size="sm" variant="outline-danger" onClick={handleRetry}>
                      Try again
                    </Button>
                  </Alert>
                )}
              </Form.Group>

              <Row>
                {/* Difficulty */}
                <Col sm={6}>
                  <Form.Group className="mb-3" controlId="difficulty">
                    <Form.Label>Difficulty</Form.Label>
                    <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                      <option value="">Any difficulty</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Question type */}
                <Col sm={6}>
                  <Form.Group className="mb-3" controlId="type">
                    <Form.Label>Question type</Form.Label>
                    <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                      <option value="">Any type</option>
                      <option value="multiple">Multiple choice</option>
                      <option value="boolean">True / False</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Number of questions */}
              <Form.Group className="mb-4" controlId="amount">
                <Form.Label>
                  Number of questions: <strong>{amount}</strong>
                </Form.Label>
                <Form.Range
                  min={5}
                  max={20}
                  step={5}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </Form.Group>

              <Button type="submit" size="lg" className="w-100">
                Start quiz
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}