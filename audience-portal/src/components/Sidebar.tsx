"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAcadsphere } from "@/context/AcadsphereContext";

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

  return (
    <aside id="app-sidebar" className={`sidebar ${isSidebarOpen ? "is-open" : ""} ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <button onClick={() => setIsSidebarOpen(false)} className="sidebar-close lg:hidden" aria-label="Close sidebar">
        <span className="material-symbols-outlined">close</span>
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
        {[
          { label: "Dashboard", icon: "dashboard", fill: true },
          { label: "Timetable / Schedule", icon: "calendar_month", fill: false },
          { label: "Attendance", icon: "how_to_reg", fill: false },
          { label: "CGPA Calculator", icon: "grade", fill: false },
          { label: "Marks Predictor", icon: "analytics", fill: false },
          { label: "Calendar", icon: "calendar_today", fill: false },
          { label: "Events / Network", icon: "code", fill: false },
          { label: "Internship", icon: "work", fill: false },
          { label: "E-Library", icon: "local_library", fill: false },
          { label: "Feedback", icon: "rate_review", fill: false }
        ].map(tab => {
          const isActive = activeTab === tab.label;
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
              <span className="material-symbols-outlined relative z-10" style={{ fontVariationSettings: isActive || tab.fill ? "'FILL' 1" : "'FILL' 0" }}>
                {tab.icon}
              </span>
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="new-session-btn" onClick={() => setActiveTab("Timetable / Schedule")}>
        <span className="material-symbols-outlined">add</span>
        New Session
      </button>

      <div className="sidebar-footer">
        {[
          { label: "Settings", icon: "settings" },
          { label: "Support", icon: "help_outline" }
        ].map(tab => {
          const isActive = activeTab === tab.label;
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
              <span className="material-symbols-outlined relative z-10">
                {tab.icon}
              </span>
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
          <span className="material-symbols-outlined">logout</span>
          <span>Log Out</span>
        </button>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="sidebar-collapse-btn"
        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <span className="material-symbols-outlined">
          {isSidebarCollapsed ? "chevron_right" : "chevron_left"}
        </span>
        <span>Collapse</span>
      </button>
    </aside>
  );
}
