"use client";

import React from "react";
import { useAcadsphere } from "@/context/AcadsphereContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  TrendingUp,
  CalendarDays,
  Briefcase,
  BookOpen,
  Newspaper,
  Plus,
  Settings,
  HelpCircle,
  UserCircle,
  LogOut,
  ChevronRight,
  Search,
  LayoutDashboard
} from "lucide-react";

export default function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { setActiveTab, handleSignOut, currentUser } = useAcadsphere();

  const menuItems = [
    { label: "Dashboard", Icon: LayoutDashboard },
    { label: "CGPA Calculator", Icon: GraduationCap },
    { label: "Marks Predictor", Icon: TrendingUp },
    { label: "Calendar", Icon: CalendarDays },
    { label: "Internship", Icon: Briefcase },
    { label: "E-Library", Icon: BookOpen },
    { label: "Blogs", Icon: Newspaper },
    { label: "Timetable / Schedule", display: "New Session", Icon: Plus },
    { label: "Settings", Icon: Settings },
    { label: "Support", Icon: HelpCircle },
    { label: "Settings", display: "Profile", Icon: UserCircle },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed inset-0 z-[40] bg-[#03040a] flex flex-col pb-16 md:hidden"
      >
        <div className="flex-1 overflow-y-auto px-6 pt-24 pb-8">
          <div className="mb-8">
            <span className="text-[10px] font-bold text-[#8a3ffc] tracking-widest uppercase mb-2 block">
              Menu
            </span>
            <h2 className="text-3xl font-bold text-white tracking-wide">More</h2>
          </div>

          <div className="flex flex-col gap-1">
            {menuItems.map((item, idx) => {
              const { Icon } = item;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab(item.label);
                    onClose();
                  }}
                  className="flex items-center justify-between w-full py-4 border-b border-[#ffffff10] active:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4 text-[#eceaff]">
                    <Icon className="w-5 h-5 text-[#9b96c5]" />
                    <span className="text-sm font-semibold tracking-wide">
                      {item.display || item.label}
                    </span>
                  </div>
                </button>
              );
            })}
            
            <button
              onClick={() => {
                handleSignOut();
                onClose();
              }}
              className="flex items-center justify-between w-full py-4 active:bg-white/5 transition-colors group mt-2"
            >
              <div className="flex items-center gap-4 text-red-500">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-semibold tracking-wide group-hover:text-red-400">
                  Log Out
                </span>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
