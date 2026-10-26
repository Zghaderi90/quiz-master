import { useSearchParams } from "react-router";

export default function QuizPage() {
  const [searchParams] = useSearchParams();

  return (
    <section>
      <h1>Quiz</h1>
      <p>Settings received: {searchParams.toString()}</p>
    </section>
  );
}