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


export default function InternshipPage() {

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

                {/* Filter Controls Panel (Opportunity Radar) */}
                <div className="glass-card rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center gap-5 justify-between">
                  <div className="flex-1">
                    <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-3 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-[#7C3AED]" /> Technical Field Focus
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {["All Fields"].map(field => (
                        <button
                          key={field}
                          onClick={() => setRadarFieldFilter(field)}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${radarFieldFilter === field ? "bg-[#7C3AED] text-white border-transparent shadow-md shadow-[#7C3AED]/20" : (isDarkMode ? "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-400" : "border-zinc-300 bg-zinc-50 hover:bg-zinc-200 text-zinc-600")}`}
                        >
                          {field}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredInternships.length > 0 ? (
                    filteredInternships.map(item => (
                      <div key={item.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between border-l-4 border-l-[#7C3AED] hover:border-l-[#06B6D4] transition-all">

                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className={`text-base font-extrabold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{item.role}</h4>
                              <span className="text-xs text-[#06B6D4] font-bold block mt-1">{item.company}</span>
                            </div>

                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black shadow-inner border ${isDarkMode ? "bg-zinc-800 text-white border-zinc-700" : "bg-zinc-200 text-zinc-800 border-zinc-300"}`}>
                              {item.logo}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-zinc-800/20 rounded-xl border border-zinc-850">
                            <div>
                              <span className="block text-[9px] font-bold text-zinc-500 uppercase">Stipend Cap</span>
                              <span className={`text-xs font-extrabold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{item.stipend}</span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-bold text-zinc-500 uppercase">Duration</span>
                              <span className="text-xs font-bold text-zinc-400">{item.duration}</span>
                            </div>
                          </div>

                          <div className="space-y-1 mb-5">
                            <span className="block text-[9px] font-bold text-zinc-500 uppercase">Eligibility Criteria</span>
                            <p className="text-xs text-zinc-400 leading-normal line-clamp-2">{item.eligibility}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => applyForInternship(item.id, item.company, item.role, item.applyLink)}
                          className={`w-full rounded-lg py-2.5 text-xs font-bold transition-all border ${appliedInternships.includes(item.id) ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold" : "bg-[#7C3AED] hover:bg-[#6D28D9] border-transparent text-white active:scale-95"}`}
                        >
                          {appliedInternships.includes(item.id) ? "Application Transmitted ✓" : "Apply Instantly"}
                        </button>

                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center border border-zinc-800/40 border-dashed rounded-2xl bg-zinc-900/20">
                      <Briefcase className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
                      <p className="text-sm text-zinc-400 font-bold">No internships found</p>
                      <p className="text-xs text-zinc-500 mt-1">Try adjusting your field focus.</p>
                    </div>
                  )}
                </div>

              </div>
  );
}
