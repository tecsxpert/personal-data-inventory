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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />

          <button className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;