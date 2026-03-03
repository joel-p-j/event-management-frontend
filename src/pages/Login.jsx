import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await api.post("auth/login/", { username, password });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      const userRes = await api.get("auth/user/");
      setUser(userRes.data);

      if (userRes.data.role==='admin'){
        navigate('/admin/dashboard')
      }
      else{
        navigate('/events')
      }
    } catch (err) {
      alert("Invalid username or password");
    }
  }

  return (
  <div className="min-h-screen relative flex items-center justify-center bg-white overflow-hidden">

    <div className="absolute inset-0 bg-gradient-to-br from-[#f7f7f7] via-white to-[#f2f2f2]" />

    <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-3xl" />
    <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-indigo-200/40 rounded-full blur-3xl" />

    <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl px-8 py-10">

      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Sign in to explore and book amazing events
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
              w-full h-11 px-4
              rounded-lg
              border border-gray-300
              text-sm
              focus:outline-none
              focus:ring-2 focus:ring-purple-500/50
              focus:border-purple-500
              bg-white
            "
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full h-11 px-4
              rounded-lg
              border border-gray-300
              text-sm
              focus:outline-none
              focus:ring-2 focus:ring-purple-500/50
              focus:border-purple-500
              bg-white
            "
            required
          />
        </div>

        <button
          type="submit"
          className="
            w-full h-11
            bg-black text-white
            rounded-full
            text-sm font-medium
            hover:bg-gray-900
            transition
          "
        >
          Login
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-8">
        Don’t have an account?{" "}
        <a
          href="/register"
          className="text-black font-medium hover:underline"
        >
          Create one
        </a>
      </p>
    </div>
  </div>
);

}

export default Login;
