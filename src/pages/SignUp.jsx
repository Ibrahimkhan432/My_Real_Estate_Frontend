import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Oath from "../components/Oath";
import { BASE_URL } from "../constant/constant.js";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userName: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        if (data.message.includes("duplicate") || data.message.includes("exist")) {
          toast.error("User with this email already exists");
        }
        else {
          toast.error(data.message || "Failed to create an account");
        }
        return;
      }
      toast.success("Account created successfully")
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            id="userName"
            type="text"
            placeholder="Enter your name"
            value={formData.userName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`cursor-pointer w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-semibold transition duration-200
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-800 hover:bg-blue-700"}
          `}
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
          )}
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        {/* Google Signup */}
        {/* OAuth */}
        <Oath />

        {/* Sign In link */}
        <p className="text-sm text-center text-gray-600 mt-3">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-blue-500 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
