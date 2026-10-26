import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function CategoryChart({ data }) {
  // Taller chart when there are more categories
  const height = Math.max(200, data.length * 45);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} unit="%" />
        <YAxis type="category" dataKey="category" width={110} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
        <Bar dataKey="accuracy" fill="#198754" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}