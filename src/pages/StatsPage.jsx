import { useState } from "react";
import { Link } from "react-router";
import { Alert, Button, Card, Col, Modal, Row, Table } from "react-bootstrap";
import StatCard from "../components/StatCard";
import ScoreChart from "../components/ScoreChart";
import CategoryChart from "../components/CategoryChart";
import { clearHistory, loadHistory } from "../utils/storage";
import {
  getCategoryAccuracy,
  getPercentage,
  getScoreTimeline,
  getSummary,
} from "../utils/stats";

export default function StatsPage() {
  // Read saved history once, when the page opens
  const [history, setHistory] = useState(() => loadHistory());
  const [showConfirm, setShowConfirm] = useState(false);

  function handleClear() {
    clearHistory();
    setHistory([]);
    setShowConfirm(false);
  }

  // No quizzes played yet
  if (history.length === 0) {
    return (
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="mb-3">My Stats</h1>
          <Alert variant="info">
            <Alert.Heading>No stats yet</Alert.Heading>
            <p>Play your first quiz and your progress will show up here.</p>
            <Button as={Link} to="/">
              Start a quiz
            </Button>
          </Alert>
        </Col>
      </Row>
    );
  }

  const summary = getSummary(history);
  const timeline = getScoreTimeline(history);
  const categories = getCategoryAccuracy(history);
  const recent = [...history].reverse().slice(0, 10); // newest first

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="mb-0">My Stats</h1>
        <Button variant="outline-danger" size="sm" onClick={() => setShowConfirm(true)}>
          🗑️ Clear history
        </Button>
      </div>

      {/* Summary cards: 2 per row on phones, 4 on larger screens */}
      <Row xs={2} md={4} className="g-3 mb-4">
        <Col>
          <StatCard icon="🎮" value={summary.quizzes} label="Quizzes played" />
        </Col>
        <Col>
          <StatCard icon="❓" value={summary.questions} label="Questions answered" />
        </Col>
        <Col>
          <StatCard icon="🎯" value={`${summary.average}%`} label="Average score" />
        </Col>
        <Col>
          <StatCard icon="🏆" value={`${summary.best}%`} label="Best score" />
        </Col>
      </Row>

      {/* Charts: side by side on large screens, stacked on smaller ones */}
      <Row className="g-4 mb-4">
        <Col lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h2 className="h5">Score over time</h2>
              <p className="text-muted small">Your last {timeline.length} quizzes</p>
              <ScoreChart data={timeline} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h2 className="h5">Accuracy by category</h2>
              <p className="text-muted small">Your strongest topics are at the top</p>
              <CategoryChart data={categories} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent quizzes table */}
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="h5 mb-3">Recent quizzes</h2>
          <Table responsive hover className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th className="text-end">Score</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((result) => (
                <tr key={result.id}>
                  <td>
                    {new Date(result.date).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td>{result.category}</td>
                  <td className="text-capitalize">{result.difficulty}</td>
                  <td className="text-end fw-semibold">
                    {result.score}/{result.total} ({getPercentage(result)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Confirmation popup before deleting */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Clear all history?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This deletes all your saved quiz results. This can't be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClear}>
            Delete history
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}