import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Analytics() {
    const chartData = [
    { name: "Jan", value: 10 },
    { name: "Feb", value: 20 },
    { name: "Mar", value: 15 },
    { name: "Apr", value: 25 },
    ];
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Analytics Page</h2>
        <BarChart width={400} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
        </BarChart>
    </div>
  );
}