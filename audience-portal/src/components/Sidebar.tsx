"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAcadsphere } from "@/context/AcadsphereContext";
import {
  LayoutDashboard,
  CalendarRange,
  UserCheck,
  GraduationCap,
  TrendingUp,
  CalendarDays,
  Code2,
  Briefcase,
  BookOpen,
  MessageSquarePlus,
  Plus,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";

export default function Sidebar() {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    activeTab,
    setActiveTab,
    handleSignOut
  } = useAcadsphere();

  const mainNavItems = [
    { label: "Dashboard", Icon: LayoutDashboard },
    { label: "Timetable / Schedule", Icon: CalendarRange },
    { label: "Attendance", Icon: UserCheck },
    { label: "CGPA Calculator", Icon: GraduationCap },
    { label: "Marks Predictor", Icon: TrendingUp },
    { label: "Calendar", Icon: CalendarDays },
    { label: "Events / Network", Icon: Code2 },
    { label: "Internship", Icon: Briefcase },
    { label: "E-Library", Icon: BookOpen },
    { label: "Feedback", Icon: MessageSquarePlus }
  ];

  const footerNavItems = [
    { label: "Settings", Icon: Settings },
    { label: "Support", Icon: HelpCircle }
  ];

  return (
    <aside id="app-sidebar" className={`sidebar ${isSidebarOpen ? "is-open" : ""} ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <button onClick={() => setIsSidebarOpen(false)} className="sidebar-close lg:hidden" aria-label="Close sidebar">
        <X className="w-5 h-5 shrink-0 text-[var(--on-muted)]" />
      </button>

      <div className="sidebar-logo">
        <Image
          src="/Acadshpere website logo.png"
          alt="Acadsphere"
          width={180}
          height={180}
          className="logo-full-image"
          priority
        />
      </div>

      <nav className="sidebar-nav">
        {mainNavItems.map(tab => {
          const isActive = activeTab === tab.label;
          const { Icon } = tab;
          return (
            <button
              key={tab.label}
              onClick={() => {
                setActiveTab(tab.label);
                setIsSidebarOpen(false);
              }}
              className={`nav-item ${isActive ? "active" : ""}`}
              style={{ zIndex: 0 }}
              data-tooltip={tab.label}
            >
              {isActive && (
                <motion.div
                  layoutId="audience-sidebar-highlight"
                  className="absolute inset-0 bg-[var(--violet-20)] rounded-md"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 shrink-0 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="new-session-btn" onClick={() => setActiveTab("Timetable / Schedule")}>
        <Plus className="w-4 h-4 shrink-0" />
        New Session
      </button>

      <div className="sidebar-footer">
        {footerNavItems.map(tab => {
          const isActive = activeTab === tab.label;
          const { Icon } = tab;
          return (
            <button
              key={tab.label}
              onClick={() => {
                setActiveTab(tab.label);
                setIsSidebarOpen(false);
              }}
              className={`nav-item ${isActive ? "active" : ""}`}
              style={{ zIndex: 0 }}
              data-tooltip={tab.label}
            >
              {isActive && (
                <motion.div
                  layoutId="audience-sidebar-highlight"
                  className="absolute inset-0 bg-[var(--violet-20)] rounded-md"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 shrink-0 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={handleSignOut}
          className="nav-item text-red-500 hover:bg-red-500/10"
          style={{ marginTop: '8px' }}
          data-tooltip="Log Out"
        >
          <LogOut className="w-5 h-5 shrink-0 text-red-500" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="sidebar-collapse-btn"
        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="w-5 h-5 shrink-0" />
        ) : (
          <ChevronLeft className="w-5 h-5 shrink-0" />
        )}
        <span>Collapse</span>
      </button>
    </aside>
  );
}
