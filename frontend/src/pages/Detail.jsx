import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Detail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  api
    .get(`/api/data-items/${id}`)
    .then((res) => {
      setData(res.data);
    })
    .catch((err) => {
      console.error("API failed, using dummy data");

      setData({
  id: id,
  name: "Google",
  description: "Search engine",
  category: "Technology",
  status: "ACTIVE", // ✅ add this
});
    });
}, [id]);

  if (!data) return <p>Loading...</p>;

return (
  <div className="p-6 max-w-xl mx-auto">
    <button
  onClick={() => navigate(-1)}
  className="mb-4 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
>
  ← Back
</button>
    <h2 className="text-2xl font-bold mb-4">Detail Page</h2>

    <div className="border rounded p-4 space-y-2 shadow">
      <p><b>ID:</b> {data.id}</p>
      <p><b>Name:</b> {data.name}</p>
      <p><b>Description:</b> {data.description}</p>
      <p><b>Category:</b> {data.category}</p>
      <p>
  <b>Status:</b>{" "}
  <span
    className={`px-2 py-1 rounded text-white ${
      data.status === "ACTIVE"
        ? "bg-green-500"
        : data.status === "INACTIVE"
        ? "bg-red-500"
        : "bg-gray-500"
    }`}
  >
    {data.status}
  </span>
</p>
    <button
  onClick={() => navigate(`/edit/${data.id}`)}
  className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 mt-3"
>
  Edit
</button>
<button
  onClick={() => alert("Delete clicked")}
  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-3 ml-2"
>
  Delete
</button>
    </div>

    <div className="mt-6 border rounded p-4 shadow">
  <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>

  <button
    onClick={() => alert("AI Analysis coming soon")}
    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
  >
    Ask AI
  </button>

  <p className="mt-2 text-gray-600">
    AI insights will appear here...
  </p>
</div>
  </div>
);
}