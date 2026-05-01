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
    <h2 className="text-2xl font-semibold mb-6">Analytics Dashboard</h2>

    {/* Period Selector */}
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2 text-gray-600">
        Select Period
      </label>
      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        className="border px-3 py-2 rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="1m">Last 1 Month</option>
        <option value="3m">Last 3 Months</option>
        <option value="6m">Last 6 Months</option>
      </select>
    </div>

    {/* Charts Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Bar Chart */}
      <div className="border rounded-lg p-5 shadow-sm bg-white">
        <h3 className="mb-3 font-medium text-gray-700">Bar Chart</h3>
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
      <div className="border rounded-lg p-5 shadow-sm bg-white">
        <h3 className="mb-3 font-medium text-gray-700">Line Chart</h3>
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
      <div className="border rounded-lg p-5 shadow-sm bg-white md:col-span-2">
        <h3 className="mb-3 font-medium text-gray-700">Pie Chart</h3>
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