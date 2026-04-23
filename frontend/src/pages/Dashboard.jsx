import { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");

useEffect(() => {
  setLoading(true);

  api
    .get(`/api/data-items?page=${page}&size=5&sort=${sortBy},${order}`)
    .then((res) => {
      if (Array.isArray(res.data)) {
        setData(res.data); // fallback if pagination not implemented in backend
      } else {
        setData(res.data.content); // Spring Page format
      }

      setLoading(false);
    })
    .catch((err) => {
      console.error("API failed, using dummy data");

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
}, [page, sortBy, order]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">List Page</h1>

      <table className="w-full border border-gray-300">
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
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No data available
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.description}</td>
                <td className="border p-2">{item.category}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          className="bg-gray-300 px-3 py-1 rounded"
        >
        Prev
        </button>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-300 px-3 py-1 rounded"
        >
        Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;