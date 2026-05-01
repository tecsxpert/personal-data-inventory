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
  <div className="p-6 max-w-2xl mx-auto">
    
    {/* Back */}
    <button
      onClick={() => navigate(-1)}
      className="mb-5 px-4 py-2 rounded text-sm font-medium bg-gray-300 hover:bg-gray-400 text-black"
    >
      ← Back
    </button>

    <h2 className="text-2xl font-semibold mb-5">Item Details</h2>

    {/* Details Card */}
    <div className="border rounded-lg p-5 shadow-sm space-y-3 bg-white">
      <p><span className="font-medium">ID:</span> {data.id}</p>
      <p><span className="font-medium">Name:</span> {data.name}</p>
      <p><span className="font-medium">Description:</span> {data.description}</p>
      <p><span className="font-medium">Category:</span> {data.category}</p>

      <p>
        <span className="font-medium">Status:</span>{" "}
        <span
          className={`ml-2 px-2 py-1 rounded text-xs font-medium text-white ${
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

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={() => navigate(`/edit/${data.id}`)}
          className="px-4 py-2 rounded text-sm font-medium bg-yellow-400 hover:bg-yellow-500 text-black"
        >
          Edit
        </button>

        <button
          onClick={() => alert("Delete clicked")}
          className="px-4 py-2 rounded text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
        >
          Delete
        </button>
      </div>
    </div>

    {/* AI Section */}
    <div className="mt-6 border rounded-lg p-5 shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-3">AI Analysis</h3>

      <button
        onClick={handleAskAI}
        className="px-4 py-2 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
      >
        Ask AI
      </button>

      {aiLoading ? (
        <p className="mt-3 text-blue-500 text-sm">
          Generating AI insights...
        </p>
      ) : aiResponse ? (
        <div className="mt-4 space-y-2 text-sm">
          <p><span className="font-medium">Summary:</span> {aiResponse.summary}</p>
          <p><span className="font-medium">Risk:</span> {aiResponse.risk}</p>
          <p><span className="font-medium">Recommendation:</span> {aiResponse.recommendation}</p>

          <button
            onClick={handleAskAI}
            className="mt-2 px-3 py-1 rounded text-sm font-medium bg-gray-400 hover:bg-gray-500 text-white"
          >
            Retry
          </button>
        </div>
      ) : (
        <p className="mt-3 text-gray-500 text-sm">
          AI insights will appear here...
        </p>
      )}
    </div>
  </div>
);
}