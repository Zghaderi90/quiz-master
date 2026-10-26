import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>
        That page doesn't exist. <Link to="/">Go back home</Link>
      </p>
    </section>
  );
}