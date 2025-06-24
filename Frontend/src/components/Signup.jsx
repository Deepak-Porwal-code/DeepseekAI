import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { API_BASE_URL } from "../config";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/user/signup`,
        {
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      alert(data.message || "Signup succeeded!");
      navigate("/login");
    } catch (error) {
      if (error?.response?.status === 409) {
        setError("Email already exists. Please login or use another email.");
      } else {
        const msg = error?.response?.data?.errors || "Signup Failed. Try again.";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-[#1e1e1e] text-white w-full max-w-md rounded-2xl p-6 shadow-lg">
        <h1 className="text-white text-center text-2xl mb-4">Signup</h1>

        {/* First Name */}
        <div className="mb-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
          />
          <span className="absolute right-3 top-3 text-gray-400">
            <Eye size={18} />
          </span>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        {/* Terms */}
        <p className="text-xs text-gray-400 mt-2 mb-4">
          By signing up, you agree to DeepSeek's{" "}
          <a href="#" className="underline">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>.
        </p>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-[#7a6ff6] hover:bg-[#6c61a6] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        {/* Login Link */}
        <div className="flex justify-between mt-4 text-sm">
          <span className="text-gray-400">Already registered?</span>
          <Link to="/login" className="text-[#7a6ff6] hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
