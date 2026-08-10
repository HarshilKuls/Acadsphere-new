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


export default function CGPAPage() {

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

                {/* Quick Metrics Panels */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="glass-card rounded-2xl p-5 text-center">
                    <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Cumulative CGPA</span>
                    <span className="text-4xl font-extrabold text-[#7C3AED] tracking-tight">{overallCGPA > 0 ? overallCGPA.toFixed(2) : "0.00"}</span>
                  </div>
                  <div className="glass-card rounded-2xl p-5 text-center">
                    <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Total Credits Earned</span>
                    <span className="text-4xl font-extrabold text-[#06B6D4] tracking-tight">{overallCredits} pts</span>
                  </div>
                  <div className="glass-card rounded-2xl p-5 text-center flex flex-col justify-center">
                    <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Batch Standing</span>
                    <span className="text-xs font-semibold text-zinc-400 mt-1">{getPerformanceSummary(overallCGPA)}</span>
                  </div>
                </div>

                {/* Semester selector & Input Form */}
                <div className="glass-card rounded-2xl p-5">
                    <div className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b ${isDarkMode ? "border-zinc-800/40" : "border-zinc-300/40"}`}>
                    <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase">Grade Ledger Panel</h3>

                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <button
                          key={sem}
                          onClick={() => setSelectedSemester(sem)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${selectedSemester === sem ? "bg-[#7C3AED] text-white border-transparent" : (isDarkMode ? "border-zinc-800 hover:bg-zinc-800 text-zinc-400" : "border-zinc-300 hover:bg-zinc-200 text-zinc-600")}`}
                        >
                          Sem {sem}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add grade input form */}
                  <form onSubmit={handleAddCGPASubject} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                    <div className="sm:col-span-2">
                      <label htmlFor="input-subject-title-11" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Subject Title</label>
                      <input id="input-subject-title-11"
                        type="text"
                        value={cgSubjectName}
                        onChange={e => setCgSubjectName(e.target.value)}
                        placeholder="Engineering Mathematics III"
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-course-credit-value-12" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Course Credit Value</label>
                      <input id="input-course-credit-value-12"
                        type="number"
                        value={cgCredits}
                        onChange={e => setCgCredits(e.target.value)}
                        min="1"
                        max="10"
                        step="1"
                        placeholder="3"
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="input-awarded-grade-scale-13" className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Awarded Grade Scale</label>
                      <select id="input-awarded-grade-scale-13"
                        value={cgGrade}
                        onChange={e => setCgGrade(e.target.value as CGPASubject["grade"])}
                        className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      >
                        <option>O</option>
                        <option>A+</option>
                        <option>A</option>
                        <option>B+</option>
                        <option>B</option>
                        <option>C</option>
                        <option>F</option>
                      </select>
                    </div>

                    <div className="sm:col-span-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="text-[10px] text-zinc-500 font-medium">
                        SGPA = total credit-weighted grade points divided by total credits.
                      </p>
                      <div className="flex justify-end gap-3">
                        {cgEditingId && (
                          <button
                            type="button"
                            onClick={cancelCGPAEdit}
                            className={`rounded-lg border px-4 py-2.5 text-xs font-bold transition-all ${isDarkMode ? "border-zinc-800 text-zinc-400 hover:bg-zinc-800/60" : "border-zinc-300 text-zinc-500 hover:bg-zinc-200"}`}
                          >
                            Cancel Edit
                          </button>
                        )}
                        <button
                          type="submit"
                          className="rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                        >
                          {cgEditingId ? "Update Grade Course" : "Log Grade Course"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Semester Grades Ledger Table */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold tracking-wide text-zinc-500 uppercase">Grades Sheet - Semester {selectedSemester}</h4>
                    <div className={`text-xs font-bold text-zinc-400 border px-3 py-1 rounded-lg ${isDarkMode ? "bg-zinc-800/40 border-zinc-800" : "bg-zinc-200/40 border-zinc-300"}`}>
                      SGPA: <strong className="text-[#06B6D4]">{getSGPA(selectedSemester).toFixed(2)}</strong>
                    </div>
                  </div>

                  {cgpaSubjects.filter(s => s.semester === selectedSemester).length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-[560px] w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className={`border-b text-zinc-500 ${isDarkMode ? "border-zinc-800" : "border-zinc-300"}`}>
                            <th className="py-2.5">Subject</th>
                            <th className="py-2.5">Credits</th>
                            <th className="py-2.5">Grade</th>
                            <th className="py-2.5">Points Value</th>
                            <th className="py-2.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cgpaSubjects.filter(s => s.semester === selectedSemester).map(item => (
                            <tr key={item.id} className={`border-b ${isDarkMode ? "border-zinc-800/50 hover:bg-zinc-800/10" : "border-zinc-300/50 hover:bg-zinc-100"}`}>
                              <td className={`py-3 font-semibold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{item.subjectName}</td>
                              <td className="py-3 text-zinc-400">{item.credits}</td>
                              <td className="py-3 font-extrabold text-[#7C3AED]">{item.grade}</td>
                              <td className="py-3 text-zinc-400">{gradePoints[item.grade]}</td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => handleEditCGPASubject(item)}
                                  className="text-zinc-600 hover:text-[#06B6D4] p-1.5 transition-all"
                                  title="Edit course grade"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCGPASubject(item.id)}
                                  className="text-zinc-600 hover:text-red-500 p-1.5 transition-all"
                                  title="Delete course grade"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className={`text-xs text-zinc-500 text-center py-8 border border-dashed rounded-xl ${isDarkMode ? "border-zinc-800" : "border-zinc-300"}`}>
                      No courses logged under Semester {selectedSemester}. Enter course details to compile SGPAs.
                    </p>
                  )}
                </div>

              </div>
  );
}
