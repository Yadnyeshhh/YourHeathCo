import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/login");
  };

  return (
    <header className="bg-[#0B1E2D] text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#00D09C] flex items-center justify-center font-bold text-slate-950 text-xs tracking-tighter">
          YH
        </div>
        <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-slate-300 font-semibold">
          <span>YOURHEALTHCO</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">ADMIN CONSOLE</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
            location.pathname === "/admin"
              ? "bg-slate-700 text-white"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Patients
        </button>
        <button
          onClick={() => navigate("/addpatient")}
          className="text-xs bg-[#00D09C]/10 text-[#00D09C] hover:bg-[#00D09C]/20 border border-[#00D09C]/30 px-3.5 py-1.5 rounded-full font-medium transition"
        >
          + Add Patient
        </button>
        <button
          onClick={handleLogout}
          className="text-xs text-slate-400 hover:text-red-400 px-2 py-1.5 font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
