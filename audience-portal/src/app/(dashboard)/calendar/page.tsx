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


export default function CalendarPage() {

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

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                  {/* Core Calendar UI Grid */}
                  <div className="glass-card rounded-2xl p-5 xl:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase">Academic Calendar</h3>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1))}
                          className={`px-2.5 py-1.5 text-xs rounded-lg font-bold ${isDarkMode ? "border border-zinc-800 hover:bg-zinc-800 text-zinc-400" : "border border-zinc-300 hover:bg-zinc-200 text-zinc-500"}`}
                        >
                          Prev
                        </button>
                        <span className={`text-xs font-bold px-2 ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                          {currentCalendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </span>
                        <button
                          onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1))}
                          className={`px-2.5 py-1.5 text-xs rounded-lg font-bold ${isDarkMode ? "border border-zinc-800 hover:bg-zinc-800 text-zinc-400" : "border border-zinc-300 hover:bg-zinc-200 text-zinc-500"}`}
                        >
                          Next
                        </button>
                      </div>
                    </div>

                    {/* Calendar monthly block */}
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold mb-2 text-zinc-500 uppercase tracking-wider text-[9px] sm:text-[10px]">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                        <div key={d} className="py-1">{d}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {/* Offsets */}
                      {Array.from({ length: startDayOffset }).map((_, i) => (
                        <div key={`offset-${i}`} className={`h-10 sm:h-16 border rounded-lg ${isDarkMode ? "border-zinc-800/10" : "border-zinc-300/10"}`} />
                      ))}

                      {/* Month days */}
                      {calendarDays.map(dayObj => {
                        const y = dayObj.getFullYear();
                        const m = String(dayObj.getMonth() + 1).padStart(2, '0');
                        const d = String(dayObj.getDate()).padStart(2, '0');
                        const dateStr = `${y}-${m}-${d}`;
                        const dayEvents = calendarEvents.filter(e => e.date === dateStr);
                        const isToday = new Date().toDateString() === dayObj.toDateString();

                        return (
                          <div
                            key={dateStr}
                            className={`min-h-[64px] border p-1 rounded-lg flex flex-col justify-between transition-all ${isToday ? "border-[#7C3AED] bg-[#7C3AED]/5" : (isDarkMode ? "border-zinc-800 hover:border-zinc-700 bg-zinc-900/10" : "border-zinc-300 hover:border-zinc-400 bg-zinc-50")}`}
                          >
                            <span className={`text-[10px] font-bold block text-left ${isToday ? "text-[#7C3AED]" : "text-zinc-500"}`}>
                              {dayObj.getDate()}
                            </span>

                            <div className="space-y-1 mt-1">
                              {dayEvents.slice(0, 2).map(ev => {
                                const badgeColors = {
                                  exam: "bg-red-500/20 text-red-400 border-red-500/20",
                                  deadline: "bg-amber-500/20 text-amber-400 border-amber-500/20",
                                  reminder: "bg-purple-500/20 text-purple-400 border-purple-500/20",
                                  holiday: "bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/20"
                                };
                                return (
                                  <div
                                    key={ev.id}
                                    className={`text-[8px] px-1 rounded truncate border font-medium ${badgeColors[ev.type]}`}
                                    title={ev.title}
                                  >
                                    {ev.title}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add event Form */}
                  <div className="space-y-6">

                    <div className="glass-card rounded-2xl p-5">
                      <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                        <Plus className="h-4 w-4 text-[#7C3AED]" /> {calEditingId ? "Update Task Event" : "Record Task Event"}
                      </h3>

                      <form onSubmit={handleAddCalendarEvent} className="space-y-4">
                        <div>
                          <label htmlFor="input-event-summary-19" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Event Summary</label>
                          <input id="input-event-summary-19"
                            type="text"
                            value={calTitle}
                            onChange={e => setCalTitle(e.target.value)}
                            placeholder="Study Group Session"
                            className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                          />
                        </div>
                        <div>
                          <label htmlFor="input-target-date-dd-mm-yyyy-format-20" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Target Date - DD-MM-YYYY format</label>
                          <input id="input-target-date-dd-mm-yyyy-format-20"
                            type="date"
                            value={calDate}
                            onChange={e => setCalDate(e.target.value)}
                            className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                          />
                        </div>
                        <div>
                          <label htmlFor="input-type-categories-21" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Type Categories</label>
                          <select id="input-type-categories-21"
                            value={calType}
                            onChange={e => setCalType(e.target.value as CalendarEvent["type"])}
                            className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                          >
                            <option>exam</option>
                            <option>deadline</option>
                            <option>reminder</option>
                            <option>holiday</option>
                          </select>
                        </div>

                        <div className="flex gap-3">
                          {calEditingId && (
                            <button
                              type="button"
                              onClick={cancelCalendarEdit}
                              className="flex-1 rounded-lg border border-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-400 hover:bg-zinc-800/60 transition-all"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="submit"
                            className="flex-1 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                          >
                            {calEditingId ? "Update Event" : "Log Event"}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Event lists logger details */}
                    <div className="glass-card rounded-2xl p-5">
                      <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-3">Academic Milestones</h3>

                      <div className="space-y-2.5 overflow-y-auto max-h-48 pr-1">
                        {calendarEvents.filter(e => e.userId !== 'admin').length > 0 ? calendarEvents.filter(e => e.userId !== 'admin').map(ev => (
                          <div key={ev.id} className={`flex items-center justify-between p-2.5 border rounded-lg ${isDarkMode ? "border-zinc-800 bg-zinc-900/10" : "border-zinc-300 bg-zinc-50"}`}>
                            <div>
                              <span className={`text-xs font-bold block truncate max-w-[120px] ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{ev.title}</span>
                              <span className="text-[9px] text-zinc-500 block font-semibold">{ev.date} &bull; {ev.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditCalendarEvent(ev)}
                                className="text-zinc-600 hover:text-[#06B6D4] transition-all p-1"
                                title="Edit event"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCalendarEvent(ev.id)}
                                className="text-zinc-600 hover:text-red-500 transition-all p-1"
                                title="Delete event"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )) : (
                          <p className="text-xs text-zinc-500 text-center py-6 border border-dashed border-zinc-800 rounded-xl">
                            No personal events yet. Add deadlines, exams, reminders, or holidays here.
                          </p>
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
  );
}
