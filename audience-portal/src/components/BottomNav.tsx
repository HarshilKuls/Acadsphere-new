"use client";

import React from "react";
import { useAcadsphere } from "@/context/AcadsphereContext";
import { LayoutDashboard, CalendarRange, UserCheck, Code2, Menu } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav({ onMenuClick, isMenuOpen, onCloseMenu }: { onMenuClick: () => void, isMenuOpen: boolean, onCloseMenu: () => void }) {
  const { activeTab, setActiveTab } = useAcadsphere();

  const navItems = [
    { id: "dashboard", label: "Dashboard", display: "Dashboard", Icon: LayoutDashboard },
    { id: "timetable", label: "Timetable / Schedule", display: "Schedule", Icon: CalendarRange },
    { id: "attendance", label: "Attendance", display: "Attendance", Icon: UserCheck },
    { id: "events", label: "Events / Network", display: "Events", Icon: Code2 },
    { id: "menu", label: "Menu", display: "Menu", Icon: Menu, isMenuBtn: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-[#090b16]/90 backdrop-blur-xl border-t border-[var(--outline-dim)] pb-safe md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.isMenuBtn ? isMenuOpen : (!isMenuOpen && activeTab === item.label);
          const { Icon } = item;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isMenuBtn) {
                  onMenuClick();
                } else {
                  setActiveTab(item.label);
                  onCloseMenu();
                }
              }}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${
                isActive ? "text-[var(--violet-bright)]" : "text-[#9b96c5] hover:text-[#eceaff]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 w-8 h-0.5 bg-[var(--violet-bright)] rounded-b-full shadow-[0_0_8px_var(--violet-bright)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_8px_var(--violet-50)]" : ""}`} />
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? "font-bold" : ""}`}>
                {item.display}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
