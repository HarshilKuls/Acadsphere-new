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


export default function SettingsPage() {

  const {
    mounted,
    currentUser, setCurrentUser,
    isLoginView, setIsLoginView,
    isVerificationPending, setIsVerificationPending,
    isBannedView, setIsBannedView,
    isForgotPasswordView, setIsForgotPasswordView,
    isResetSuccess, setIsResetSuccess,
    fullName, setFullName,
    college, setCollege,
    year, setYear,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    authError, setAuthError,
    editFullName, setEditFullName,
    editCollege, setEditCollege,
    editCourse, setEditCourse,
    editYear, setEditYear,
    isSavingProfile, setIsSavingProfile,
    authProvider, setAuthProvider,
    isChangePasswordOpen, setIsChangePasswordOpen,
    changeCurrentPassword, setChangeCurrentPassword,
    changeNewPassword, setChangeNewPassword,
    changeConfirmNewPassword, setChangeConfirmNewPassword,
    isUpdatingPassword, setIsUpdatingPassword,
    passwordUpdateError, setPasswordUpdateError,
    isDarkMode, setIsDarkMode,
    isSidebarOpen, setIsSidebarOpen,
    isSidebarCollapsed, setIsSidebarCollapsed,
    activeTab, setActiveTab,
    toggleTheme,
    timetable, setTimetable,
    ttSubject, setTtSubject,
    ttFaculty, setTtFaculty,
    ttRoom, setTtRoom,
    ttDay, setTtDay,
    ttStart, setTtStart,
    ttEnd, setTtEnd,
    ttEditingId, setTtEditingId,
    ttEditingColor, setTtEditingColor,
    isClearAllModalOpen, setIsClearAllModalOpen,
    isClearingTimetable, setIsClearingTimetable,
    attendance, setAttendance,
    minAttendanceThreshold, setMinAttendanceThreshold,
    attEditingId, setAttEditingId,
    attSubject, setAttSubject,
    attAttended, setAttAttended,
    attTotal, setAttTotal,
    cgpaSubjects, setCgpaSubjects,
    cgEditingId, setCgEditingId,
    selectedSemester, setSelectedSemester,
    cgSubjectName, setCgSubjectName,
    cgCredits, setCgCredits,
    cgGrade, setCgGrade,
    predictions, setPredictions,
    predEditingId, setPredEditingId,
    predSubject, setPredSubject,
    predInternalScore, setPredInternalScore,
    predInternalTotal, setPredInternalTotal,
    predExternalTotal, setPredExternalTotal,
    predTargetGrade, setPredTargetGrade,
    calendarEvents, setCalendarEvents,
    calEditingId, setCalEditingId,
    calTitle, setCalTitle,
    calDate, setCalDate,
    calType, setCalType,
    currentCalendarMonth, setCurrentCalendarMonth,
    feedbackHistory, setFeedbackHistory,
    feedbackMessage, setFeedbackMessage,
    feedbackRating, setFeedbackRating,
    feedbackSubmitted, setFeedbackSubmitted,
    appliedInternships, setAppliedInternships,
    appliedEvents, setAppliedEvents,
    librarySearch, setLibrarySearch,
    libraryCategoryFilter, setLibraryCategoryFilter,
    radarFieldFilter, setRadarFieldFilter,
    radarTypeFilter, setRadarTypeFilter,
    isUploadModalOpen, setIsUploadModalOpen,
    toastMessage, setToastMessage,
    eventsFeed, setEventsFeed,
    internshipsFeed, setInternshipsFeed,
    libraryFeed, setLibraryFeed,
    triggerToast,
    handleSignUp,
    handleGoogleLogin,
    handleLogIn,
    handleForgotPassword,
    handleResendVerification,
    handleSignOut,
    handleOnboardingComplete,
    handleOnboardingSkip,
    handleSaveProfile,
    handlePasswordChange,
    handleAddTimetable,
    handleEditTimetable,
    handleDeleteTimetable,
    handleClearAllTimetable,
    handleImportExtracted,
    cancelTimetableEdit,
    handleAddAttendance,
    handleEditAttendance,
    handleIncrementAttendance,
    handleDeleteAttendance,
    cancelAttendanceEdit,
    handleAddCGPASubject,
    handleEditCGPASubject,
    handleDeleteCGPASubject,
    cancelCGPAEdit,
    handleAddPrediction,
    handleEditPrediction,
    handleDeletePrediction,
    cancelPredictionEdit,
    handleAddCalendarEvent,
    handleEditCalendarEvent,
    handleDeleteCalendarEvent,
    cancelCalendarEdit,
    handleSubmitFeedback,
    applyForInternship,
    applyForEvent,
    todaysClasses,
    healthData,
    currentDayName,
    overallCGPA,
    cumulativeAttendancePercent,
    nextClass,
    getSGPA,
    getPerformanceSummary,
    overallCredits,
    activeSemesters,
    attendedClasses,
    totalClasses,
    timeToMinutes,
    getExternalRequirement,
    filteredLibrary,
    filteredEvents,
    filteredInternships,
    getDaysInMonth,
    calendarDays,
    startDayOffset,
    gradePoints,
    gradeThresholds,
    currentClass
  } = useAcadsphere();


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
                          className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="input-college-institution-24" className="text-[10px] uppercase font-bold text-zinc-400">College / Institution</label>
                        <input id="input-college-institution-24"
                          type="text"
                          value={editCollege}
                          onChange={e => setEditCollege(e.target.value)}
                          placeholder="Your College / Institution"
                          className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="input-course-name-25" className="text-[10px] uppercase font-bold text-zinc-400">Course Name</label>
                        <input id="input-course-name-25"
                          type="text"
                          value={editCourse}
                          onChange={e => setEditCourse(e.target.value)}
                          placeholder="e.g. B.Tech Computer Science"
                          className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
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
                          className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
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
                        className="rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
                      >
                        {isSavingProfile ? "Saving changes..." : "Save Profile Settings"}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-sm font-bold tracking-wide text-zinc-500 uppercase">Preferences</h3>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Theme Mode</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5">Toggle between dark-first and light mode.</span>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${isDarkMode ? "border-zinc-800 bg-zinc-900 text-[#06B6D4]" : "border-zinc-200 bg-zinc-100 text-zinc-600"}`}
                    >
                      {isDarkMode ? "Dark Mode" : "Light Mode"}
                    </button>
                  </div>


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
                        className="px-4 py-2 text-xs font-bold bg-[#7c5cff] hover:bg-[#6D28D9] text-white rounded-lg transition-all"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
  );
}
