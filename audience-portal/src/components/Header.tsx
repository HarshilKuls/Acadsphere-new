"use client";

import React, { useState } from "react";
import { useAcadsphere } from "@/context/AcadsphereContext";
import InstallAppButton from "./InstallAppButton";
import ShareButton from "./ShareButton";
import { Menu, Search, Sun, Moon, PenTool } from "lucide-react";

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
        <Menu className="w-5 h-5 shrink-0" />
      </button>

      <div className="search-wrapper">
        <Search className="w-4 h-4 shrink-0 search-icon" />
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
        <InstallAppButton />
        <ShareButton />

        <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle theme">
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
          )}
        </button>

        <button className="icon-btn" aria-label="Feedback" onClick={() => setActiveTab("Feedback")} title="Feedback">
          <PenTool className="w-4 h-4 shrink-0" />
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
