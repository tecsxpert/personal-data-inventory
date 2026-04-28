import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie,
  XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { useState } from "react";

export default function Analytics() {
    const [period, setPeriod] = useState("6m");
    const chartData = [
    { name: "Jan", value: 10 },
    { name: "Feb", value: 20 },
    { name: "Mar", value: 15 },
    { name: "Apr", value: 25 },
    ];
    
  return (
  <div className="p-6 max-w-6xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>

    {/* Period Selector */}
    <div className="mb-6">
      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="1m">Last 1 Month</option>
        <option value="3m">Last 3 Months</option>
        <option value="6m">Last 6 Months</option>
      </select>
    </div>

    {/* Charts Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Bar Chart */}
      <div className="border rounded p-4 shadow">
        <h3 className="mb-2 font-semibold">Bar Chart</h3>
        <div className="flex justify-center">
        <BarChart width={350} height={250} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
        </div>
      </div>

      {/* Line Chart */}
      <div className="border rounded p-4 shadow">
        <h3 className="mb-2 font-semibold">Line Chart</h3>
        <div className="flex justify-center">
        <LineChart width={350} height={250} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" />
        </LineChart>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="border rounded p-4 shadow md:col-span-2">
        <h3 className="mb-2 font-semibold">Pie Chart</h3>
        <div className="flex justify-center">
        <PieChart width={400} height={250}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
          />
          <Tooltip />
        </PieChart>
        </div>
      </div>

    </div>
  </div>
);
}