import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/patient-dashboard/DashboardLayout";
import { getProfile, updateUser, uploadProfileImage } from "../../services/userService";

const DEFAULT_IMAGE = "/profile.png";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    bloodGroup: "",
    email: "",
    phone: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const profileRes = await getProfile();
      const userProfile = profileRes?.data || profileRes;
      setProfile(userProfile);
      setFormData({
        name: userProfile?.name || "",
        dob: userProfile?.dob || "",
        bloodGroup: userProfile?.bloodGroup || "",
        email: userProfile?.email || "",
        phone: userProfile?.phone || userProfile?.contact || ""
      });
    } catch (err) {
      console.error("Error fetching profile:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update text fields
      await updateUser(profile._id, {
        name: formData.name,
        dob: formData.dob,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone
      });

      // Upload image if selected
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append("profileImage", selectedFile);
        await uploadProfileImage(fileData);
      }

      await fetchUserData(); // Refresh to get updated data
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-slate-50">
        <p className="text-slate-500 animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  const details = [
    { label: "Patient ID", value: profile?._id ? `#${profile._id.slice(-6).toUpperCase()}` : "N/A" },
    { label: "Date of birth", value: profile?.dob || "Not provided" },
    { label: "Blood type", value: profile?.bloodGroup || "Not provided" },
    { label: "Email", value: profile?.email || "Not provided" },
    { label: "Phone", value: profile?.phone || profile?.contact || "Not provided" },
  ];

  const profileImgSrc = profile?.profileImage 
    ? (profile.profileImage.startsWith('http') ? profile.profileImage : `http://localhost:3000/${profile.profileImage}`) 
    : DEFAULT_IMAGE;

  return (
    <DashboardLayout profile={profile}>
      <header className="animate-rise">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-jade">Account</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-balance text-slate-900">Profile</h1>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <section className="rounded-[22px] bg-white p-6 ring-1 ring-black/5 shadow-sm border border-slate-100 animate-rise" style={{ animationDelay: '120ms' }}>
          
          {isEditing ? (
            <div className="flex flex-col items-center">
               <label className="cursor-pointer relative group block mb-4">
                 <img
                   src={selectedFile ? URL.createObjectURL(selectedFile) : profileImgSrc}
                   alt="Preview"
                   className="size-24 rounded-2xl object-cover outline-1 -outline-offset-1 outline-black/5 group-hover:opacity-50 transition"
                 />
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                   <span className="text-xs font-bold text-slate-900 bg-white/80 px-2 py-1 rounded">Change</span>
                 </div>
                 <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
               </label>
               <input 
                 type="text" 
                 name="name" 
                 value={formData.name} 
                 onChange={handleInputChange}
                 className="w-full text-center border-b border-slate-200 focus:border-jade outline-none pb-1 mt-2 font-bold text-slate-900" 
                 placeholder="Your Name"
               />
            </div>
          ) : (
            <>
              <img
                src={profileImgSrc}
                alt={profile?.name || "Patient"}
                className="size-24 rounded-2xl object-cover outline-1 -outline-offset-1 outline-black/5"
              />
              <h2 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900">{profile?.name || "No name provided"}</h2>
            </>
          )}
          
          <p className="font-mono text-[11px] text-ink/40 mt-1">ID {profile?._id ? `#${profile._id.slice(-6).toUpperCase()}` : "N/A"}</p>
          
          {isEditing ? (
            <div className="flex gap-2 mt-5">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="flex-1 rounded-xl bg-jade py-2.5 text-sm font-bold text-deep transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button 
                onClick={() => { setIsEditing(false); setSelectedFile(null); }}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-bold text-slate-600 transition-opacity hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="mt-5 w-full rounded-xl bg-deep py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Edit profile
            </button>
          )}
        </section>

        <section className="rounded-[22px] bg-white p-6 ring-1 ring-black/5 shadow-sm border border-slate-100 animate-rise lg:col-span-2" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Details</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            
            {isEditing ? (
              <>
                <div className="flex flex-col gap-1 rounded-xl bg-slate-50 px-3.5 py-2.5 border border-slate-100">
                  <span className="text-xs text-ink/50">Date of birth</span>
                  <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="bg-transparent text-sm font-medium text-slate-900 outline-none" />
                </div>
                <div className="flex flex-col gap-1 rounded-xl bg-slate-50 px-3.5 py-2.5 border border-slate-100">
                  <span className="text-xs text-ink/50">Blood type</span>
                  <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} placeholder="e.g. O+" className="bg-transparent text-sm font-medium text-slate-900 outline-none" />
                </div>
                <div className="flex flex-col gap-1 rounded-xl bg-slate-50 px-3.5 py-2.5 border border-slate-100 opacity-60">
                  <span className="text-xs text-ink/50">Email (Cannot edit)</span>
                  <input type="email" value={formData.email} disabled className="bg-transparent text-sm font-medium text-slate-900 outline-none" />
                </div>
                <div className="flex flex-col gap-1 rounded-xl bg-slate-50 px-3.5 py-2.5 border border-slate-100">
                  <span className="text-xs text-ink/50">Phone</span>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 234 567 890" className="bg-transparent text-sm font-medium text-slate-900 outline-none" />
                </div>
              </>
            ) : (
              details.map((d) => (
                <div key={d.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 border border-slate-100">
                  <span className="text-sm text-ink/50">{d.label}</span>
                  <span className="text-sm font-medium text-slate-900">{d.value}</span>
                </div>
              ))
            )}

          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
