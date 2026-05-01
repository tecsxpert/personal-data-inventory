import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

useEffect(() => {
  setLoading(true);

  if (debouncedSearch.trim() !== "") {
    console.log("Searching:", debouncedSearch);
  }

  api
    .get(`/api/data-items?page=${page}&size=5&sort=${sortBy},${order}&search=${debouncedSearch}&status=${status}`)
    .then((res) => {
  if (Array.isArray(res.data)) {
    setData(res.data);
  } else if (Array.isArray(res.data.content)) {
    setData(res.data.content);
  } else {
    setData([]); // fallback safe
  }

  setError(false);
  setLoading(false);
})
    .catch(() => {
  console.error("API not working, using dummy data");
  setError(true);

  setData([
    {
      id: 1,
      name: "Google",
      description: "Search engine",
      category: "Technology",
    },
  ]);

  setLoading(false);
});
}, [page, sortBy, order, debouncedSearch, status]);

  if (loading) {
  return (
    <div className="p-6 space-y-3">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="h-6 bg-gray-300 rounded"></div>
      <div className="h-6 bg-gray-300 rounded"></div>
      <div className="h-6 bg-gray-300 rounded"></div>
    </div>
  );
}

if (error) {
  return (
    <div className="p-6 text-center">
      <p className="text-red-500 mb-3">
        Failed to load data. Please try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
  );
}
const handleExport = () => {
  if (data.length === 0) return;

  const headers = ["ID", "Name", "Description", "Category"];

  const rows = data.map((item) => [
    item.id,
    item.name,
    item.description,
    item.category,
  ]);

  const csvContent =
    headers.join(",") +
    "\n" +
    rows.map((row) => row.join(",")).join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
  <div className="p-6 max-w-6xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">List Page</h1>

    {/* Filters */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      >
        <option value="">All Status</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </select>
    </div>

    {/* Date Filters */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />
    </div>

    {/* Action Buttons */}
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={handleExport}
        className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
      >
        Export CSV
      </button>

      <button
        onClick={() => navigate("/analytics")}
        className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
      >
        Analytics
      </button>
    </div>

    {/* Table Wrapper for Scroll */}
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => {
                setSortBy("name");
                setOrder(order === "asc" ? "desc" : "asc");
              }}
            >
              Name {sortBy === "name" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
            <th className="border p-2">Description</th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => {
                setSortBy("category");
                setOrder(order === "asc" ? "desc" : "asc");
              }}
            >
              Category {sortBy === "category" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-6 text-gray-500">
                No data found. Try adjusting filters or create a new item.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                onClick={() => navigate(`/detail/${item.id}`)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.description}</td>
                <td className="border p-2">{item.category}</td>
                <td className="border p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit/${item.id}`);
                    }}
                    className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    <div className="mt-4 flex justify-between">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        className="bg-gray-300 px-3 py-2 rounded"
      >
        Prev
      </button>

      <button
        onClick={() => setPage((prev) => prev + 1)}
        className="bg-gray-300 px-3 py-2 rounded"
      >
        Next
      </button>
    </div>
  </div>
);
};

export default Dashboard;