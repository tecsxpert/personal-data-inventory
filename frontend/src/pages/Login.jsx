import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // basic validation
    if (!form.username || !form.password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);

    api
      .post("/api/auth/login", form)
      .then((res) => {
        const token = res.data.token;

        login(token); // store token in context/localStorage

        setLoading(false);

        // redirect to dashboard
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        setError("Invalid username or password ❌");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 px-4">
      
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Login
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Demo credentials (optional but very useful) */}
        <div className="mt-6 text-sm text-gray-500 text-center">
          <p><b>Demo Users:</b></p>
          <p>Admin → admin / admin123</p>
          <p>User → user / user123</p>
        </div>

      </div>
    </div>
  );
};

export default Login;