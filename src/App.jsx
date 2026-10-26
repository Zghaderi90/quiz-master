import { Routes, Route } from "react-router";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import StatsPage from "./pages/StatsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <>
      <NavBar />
      <Container as="main" className="py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  );
}