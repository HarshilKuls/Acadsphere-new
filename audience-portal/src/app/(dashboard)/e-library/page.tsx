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


export default function ELibraryPage() {

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
    <div className="space-y-6">

                {/* Search Filter and Category Board */}
                <div className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">

                  <div className="w-full sm:max-w-md">
                    <input
                      type="text"
                      value={librarySearch}
                      onChange={e => setLibrarySearch(e.target.value)}
                      placeholder="Search notes, subjects, exams or keywords..."
                      className={`w-full rounded-lg border px-4 py-2.5 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {["All", "Notes", "PDF", "PYQ", "Book"].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setLibraryCategoryFilter(cat)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${libraryCategoryFilter === cat ? "bg-[#7C3AED] text-white border-transparent" : (isDarkMode ? "border-zinc-800 hover:bg-zinc-800 text-zinc-400" : "border-zinc-300 hover:bg-zinc-200 text-zinc-600")}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Library Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLibrary.length > 0 ? (
                    filteredLibrary.map(item => (
                      <div key={item.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between hover:border-[#06B6D4]/50 transition-all">

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[9px] font-extrabold text-[#7C3AED] uppercase bg-[#7C3AED]/10 px-2 py-0.5 rounded border border-[#7C3AED]/20">
                              {item.type}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-bold">{item.size}</span>
                          </div>

                          <h4 className={`text-sm font-extrabold leading-snug tracking-tight mb-2 ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{item.title}</h4>
                          <p className={`text-[11px] font-semibold ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>{item.subject} &bull; {item.semester}</p>
                        </div>

                        <button
                          onClick={() => {
                            if (item.downloadUrl) {
                              window.open(item.downloadUrl, '_blank');
                            } else {
                              triggerToast(`Downloading: ${item.title}...`);
                            }
                          }}
                          className={`mt-5 w-full flex items-center justify-center gap-1.5 rounded-lg border py-2.5 text-xs font-bold transition-all active:scale-95 ${isDarkMode ? "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-850 hover:border-zinc-700 text-white" : "border-zinc-300 bg-zinc-100 hover:bg-zinc-200 hover:border-zinc-400 text-zinc-800"}`}
                        >
                          <Download className="h-3.5 w-3.5 text-[#06B6D4]" />
                          Download Resource
                        </button>

                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center">
                      <p className="text-xs text-zinc-500 font-semibold italic">No matched academic resources. Adjust filtering query.</p>
                    </div>
                  )}
                </div>

              </div>
  );
}
