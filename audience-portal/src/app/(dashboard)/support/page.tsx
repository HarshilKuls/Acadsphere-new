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


export default function SupportPage() {

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
                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-sm font-bold tracking-wide text-zinc-500 uppercase">Need Assistance?</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Welcome to the Acadsphere Support channel. If you have any technical questions, encounter bugs, or need help with course tracking or GPA predictors, please choose one of the options below.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-900/10 space-y-2">
                      <span className="text-xs font-bold block">Submit a Bug Report</span>
                      <p className="text-[10px] text-zinc-500">File a bug directly to developers using our feedback module.</p>
                      <button
                        onClick={() => setActiveTab("Feedback")}
                        className="text-[10px] font-bold text-[#7c5cff] hover:underline flex items-center gap-1 mt-1"
                      >
                        Go to Feedback <ChevronRight className="h-3 w-3 inline" />
                      </button>
                    </div>

                    <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-900/10 space-y-2">
                      <span className="text-xs font-bold block">Documentation & FAQ</span>
                      <p className="text-[10px] text-zinc-500">Learn how skip margins are calculated and CGPA weights are handled.</p>
                      <p className="text-[10px] font-medium text-zinc-500">Documentation is not available yet.</p>
                    </div>
                  </div>
                </div>


              </div>
  );
}
