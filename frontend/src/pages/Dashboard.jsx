import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // FETCH DATA
  useEffect(() => {
    setLoading(true);

    api
      .get(`/api/data-items/page?page=${page}&size=5&sort=${sortBy},${order}`)
      .then((res) => {
        console.log("API response:", res.data);

        if (res.data && Array.isArray(res.data.content)) {
          setOriginalData(res.data.content);
          setData(res.data.content);
        } else {
          setOriginalData([]);
          setData([]);
        }

        setError(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setError(true);
        setLoading(false);
      });
  }, [page, sortBy, order]);

  // FRONTEND SEARCH + FILTER
  useEffect(() => {
    let filtered = [...originalData];

    // SEARCH
    if (search.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // STATUS FILTER
    if (status !== "") {
      filtered = filtered.filter(
        (item) => item.status === status
      );
    }

    setData(filtered);
  }, [search, status, originalData]);

  // LOADING UI
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

  // ERROR UI
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

  // CSV EXPORT
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

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <button
          onClick={logout}
          className="px-4 py-2 rounded text-white text-sm font-medium bg-red-500 hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* STATUS */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      {/* DATE FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-3 mb-5">

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded text-white text-sm font-medium bg-green-500 hover:bg-green-600"
        >
          Export CSV
        </button>

        <button
          onClick={() => navigate("/analytics")}
          className="px-4 py-2 rounded text-white text-sm font-medium bg-blue-500 hover:bg-blue-600"
        >
          Analytics
        </button>

        <button
          onClick={() => navigate("/create")}
          className="px-4 py-2 rounded text-white text-sm font-medium bg-blue-500 hover:bg-blue-600"
        >
          + Create Item
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded shadow-sm">

        <table className="min-w-full text-sm">

          <thead className="bg-gray-100">
            <tr>

              <th className="p-3 text-left">ID</th>

              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => {
                  setSortBy("name");
                  setOrder(order === "asc" ? "desc" : "asc");
                }}
              >
                Name {sortBy === "name" ? (order === "asc" ? "↑" : "↓") : ""}
              </th>

              <th className="p-3 text-left">Description</th>

              <th
                className="p-3 text-left cursor-pointer"
                onClick={() => {
                  setSortBy("category");
                  setOrder(order === "asc" ? "desc" : "asc");
                }}
              >
                Category {sortBy === "category"
                  ? (order === "asc" ? "↑" : "↓")
                  : ""}
              </th>

              <th className="p-3 text-left">Actions</th>

            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-6 text-gray-500 space-y-2"
                >
                  <p>No data found.</p>

                  <button
                    onClick={() => navigate("/create")}
                    className="px-4 py-2 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    + Create your first item
                  </button>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/detail/${item.id}`)}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-3">{item.id}</td>

                  <td className="p-3 font-medium">
                    {item.name}
                  </td>

                  <td className="p-3">
                    {item.description}
                  </td>

                  <td className="p-3">
                    {item.category}
                  </td>

                  <td className="p-3 space-x-2">

                    {/* EDIT */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        navigate(`/edit/${item.id}`, {
                          state: item,
                        });
                      }}
                      className="px-3 py-1 rounded text-sm font-medium bg-yellow-400 hover:bg-yellow-500 text-black"
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!window.confirm("Delete this item?")) return;

                        api
                          .delete(`/api/data-items/${item.id}`)
                          .then(() => {

                            const updated = originalData.filter(
                              (i) => i.id !== item.id
                            );

                            setOriginalData(updated);
                            setData(updated);
                          })
                          .catch((err) => {
                            console.error(err);
                            alert("Delete failed ❌");
                          });
                      }}
                      className="px-3 py-1 rounded text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-5 flex justify-between items-center">

        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          className="px-4 py-2 rounded text-sm font-medium bg-gray-300 hover:bg-gray-400 text-black"
        >
          Prev
        </button>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 rounded text-sm font-medium bg-gray-300 hover:bg-gray-400 text-black"
        >
          Next
        </button>

      </div>
    </div>
  );
};

export default Dashboard;