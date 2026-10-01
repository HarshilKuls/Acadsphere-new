"use client";

import React from "react";
import DashboardView from "@/components/Dashboard/DashboardView";
import { useAcadsphere } from "@/context/AcadsphereContext";

export default function DashboardPage() {
  const {
    currentUser,
    todaysClasses,
    healthData,
    currentDayName,
    overallCGPA,
    eventsFeed,
    nextClass,
    cumulativeAttendancePercent,
    timetable,
    calendarEvents,
    internshipsFeed,
    libraryFeed,
    setActiveTab,
    triggerToast,
    attendance,
    cgpaSubjects,
    predictions
  } = useAcadsphere();

  if (!currentUser) return null;

  const totalXp = (timetable.length * 50) + (attendance.length * 20) + (cgpaSubjects.length * 100) + (calendarEvents.length * 10) + (predictions.length * 10);
  const momentum = cumulativeAttendancePercent > 75 ? 12 : cumulativeAttendancePercent > 60 ? 5 : 2;

  return (
    <DashboardView
      currentUser={currentUser}
      todaysClasses={todaysClasses}
      healthData={healthData}
      currentDayName={currentDayName}
      overallCGPA={overallCGPA}
      eventsFeed={eventsFeed}
      nextClass={nextClass}
      cumulativeAttendancePercent={cumulativeAttendancePercent}
      timetable={timetable}
      calendarEvents={calendarEvents}
      internshipsFeed={internshipsFeed}
      libraryFeed={libraryFeed}
      setActiveTab={setActiveTab}
      triggerToast={triggerToast}
      totalXp={totalXp}
      momentum={momentum}
    />
  );
}
