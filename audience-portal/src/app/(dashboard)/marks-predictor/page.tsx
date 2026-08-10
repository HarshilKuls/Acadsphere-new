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


export default function MarksPredictorPage() {

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

                {/* Input target panel */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-[#7C3AED]" /> Target Grade Calibration Form
                  </h3>

                  <form onSubmit={handleAddPrediction} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div>
                      <label htmlFor="input-course-name-14" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Course Name</label>
                      <input id="input-course-name-14"
                        type="text"
                        value={predSubject}
                        onChange={e => setPredSubject(e.target.value)}
                        placeholder="Operating Systems"
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-internals-secured-e-g-40-15" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Internals Secured (e.g. 40)</label>
                      <input id="input-internals-secured-e-g-40-15"
                        type="number"
                        value={predInternalScore}
                        onChange={e => setPredInternalScore(e.target.value)}
                        min="0"
                        step="0.01"
                        placeholder="40"
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-internals-total-cap-e-g-60-16" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Internals Total Cap (e.g. 60)</label>
                      <input id="input-internals-total-cap-e-g-60-16"
                        type="number"
                        value={predInternalTotal}
                        onChange={e => setPredInternalTotal(e.target.value)}
                        min="0.01"
                        step="0.01"
                        placeholder="60"
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-external-total-cap-17" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">External Total Cap</label>
                      <input id="input-external-total-cap-17"
                        type="number"
                        value={predExternalTotal}
                        onChange={e => setPredExternalTotal(e.target.value)}
                        min="0.01"
                        step="0.01"
                        placeholder="100"
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-target-grade-boundary-18" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Target Grade Boundary</label>
                      <select id="input-target-grade-boundary-18"
                        value={predTargetGrade}
                        onChange={e => setPredTargetGrade(e.target.value as MarksPrediction["targetGrade"])}
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      >
                        <option>O</option>
                        <option>A+</option>
                        <option>A</option>
                        <option>B+</option>
                        <option>B</option>
                        <option>C</option>
                      </select>
                    </div>

                    <div className="lg:col-span-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 text-[10px] text-zinc-500 font-medium pb-2 italic self-center">
                        * Calculation scale assumes Internals = 60%, Externals = 40% grade weighting.
                      </div>
                      <div className="flex justify-end gap-3">
                        {predEditingId && (
                          <button
                            type="button"
                            onClick={cancelPredictionEdit}
                            className="rounded-lg border border-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-400 hover:bg-zinc-800/60 transition-all"
                          >
                            Cancel Edit
                          </button>
                        )}
                        <button
                          type="submit"
                          className="rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                        >
                          {predEditingId ? "Update Prediction" : "Generate Prediction"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Predictions List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {predictions.map(item => {
                    const requirement = getExternalRequirement(item);

                    return (
                      <div key={item.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between border-t-2 border-t-[#06B6D4]">
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <span className={`text-base font-extrabold block ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{item.subject}</span>
                              <span className="text-[10px] text-zinc-500 font-semibold">Current Internals: {item.internalScore} / {item.internalTotal} ({requirement.internalContrib.toFixed(1)} / 60.0 pts)</span>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] font-bold text-zinc-500 block uppercase">Target Grade</span>
                              <span className="text-lg font-extrabold text-[#7C3AED] block">{item.targetGrade} ({requirement.targetBoundary}%)</span>
                            </div>
                          </div>

                          {/* Calculations Details block */}
                          <div className="space-y-3 p-3 bg-zinc-800/30 rounded-xl border border-zinc-800">
                            <div className="flex justify-between text-xs">
                              <span className="text-zinc-400">Needed External Score:</span>
                              <span className={`font-bold ${requirement.feasible ? (isDarkMode ? "text-white" : "text-zinc-900") : "text-rose-500"}`}>
                                {requirement.alreadySecured ? "Already secured" : requirement.feasible ? `${requirement.rawExternalNeeded} / ${item.externalTotal}` : "Impossible"}
                              </span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                              <span className="text-zinc-500">Weighted points still needed:</span>
                              <span className="font-bold text-zinc-300">{Math.max(0, requirement.neededExternalContrib).toFixed(1)} / 40</span>
                            </div>

                            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${requirement.feasible ? "bg-[#7C3AED]" : "bg-red-500"}`}
                                style={{ width: `${Math.min(100, Math.max(0, (requirement.rawExternalNeeded / item.externalTotal) * 100))}%` }}
                              />
                            </div>

                            {!requirement.feasible && (
                              <p className="text-[10px] text-red-500 font-bold leading-normal">
                                Target grade is mathematically out of bounds. Reduce the target grade or confirm your exam totals.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-5 pt-3 border-t border-zinc-800/40">
                          <span className="text-[10px] font-medium text-zinc-500 italic">
                            {requirement.alreadySecured ? "Current internals already meet this target." : requirement.feasible ? "Use this as your minimum final exam target." : "Target grade warning active."}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditPrediction(item)}
                              className="text-zinc-600 hover:text-[#06B6D4] p-1.5 transition-all"
                              title="Edit prediction"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePrediction(item.id)}
                              className="text-zinc-600 hover:text-red-500 p-1.5 transition-all"
                              title="Delete prediction"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {predictions.length === 0 && (
                    <div className="md:col-span-2 text-center border border-dashed border-zinc-800 rounded-2xl p-8">
                      <p className="text-sm font-bold text-zinc-300">No marks predictions yet.</p>
                      <p className="text-xs text-zinc-500 mt-1">Add a course to see the exact external score needed for your target grade.</p>
                    </div>
                  )}
                </div>

              </div>
  );
}
