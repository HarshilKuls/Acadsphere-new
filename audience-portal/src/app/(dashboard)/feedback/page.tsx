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


export default function FeedbackPage() {

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
    <div className="space-y-6 max-w-xl mx-auto">

                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-[#7C3AED]" /> Feedback Dispatch Portal
                  </h3>

                  {feedbackSubmitted ? (
                    <div className="py-6 text-center text-emerald-400 space-y-2">
                      <Sparkles className="h-8 w-8 mx-auto animate-bounce text-[#06B6D4]" />
                      <h4 className="text-sm font-bold">Feedback Registered!</h4>
                      <p className="text-xs text-zinc-400">Thank you for making Acadsphere better.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitFeedback} className="space-y-5">

                      {/* Stars Widget */}
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Rating Scale</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setFeedbackRating(val)}
                              className="p-1 hover:scale-110 transition-transform"
                            >
                              <Star className={`h-6 w-6 transition-all ${val <= feedbackRating ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" : "text-zinc-600"}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="input-your-message-22" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Your Message</label>
                        <textarea id="input-your-message-22"
                          rows={4}
                          value={feedbackMessage}
                          onChange={e => setFeedbackMessage(e.target.value)}
                          placeholder="Write your suggestions, bug reports, or feature requests here..."
                          className={`w-full rounded-lg border px-3.5 py-2.5 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-[#7C3AED]/10 active:scale-95"
                      >
                        Submit Feedback
                      </button>

                    </form>
                  )}
                </div>

                {/* History timeline */}
                {feedbackHistory.length > 0 && (
                  <div className="glass-card rounded-2xl p-5">
                    <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4">Transmission History</h3>

                    <div className="space-y-4">
                      {feedbackHistory.map(item => (
                        <div key={item.id} className={`p-3.5 border rounded-xl space-y-2 ${isDarkMode ? "border-zinc-800 bg-zinc-900/10" : "border-zinc-300 bg-zinc-50"}`}>
                          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold">
                            <span className="flex items-center gap-1 text-amber-400">
                              {Array.from({ length: item.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current" />
                              ))}
                            </span>
                            <span>{item.date}</span>
                          </div>
                          <p className={`text-xs leading-normal ${isDarkMode ? "text-zinc-300" : "text-zinc-700"}`}>{item.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
  );
}
