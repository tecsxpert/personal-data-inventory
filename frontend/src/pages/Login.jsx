import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const { login } = useAuth(); // ✅ get login from context

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fakeToken = "dummy-jwt-token";

    login(fakeToken); // ✅ use context instead of localStorage

    console.log("Logged in:", form);
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 px-4">
    
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
      
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-700">
        Login
      </h1>

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

        {/* Button */}
        <button className="w-full px-4 py-2 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition">
          Login
        </button>

      </form>
    </div>
  </div>
);
};

export default Login;