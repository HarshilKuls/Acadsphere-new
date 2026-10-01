"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Briefcase,
  MessageSquare,
  Plus,
  Trash2,
  Pencil,
  User,
  Clock,
  Sparkles,
  X,
  ChevronRight,
  Download,
  Star,
  Award
} from "lucide-react";
import { StudentUser, TimetableEntry, AttendanceEntry, CGPASubject, MarksPrediction, CalendarEvent, FeedbackSubmission, HackathonEvent, InternshipListing, LibraryItem } from "@/lib/db";
import TimetableUpload from "@/components/Dashboard/TimetableUpload";
import { useAcadsphere } from "@/context/AcadsphereContext";
import { supabase } from "@/lib/db";
import PageHero from "@/components/PageHero";


export default function SettingsPage() {
  const {
    currentUser, setCurrentUser,
    isDarkMode,
    authProvider,
    setChangeCurrentPassword,
    setChangeNewPassword,
    setChangeConfirmNewPassword,
    setPasswordUpdateError,
    setIsChangePasswordOpen,
    triggerToast
  } = useAcadsphere();
  const [editFullName, setEditFullName] = React.useState("");
  const [editCollege, setEditCollege] = React.useState("");
  const [editCourse, setEditCourse] = React.useState("");
  const [editYear, setEditYear] = React.useState("");
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);

  // Sync profile inputs when currentUser loads
  React.useEffect(() => {
    if (currentUser) {
      setEditFullName(currentUser.fullName || "");
      setEditCollege(currentUser.college || "");
      setEditCourse(currentUser.course || "");
      setEditYear(currentUser.year || "I Year");
    }
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!editFullName.trim() || !editCollege.trim()) {
      triggerToast("Full Name and College/Institution are required.");
      return;
    }
    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from('users').update({
          full_name: editFullName,
          college: editCollege,
          course: editCourse,
          year: editYear,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      const updatedUser = {
        ...currentUser,
        fullName: editFullName,
        college: editCollege,
        course: editCourse,
        year: editYear
      };

      setCurrentUser(updatedUser);
      localStorage.setItem("acadsphere_session", JSON.stringify(updatedUser));
      document.cookie = "acadsphere_session=true; path=/; max-age=604800";
      triggerToast("Profile settings updated successfully!");
    } catch (err: unknown) {
      triggerToast((err as Error)?.message || "Failed to update profile settings.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-2xl">

      <div className="glass-card p-6 space-y-6">
        <h3 className="text-sm font-bold tracking-wide text-zinc-500 uppercase">Profile Settings</h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="input-full-name-23" className="text-[10px] uppercase font-bold text-zinc-400">Full Name</label>
              <input id="input-full-name-23"
                type="text"
                value={editFullName}
                onChange={e => setEditFullName(e.target.value)}
                placeholder="Your Full Name"
                className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[var(--accent-50)] focus:border-[var(--accent)]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[var(--accent-20)] focus:border-[var(--accent)]"}`}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="input-college-institution-24" className="text-[10px] uppercase font-bold text-zinc-400">College / Institution</label>
              <input id="input-college-institution-24"
                type="text"
                value={editCollege}
                onChange={e => setEditCollege(e.target.value)}
                placeholder="Your College / Institution"
                className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[var(--accent-50)] focus:border-[var(--accent)]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[var(--accent-20)] focus:border-[var(--accent)]"}`}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="input-course-name-25" className="text-[10px] uppercase font-bold text-zinc-400">Course Name</label>
              <input id="input-course-name-25"
                type="text"
                value={editCourse}
                onChange={e => setEditCourse(e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[var(--accent-50)] focus:border-[var(--accent)]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[var(--accent-20)] focus:border-[var(--accent)]"}`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-400">Email Address (Locked)</label>
              <div className="w-full px-4 py-3 bg-zinc-900/10 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-500">
                {currentUser.email}
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="input-academic-year-26" className="text-[10px] uppercase font-bold text-zinc-400">Academic Year</label>
              <select id="input-academic-year-26"
                value={editYear}
                onChange={e => setEditYear(e.target.value)}
                className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[var(--accent-50)] focus:border-[var(--accent)]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[var(--accent-20)] focus:border-[var(--accent)]"}`}
              >
                <option>I Year</option>
                <option>II Year</option>
                <option>III Year</option>
                <option>IV Year</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSavingProfile ? "Saving changes..." : "Save Profile Settings"}
            </button>
          </div>
        </form>
      </div>


      {authProvider !== "google" && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold tracking-wide text-zinc-500 uppercase">Change Password</h3>
          <div className="flex items-center justify-between py-2">
            <div className="flex flex-col">
              <span className="text-xs font-bold">Update Account Security</span>
              <span className="text-[10px] text-zinc-500 mt-0.5">Modify your password securely using Supabase Auth.</span>
            </div>
            <button
              onClick={() => {
                setChangeCurrentPassword("");
                setChangeNewPassword("");
                setChangeConfirmNewPassword("");
                setPasswordUpdateError(null);
                setIsChangePasswordOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold bg-[#7c5cff] hover:bg-[var(--accent-hover)] text-white rounded-lg transition-all"
            >
              Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
