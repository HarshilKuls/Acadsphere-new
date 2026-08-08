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


export default function TimetablePage() {

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

                {/* Input Schedule Form */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase flex items-center gap-1.5">
                      <Plus className="h-4 w-4 text-[#7C3AED]" /> Log Course Schedule
                    </h3>
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-3.5 py-2 text-[10px] font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Upload Timetable (AI)
                    </button>
                  </div>

                  <form onSubmit={handleAddTimetable} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div>
                      <label htmlFor="input-course-subject-2" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Course Subject</label>
                      <input id="input-course-subject-2"
                        type="text"
                        value={ttSubject}
                        onChange={e => setTtSubject(e.target.value)}
                        placeholder="Computer Networks"
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-instructor-faculty-3" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Instructor / Faculty</label>
                      <input id="input-instructor-faculty-3"
                        type="text"
                        value={ttFaculty}
                        onChange={e => setTtFaculty(e.target.value)}
                        placeholder="Dr. Alan Turing"
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-room-code-4" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Room Code</label>
                      <input id="input-room-code-4"
                        type="text"
                        value={ttRoom}
                        onChange={e => setTtRoom(e.target.value)}
                        placeholder="Lab-304"
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-weekday-day-5" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Weekday Day</label>
                      <select id="input-weekday-day-5"
                        value={ttDay}
                        onChange={e => setTtDay(e.target.value)}
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      >
                        <option>Monday</option>
                        <option>Tuesday</option>
                        <option>Wednesday</option>
                        <option>Thursday</option>
                        <option>Friday</option>
                        <option>Saturday</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="input-starts-at-6" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Starts At</label>
                        <input id="input-starts-at-6"
                          type="time"
                          value={ttStart}
                          onChange={e => setTtStart(e.target.value)}
                          className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                        />
                      </div>
                      <div>
                        <label htmlFor="input-ends-at-7" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Ends At</label>
                        <input id="input-ends-at-7"
                          type="time"
                          value={ttEnd}
                          onChange={e => setTtEnd(e.target.value)}
                          className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                        />
                      </div>
                    </div>

                    <div className="lg:col-span-3 flex justify-end gap-3">
                      {ttEditingId && (
                        <button
                          type="button"
                          onClick={cancelTimetableEdit}
                          className="rounded-lg border border-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-400 hover:bg-zinc-800/60 transition-all"
                        >
                          Cancel Edit
                        </button>
                      )}
                      <button
                        type="submit"
                        className="rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md active:scale-95"
                      >
                        {ttEditingId ? "Update Lecture Block" : "Add Lecture Block"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Weekly Timetable Grid Board */}
                <div className="glass-card rounded-2xl p-5 overflow-x-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase">Weekly Lecture Grid</h3>
                    {timetable.length > 0 && (
                      <button
                        onClick={() => setIsClearAllModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="min-w-[800px] grid grid-cols-6 gap-4">

                    {/* Index Col */}
                    <div className="space-y-3 font-semibold text-center border-r border-zinc-800/40 pr-2">
                      <div className="h-10 flex items-center justify-center text-zinc-500 text-[10px] uppercase font-bold">Weekdays</div>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                        <div key={day} className="h-[88px] flex items-center justify-center text-xs text-zinc-400 font-bold">{day.slice(0, 3)}</div>
                      ))}
                    </div>

                    {/* Schedule rows: a single right-hand column keeps every weekday aligned with its label. */}
                    <div className="col-span-5 grid grid-rows-[repeat(6,88px)] gap-3 pt-[52px]">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(dayName => {
                        const classes = timetable
                          .filter(t => t.day.toLowerCase() === dayName.toLowerCase())
                          .sort((a, b) => a.startTime.localeCompare(b.startTime));
                        return (
                          <div key={dayName} className="relative min-h-0">

                            {classes.length > 0 ? (
                              <div className="flex h-full items-stretch gap-3 overflow-x-auto py-1">
                                {classes.map(item => (
                                  <div
                                    key={item.id}
                                    className={`flex-shrink-0 w-48 rounded-xl border p-3 flex flex-col justify-between ${item.color} relative group ${currentClass?.id === item.id ? "ring-2 ring-[#06B6D4] ring-offset-2 ring-offset-[#09090B]" : ""}`}
                                  >
                                    <div>
                                      <span className="text-xs font-bold block truncate">{item.subject}</span>
                                      <span className="text-[9px] opacity-80 block truncate">Room: {item.room} &bull; {item.faculty}</span>
                                    </div>

                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/10">
                                      <span className="text-[9px] font-bold">{item.startTime} - {item.endTime}</span>

                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                          onClick={() => handleEditTimetable(item)}
                                          className="p-1 text-zinc-500 hover:text-[#06B6D4] transition-all"
                                          title="Edit lecture block"
                                        >
                                          <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteTimetable(item.id)}
                                          className="p-1 text-red-500 hover:text-red-400 transition-all"
                                          title="Delete lecture block"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center pl-4 text-[10px] text-zinc-600 font-semibold italic h-16">
                                No lectures scheduled
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

                {/* AI Upload Modal */}
                {isUploadModalOpen && (
                  <TimetableUpload
                    isDarkMode={isDarkMode}
                    onImport={handleImportExtracted}
                    onClose={() => setIsUploadModalOpen(false)}
                    triggerToast={triggerToast}
                  />
                )}

              </div>
  );
}
