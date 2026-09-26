import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, Utensils, Pill, Stethoscope, User, LogOut } from "lucide-react";
import { clearPatientSession } from "../../../utils/auth.js";

export default function Sidebar({ profile }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearPatientSession();
    navigate("/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/pdashboard" },
    { icon: Utensils, label: "Meals", href: "/meals" },
    { icon: Pill, label: "Meds", href: "/meds" },
    { icon: Calendar, label: "Appointments", href: "/appointments" },
    { icon: Stethoscope, label: "Doctors", href: "/doctors" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex shrink-0">
      <div>
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight text-jade">YourHealthCo</h2>
        </div>
        <nav className="mt-2 px-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                  isActive
                    ? "bg-jade/15 text-jade font-semibold"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`size-5 ${isActive ? "text-jade" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-4 px-2">
          {profile?.profileImage ? (
            <img 
              src={profile.profileImage.startsWith('http') ? profile.profileImage : `http://localhost:3000/${profile.profileImage}`} 
              alt="Profile" 
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <img 
              src="/profile.png" 
              alt="Default Profile" 
              className="size-10 rounded-full object-cover bg-slate-100"
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate w-32">{profile?.name || "No name provided"}</span>
            <Link to="/profile" className="text-xs text-slate-500 hover:text-jade transition-colors">Settings</Link>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="size-5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
