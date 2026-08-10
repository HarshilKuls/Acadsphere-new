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


export default function AttendancePage() {

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

                {/* Threshold Toggle */}
                <div className="flex justify-between items-center bg-zinc-900/5 border border-zinc-200 dark:border-zinc-800/40 p-3 rounded-2xl glass-card">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Min. Requirement</span>
                  <div className="flex bg-zinc-200/50 dark:bg-zinc-800/50 rounded-lg p-1">
                    <button
                      onClick={() => setMinAttendanceThreshold(66)}
                      className={`text-xs px-3 py-1 rounded-md font-bold transition-all ${minAttendanceThreshold === 66 ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                    >
                      66%
                    </button>
                    <button
                      onClick={() => setMinAttendanceThreshold(75)}
                      className={`text-xs px-3 py-1 rounded-md font-bold transition-all ${minAttendanceThreshold === 75 ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                    >
                      75%
                    </button>
                  </div>
                </div>

                {/* Quick Setup Form */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-[#7C3AED]" /> {attEditingId ? "Update Course Attendance" : "Register Course Attendance"}
                  </h3>

                  <form onSubmit={handleAddAttendance} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div>
                      <label htmlFor="input-subject-course-name-8" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Subject / Course Name</label>
                      <input id="input-subject-course-name-8"
                        type="text"
                        value={attSubject}
                        onChange={e => setAttSubject(e.target.value)}
                        placeholder="Compiler Design"
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-classes-attended-9" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Classes Attended</label>
                      <input id="input-classes-attended-9"
                        type="number"
                        value={attAttended}
                        onChange={e => setAttAttended(e.target.value)}
                        min="0"
                        step="1"
                        placeholder="18"
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-total-classes-conducted-10" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Total Classes Conducted</label>
                      <input id="input-total-classes-conducted-10"
                        type="number"
                        value={attTotal}
                        onChange={e => setAttTotal(e.target.value)}
                        min="1"
                        step="1"
                        placeholder="24"
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>

                    <div className="sm:col-span-3 flex justify-end gap-3">
                      {attEditingId && (
                        <button
                          type="button"
                          onClick={cancelAttendanceEdit}
                          className={`rounded-lg border px-4 py-2.5 text-xs font-bold transition-all ${isDarkMode ? "border-zinc-800 text-zinc-400 hover:bg-zinc-800/60" : "border-zinc-300 text-zinc-500 hover:bg-zinc-200"}`}
                        >
                          Cancel Edit
                        </button>
                      )}
                      <button
                        type="submit"
                        className="rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                      >
                        {attEditingId ? "Update Tracker" : "Track Subject"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Attendance Trackers List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {attendance.map(item => {
                    const percent = item.total > 0 ? (item.attended / item.total) * 100 : 0;
                    const reqRatio = minAttendanceThreshold / 100;
                    const isSafe = percent >= minAttendanceThreshold;
                    const skips = Math.max(0, Math.floor((item.attended - reqRatio * item.total) / reqRatio));
                    const rec = Math.max(0, Math.ceil((reqRatio * item.total - item.attended) / (1 - reqRatio)));

                    return (
                      <div key={item.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <span className={`text-sm font-bold block ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{item.subject}</span>
                              <span className="text-[10px] text-zinc-500 font-semibold">Tally: {item.attended} / {item.total} lectures</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${isSafe ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                              {percent.toFixed(1)}%
                            </span>
                          </div>

                          {/* Horizontal progress bar */}
                          <div className={`w-full h-1.5 rounded-full my-4 overflow-hidden ${isDarkMode ? "bg-zinc-800" : "bg-zinc-300"}`}>
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${isSafe ? "bg-[#06B6D4]" : "bg-red-500"}`}
                              style={{ width: `${Math.min(100, percent)}%` }}
                            />
                          </div>

                          {/* Dynamic indicators */}
                          <div className={`grid grid-cols-2 gap-2 p-2.5 rounded-xl border ${isDarkMode ? "bg-zinc-800/30 border-zinc-800/50" : "bg-zinc-100 border-zinc-300/50"}`}>
                            <div className={`text-center border-r ${isDarkMode ? "border-zinc-800" : "border-zinc-300"}`}>
                              <span className="block text-[10px] font-bold text-zinc-500 uppercase">Skip Margin</span>
                              <span className={`text-base font-extrabold block ${isSafe ? "text-emerald-400" : "text-zinc-500"}`}>
                                {isSafe ? `${skips} Classes` : "0"}
                              </span>
                            </div>
                            <div className="text-center">
                              <span className="block text-[10px] font-bold text-zinc-500 uppercase">Recovery Target</span>
                              <span className={`text-base font-extrabold block ${!isSafe ? "text-red-400" : "text-zinc-500"}`}>
                                {!isSafe ? `${rec} classes` : "Safe"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quick increment buttons */}
                        <div className={`flex items-center justify-between gap-3 mt-5 pt-4 border-t ${isDarkMode ? "border-zinc-800/40" : "border-zinc-300/40"}`}>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleIncrementAttendance(item.id, true)}
                              className="bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
                            >
                              +1 Attended
                            </button>
                            <button
                              onClick={() => handleIncrementAttendance(item.id, false)}
                              className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
                            >
                              +1 Missed
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditAttendance(item)}
                              className="text-zinc-600 hover:text-[#06B6D4] p-1 transition-all"
                              title="Edit Course Tracker"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAttendance(item.id)}
                              className="text-zinc-600 hover:text-red-500 p-1 transition-all"
                              title="Delete Course Tracker"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {attendance.length === 0 && (
                    <div className={`md:col-span-2 text-center border border-dashed rounded-2xl p-8 ${isDarkMode ? "border-zinc-800" : "border-zinc-300"}`}>
                      <p className="text-sm font-bold text-zinc-300">No attendance trackers yet.</p>
                      <p className="text-xs text-zinc-500 mt-1">Add each subject once, then use the quick buttons after every class.</p>
                    </div>
                  )}
                </div>

              </div>
  );
}
