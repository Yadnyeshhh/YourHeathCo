import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { getProfile } from "../../services/userService";

export function DashboardLayout({ children, profile: initialProfile }) {
  const [profile, setProfile] = useState(initialProfile || null);

  useEffect(() => {
    if (!profile) {
      getProfile().then(res => setProfile(res?.data || res)).catch(console.error);
    }
  }, [profile]);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar profile={profile} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
