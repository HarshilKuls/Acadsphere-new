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


export default function EventsPage() {

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

                  <div className="lg:border-l lg:border-zinc-800/60 lg:pl-5">
                    <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-3 flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-[#06B6D4]" /> Event Type
                    </h3>
                    <select
                      value={radarTypeFilter}
                      onChange={(e) => setRadarTypeFilter(e.target.value)}
                      className={`w-full lg:w-48 rounded-lg border px-3 py-2 text-xs font-bold transition-all outline-none ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white focus:border-[#06B6D4]" : "border-zinc-300 bg-zinc-50 text-zinc-900 focus:border-[#06B6D4]"}`}
                    >
                      <option value="All Types">All Types</option>
                      <option value="Hackathons">Hackathons</option>
                      <option value="Competitions">Competitions</option>
                      <option value="Workshops">Workshops</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map(ev => (
                      <div key={ev.id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#7C3AED]/40 transition-all group">
                        <div className="relative">
                          {ev.image ? (
                            <img
                              src={ev.image}
                              alt={ev.title}
                              className="h-44 w-full object-cover border-b border-zinc-800/40 group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="h-44 w-full border-b border-zinc-800/40 bg-gradient-to-br from-[#7C3AED]/35 via-[#18121f] to-[#06B6D4]/20" aria-hidden="true" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />
                          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-white uppercase bg-[#7C3AED]/80 px-2 py-0.5 rounded backdrop-blur-md">
                              {ev.type}
                            </span>
                            <span className="text-[10px] text-zinc-300 font-bold drop-shadow-md">{ev.date}</span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className={`text-base font-extrabold leading-snug ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{ev.title}</h4>
                            <span className="text-[11px] text-[#06B6D4] font-bold block mt-1.5 mb-3">{ev.organizer}</span>
                            <p className="text-xs text-zinc-500 leading-relaxed mb-4">{ev.description}</p>
                          </div>

                          <button
                            onClick={() => applyForEvent(ev.id, ev.title, ev.applyLink)}
                            className={`w-full rounded-lg py-2.5 text-xs font-bold transition-all border ${appliedEvents.includes(ev.id) ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold" : "bg-[#7C3AED] hover:bg-[#6D28D9] border-transparent text-white active:scale-95"}`}
                          >
                            {appliedEvents.includes(ev.id) ? "Registration Confirmed ✓" : "Register to Network"}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center border border-zinc-800/40 border-dashed rounded-2xl bg-zinc-900/20">
                      <Code2 className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
                      <p className="text-sm text-zinc-400 font-bold">No events found</p>
                      <p className="text-xs text-zinc-500 mt-1">Try adjusting your field focus.</p>
                    </div>
                  )}
                </div>

              </div>
  );
}
