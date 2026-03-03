import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate()

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await api.post("auth/register/", { username, email, password });
      alert("Registration successful! You can now login.");
      navigate('/login')
      
    } catch (err) {
      alert("Registration failed. Try again.");
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
          Create your account
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Join EventX to discover and book amazing events
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="Choose a username"
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
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="Create a secure password"
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
          Create account
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-8">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-black font-medium hover:underline"
        >
          Login
        </a>
      </p>
    </div>
  </div>
);

}

export default Register;
