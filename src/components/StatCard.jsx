import { Card } from "react-bootstrap";

export default function StatCard({ icon, value, label }) {
  return (
    <Card className="h-100 text-center shadow-sm">
      <Card.Body>
        <div className="fs-3" aria-hidden="true">
          {icon}
        </div>
        <div className="fs-3 fw-bold">{value}</div>
        <div className="text-muted small">{label}</div>
      </Card.Body>
    </Card>
  );
}