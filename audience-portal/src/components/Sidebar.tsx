"use client";

import React from "react";
import { usePathname } from "next/navigation";
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
  Newspaper,
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
    { label: "Dashboard", display: "Dashboard", Icon: LayoutDashboard },
    { label: "Timetable / Schedule", display: "Timetable", Icon: CalendarRange },
    { label: "Attendance", Icon: UserCheck },
    { label: "CGPA Calculator", display: "CGPA", Icon: GraduationCap },
    { label: "Marks Predictor", Icon: TrendingUp },
    { label: "Calendar", Icon: CalendarDays },
    { label: "Events / Network", display: "Events", Icon: Code2 },
    { label: "Internship", Icon: Briefcase },
    { label: "Blogs", Icon: Newspaper },
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

      <div className="sidebar-logo" aria-label="Acadsphere">
        <Image src="/icon.png" alt="Acadsphere Logo" width={36} height={36} className="shrink-0 rounded-lg" />
        <div className="flex flex-col sidebar-logo-text">
          <span className="wordmark">ACADSPHERE</span>
          <span className="wordmark-sub">LEARN&nbsp;&nbsp; PLAN&nbsp;&nbsp; GROW</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {mainNavItems.map((tab, index) => {
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
                  className="absolute inset-0 rounded-md"
                  style={{ 
                    zIndex: -1,
                    background: 'linear-gradient(90deg, var(--violet-20), transparent)'
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="nav-index relative z-10">{String(index + 1).padStart(2, "0")}</span>
              <Icon className="w-4 h-4 shrink-0 relative z-10" />
              <span className="relative z-10">{tab.display || tab.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="new-session-btn" onClick={() => { setActiveTab("Timetable / Schedule"); setIsSidebarOpen(false); }}>
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
                  className="absolute inset-0 rounded-md"
                  style={{ 
                    zIndex: -1,
                    background: 'linear-gradient(90deg, var(--violet-20), transparent)'
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 shrink-0 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => { handleSignOut(); setIsSidebarOpen(false); }}
          className="nav-item text-red-500 hover:bg-red-500/10"
          style={{ marginTop: '8px' }}
          data-tooltip="Log Out"
        >
          <LogOut className="w-5 h-5 shrink-0 text-red-500" />
          <span>Log Out</span>
        </button>
      </div>

      <p className="sidebar-manifesto">A more disciplined you<br />A brighter tomorrow.</p>

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
