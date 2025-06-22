import React from "react";
import { LogOut, X } from "lucide-react";
import userImg from "../assets/user.png"; // renamed to avoid variable name conflict
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = ({ onClose }) => {
  const userperson = JSON.parse(localStorage.getItem("user"));
  const [, setAuthUser] = useAuth();
  const navigate = useNavigate();

  const HandleLogout = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/v1/user/logout", {
        withCredentials: true,
      });

      // Clear localStorage and auth state
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setAuthUser(null);

      alert(data.message || "Logout successful");
      navigate("/Login");
    } catch (error) {
      const msg = error?.response?.data?.error || "Logout failed";
      alert(msg);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#232327]">
      {/* Header */}
      <div className="flex border-b border-gray-600 p-2 justify-between items-center mb-4">
        <div className="text-2xl font-bold text-gray-200">deepseek</div>
        <button onClick={onClose}>
          <X className="w-6 h-6 text-gray-400 md:hidden" />
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        <button
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl mb-4"
        >
          + New Chat
        </button>
        <div className="text-gray-500 text-sm mt-20 text-center">
          No chat history yet
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src={userImg} alt="user" className="rounded-full w-8 h-8" />
            <span className="text-gray-300">
              {userperson?.firstname || "My Profile"}
            </span>
          </div>
          <button
            onClick={HandleLogout}
            className="flex items-center gap-3 text-white px-2 py-2 rounded-lg hover:bg-gray-700 duration-300 transition"
          >
            <LogOut />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
