import axios from "axios";
import { Eye } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Login = () => {
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();


  const [, setAuthUser] = useAuth();

const handleChange = (e) => {
  const { name, value } = e.target;

  setformData({
      ...formData,
      [name]: value,
    });
};


  const handleSignup = async () => {
    setloading(true);
    seterror("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/user/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      
      alert(data.message || "Login Succeeded");
      localStorage.setItem("user" , JSON.stringify(data.user))
      localStorage.setItem("token" , data.token)
      setAuthUser(data.token);
      navigate("/");
    } catch (error) {
      if (error?.response?.status === 409) {
        seterror("Email already exists. Please login or use a different email.");
      } else {
        const msg = error?.response?.data?.errors || "Signup Failed";
        seterror(msg);
      }
    } finally {
      setloading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-[#1e1e1e] text-white w-full max-w-md rounded-2xl p-6 shadow-lg">
        {/* Heading */}
        <h1 className="text-white items-center justify-center text-center">
          Signup
        </h1>

        {/* email */}
        <div className="mb-4 mt-2">
          <input
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
            type="text"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* password */}
        <div className="mb-4 mt-2 relative">
          <input
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0]"
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />
          <span className=" absolute right-3 top-3 text-gray-400">
            {" "}
            <Eye size={18} />{" "}
          </span>
        </div>
        {/*Error Message */}

        {error && <span className="text-red-600 text-sm mb-4">{error}</span>}

        {/* Terms & Condition */}
        <p className="text-xs text-gray-400 mt-4 mb-6">
          By signing up or logging in, you consent to DeepSeek's{" "}
          <a className="underline" href="">
            Terms of Use
          </a>{" "}
          and{" "}
          <a className=" underline" href="">
            Privacy Policy
          </a>{" "}
          .
        </p>

        {/* Login button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className=" w-full bg-[#7a6ff6] hover:bg-[#6c61a6] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading? "Loging..." : "Login"}
        </button>

        {/* Links */}
        <div className="flex justify-between mt-4 text-sm">
          <a className="text-[#7a6ff6] hover:underline" href="">
            Have't account?
          </a>
          <Link className="text-[#7a6ff6] hover:underline" to={"/Signup"}>
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
