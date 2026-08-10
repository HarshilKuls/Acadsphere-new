"use client";

import React, { useState } from "react";
import { useAcadsphere } from "@/context/AcadsphereContext";

export default function Header() {
  const [headerSearch, setHeaderSearch] = useState("");
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    setIsSidebarCollapsed,
    setLibrarySearch,
    activeTab,
    setActiveTab,
    toggleTheme,
    isDarkMode,
    currentUser
  } = useAcadsphere();

  if (!currentUser) return null;

  return (
    <header className="top-nav">
      <button
        onClick={() => {
          if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            setIsSidebarCollapsed(prev => !prev);
          } else {
            setIsSidebarOpen(prev => !prev);
          }
        }}
        className="icon-btn ham-btn"
        aria-label="Toggle sidebar"
        aria-controls="app-sidebar"
        aria-expanded={isSidebarOpen}
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <div className="search-wrapper">
        <span className="material-symbols-outlined search-icon">search</span>
        <input
          type="search"
          className="search-input"
          placeholder="Search modules, events, files..."
          value={headerSearch}
          onChange={(e) => {
            setHeaderSearch(e.target.value);
            setLibrarySearch(e.target.value);
            if (activeTab !== "E-Library" && e.target.value.length > 2) {
              setActiveTab("E-Library");
            }
          }}
        />
      </div>

      <div className="nav-actions">
        <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle theme">
          <span className="material-symbols-outlined">
            {isDarkMode ? "light_mode" : "dark_mode"}
          </span>
        </button>

        <button className="icon-btn" aria-label="History" onClick={() => setActiveTab("Feedback")}>
          <span className="material-symbols-outlined">history_edu</span>
        </button>

        <div className="nav-divider"></div>

        <div
          className="user-chip cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setActiveTab("Settings")}
          title="Go to Settings"
        >
          <div className="user-info">
            <span className="user-name">{currentUser.fullName}</span>
            <span className="user-role">{currentUser.college} &bull; {currentUser.year}</span>
          </div>
          <div className="avatar">
            {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
