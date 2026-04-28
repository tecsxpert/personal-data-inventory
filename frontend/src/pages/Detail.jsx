import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  useEffect(() => {
    api
      .get(`/api/data-items/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        console.error("API failed, using dummy data");

        setData({
          id: id,
          name: "Google",
          description: "Search engine",
          category: "Technology",
          status: "ACTIVE",
        });
      });
  }, [id]);

  const handleAskAI = () => {
    setAiLoading(true);

    setTimeout(() => {
      setAiResponse({
        summary: "This is a sample AI-generated insight.",
        risk: "Low risk",
        recommendation: "No immediate action required.",
      });

      setAiLoading(false);
    }, 1500);
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Detail Page</h2>

      {/* Detail Card */}
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

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => navigate(`/edit/${data.id}`)}
            className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
          >
            Edit
          </button>

          <button
            onClick={() => alert("Delete clicked")}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      {/* AI Section */}
      <div className="mt-6 border rounded p-4 shadow">
        <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>

        <button
          onClick={handleAskAI}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Ask AI
        </button>

        {aiLoading ? (
          <p className="mt-2 text-blue-500">Loading AI response...</p>
        ) : aiResponse ? (
          <div className="mt-3 space-y-2">
            <p><b>Summary:</b> {aiResponse.summary}</p>
            <p><b>Risk:</b> {aiResponse.risk}</p>
            <p><b>Recommendation:</b> {aiResponse.recommendation}</p>

            <button
              onClick={handleAskAI}
              className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 mt-2"
            >
            Retry
            </button>
          </div>
        ) : (
          <p className="mt-2 text-gray-600">
            AI insights will appear here...
          </p>
        )}
      </div>
    </div>
  );
}