import { Link } from "react-router";
import { Button } from "react-bootstrap";

export default function HomePage() {
  return (
    <section>
      <h1>Quiz Master</h1>
      <p>Choose a category and test your knowledge!</p>
      <Button as={Link} to="/quiz">Start quiz</Button>
    </section>
  );
}
