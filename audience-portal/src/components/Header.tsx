"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAcadsphere } from "@/context/AcadsphereContext";
import InstallAppButton from "./InstallAppButton";
import ShareButton from "./ShareButton";
import { Menu, Search, Bell, ChevronDown, X } from "lucide-react";

export default function Header() {
  const [headerSearch, setHeaderSearch] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    setIsSidebarCollapsed,
    setLibrarySearch,
    activeTab,
    setActiveTab,
    currentUser
  } = useAcadsphere();

  if (!currentUser) return null;

  return (
    <header className="top-nav !px-2 sm:!px-4 md:!px-6 !gap-1 sm:!gap-2 md:!gap-4 w-full max-w-full">
      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[rgba(3,4,10,0.95)] backdrop-blur-md px-4 md:hidden pointer-events-auto">
          <div className="relative flex-1 w-full flex items-center max-w-[400px] mx-auto">
            <Search className="w-4 h-4 absolute left-3 text-[#cec8ff] shrink-0 pointer-events-none" />
            <input
              autoFocus
              type="search"
              className="search-input w-full !pl-10 !pr-10"
              placeholder="Search anything..."
              value={headerSearch}
              onChange={(e) => {
                setHeaderSearch(e.target.value);
                setLibrarySearch(e.target.value);
                if (activeTab !== "E-Library" && e.target.value.length > 2) {
                  setActiveTab("E-Library");
                }
              }}
            />
            <button className="absolute right-3 text-[#9d42ff] hover:text-[#b3a6f2] p-1" onClick={() => setIsMobileSearchOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tablet Hamburger (Hidden on strict mobile because of bottom nav Menu) */}
      <button
        onClick={() => {
          if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            setIsSidebarCollapsed(prev => !prev);
          } else {
            setIsSidebarOpen(prev => !prev);
          }
        }}
        className="icon-btn ham-btn !hidden md:!flex lg:!hidden shrink-0"
        aria-label="Toggle sidebar"
        aria-controls="app-sidebar"
        aria-expanded={isSidebarOpen}
      >
        <Menu className="w-5 h-5 shrink-0" />
      </button>

      {/* Mobile Logo */}
      <div className="flex items-center gap-2 md:hidden shrink-0 min-w-0">
        <Image src="/icon.png" alt="Acadsphere Logo" width={32} height={32} className="rounded-lg shrink-0 shadow-[0_0_12px_var(--violet-glow)]" />
        <span className="text-white font-medium text-sm tracking-widest uppercase truncate hidden min-[380px]:block">Acadsphere</span>
      </div>

      <div className="search-wrapper hidden md:block">
        <Search className="w-4 h-4 shrink-0 search-icon" />
        <input
          type="search"
          className="search-input"
          placeholder="Search anything..."
          value={headerSearch}
          onChange={(e) => {
            setHeaderSearch(e.target.value);
            setLibrarySearch(e.target.value);
            if (activeTab !== "E-Library" && e.target.value.length > 2) {
              setActiveTab("E-Library");
            }
          }}
        />
        <span className="search-key">Ctrl</span>
        <span className="search-key search-key-last">K</span>
      </div>

      <div className="nav-actions flex items-center justify-end flex-1 md:flex-none min-w-0">
        <button 
          className="icon-btn md:!hidden shrink-0" 
          aria-label="Search" 
          onClick={() => {
            setIsMobileSearchOpen(true);
          }}
        >
          <Search className="w-5 h-5 shrink-0" />
        </button>

        <div className="utility-actions flex items-center gap-1 sm:gap-2 shrink-0">
          <InstallAppButton />
          <ShareButton />
        </div>

        <button className="icon-btn notif-btn !hidden md:!flex" aria-label="Feedback" onClick={() => setActiveTab("Feedback")} title="Feedback">
          <Bell className="w-5 h-5 shrink-0" />
          <span className="notif-badge" />
        </button>

        <div className="nav-divider hidden md:block"></div>

        <div
          className="user-chip cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2 shrink-0"
          onClick={() => setActiveTab("Settings")}
          title="Go to Settings"
        >
          <div className="user-info hidden md:block text-right min-w-0">
            <span className="user-name truncate block">{currentUser.fullName}</span>
            <span className="user-role truncate block">{currentUser.college} &bull; {currentUser.year}</span>
          </div>
          <div className="avatar shrink-0">
            {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : "A"}
          </div>
          <ChevronDown className="user-chevron w-4 h-4 hidden md:block shrink-0" />
        </div>
      </div>
    </header>
  );
}
