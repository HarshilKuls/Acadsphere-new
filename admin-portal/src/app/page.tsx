"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Code2, 
  Briefcase, 
  BookOpen, 
  Sun, 
  Moon, 
  LogOut, 
  Plus, 
  Trash2, 
  Sparkles, 
  Menu, 
  X, 
  ShieldAlert, 
  Users, 
  Sliders, 
  Edit,
  UserX,
  Mail,
  Lock,
  PlusCircle,
  CalendarDays,
  MessageSquare
} from "lucide-react";
import { adminDb, hashPassword, supabase, AdminAccount, EventEntry, InternshipEntry, LibraryResource, ReportedAccount, NonConfidentialUser, HolidayEntry, FeedbackEntry } from "@/lib/db";
import { registerAdminAction } from "./actions";

export default function Home() {
  // --- Hydration state ---
  const [mounted, setMounted] = useState(false);

  // --- Theme State ---
  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- Auth Session States ---
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);
  
  // Login Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // --- UI Layout Navigation ---
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Ecosystem Data States ---
  const [adminsList, setAdminsList] = useState<AdminAccount[]>([]);
  const [eventsFeed, setEventsFeed] = useState<EventEntry[]>([]);
  const [internshipsFeed, setInternshipsFeed] = useState<InternshipEntry[]>([]);
  const [libraryFeed, setLibraryResourceFeed] = useState<LibraryResource[]>([]);
  const [reportedAccounts, setReportedAccounts] = useState<ReportedAccount[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<NonConfidentialUser[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Holiday states
  const [holidaysFeed, setHolidaysFeed] = useState<HolidayEntry[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);
  const [holId, setHolId] = useState<string | null>(null);
  const [holTitle, setHolTitle] = useState("");
  const [holDescription, setHolDescription] = useState("");
  const [holDate, setHolDate] = useState("");
  const [holType, setHolType] = useState<'holiday' | 'exam' | 'deadline' | 'reminder'>('holiday');
  const [holColor, setHolColor] = useState<'violet' | 'cyan' | 'amber' | 'rose'>('violet');

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger brief alert toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- CRUD Interactive States ---
  // Event Add/Edit
  const [evId, setEvId] = useState<string | null>(null);
  const [evTitle, setEvTitle] = useState("");
  const [evDescription, setEvDescription] = useState("");
  const [evOrganizer, setEvOrganizer] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evLocation, setEvLocation] = useState("");
  const [evLink, setEvLink] = useState("");
  const [evImage, setEvImage] = useState("");
  const [evTags, setEvTags] = useState("");
  const [evCategory, setEvCategory] = useState<'Competition/Event' | 'News/Announcement'>('Competition/Event');

  // Internship Add/Edit
  const [intId, setIntId] = useState<string | null>(null);
  const [intTitle, setIntTitle] = useState("");
  const [intCompany, setIntCompany] = useState("");
  const [intLink, setIntLink] = useState("");
  const [intDuration, setIntDuration] = useState("");
  const [intStipend, setIntStipend] = useState("");
  const [intQualification, setIntQualification] = useState("");
  const [intLocation, setIntLocation] = useState("");
  const [intDesc, setIntDesc] = useState("");

  // E-Library Add/Edit
  const [libId, setLibId] = useState<string | null>(null);
  const [libTitle, setLibTitle] = useState("");
  const [libCategory, setLibCategory] = useState<'Notes' | 'E-Books' | 'Resource Links' | 'PYQs'>('Notes');
  const [libSubject, setLibSubject] = useState("");
  const [libDescription, setLibDescription] = useState("");
  const [libFileLink, setLibFileLink] = useState("");
  const [libExternalLink, setLibExternalLink] = useState("");

  // Admin Access Control additions
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<'Normal Admin' | 'Master Admin'>('Normal Admin');
  const [permContent, setPermContent] = useState(true);
  const [permUsers, setPermUsers] = useState(false);

  // Client init
  useEffect(() => {
    const mountFrame = requestAnimationFrame(() => setMounted(true));
    
    // Read theme preference
    const savedTheme = localStorage.getItem("acadsphere_admin_theme");
    const isDark = savedTheme ? savedTheme === "dark" : true;
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    const themeFrame = requestAnimationFrame(() => setIsDarkMode(isDark));

    adminDb.getCurrentAdmin().then(setCurrentAdmin).catch(() => setCurrentAdmin(null));

    return () => {
      cancelAnimationFrame(mountFrame);
      cancelAnimationFrame(themeFrame);
    };
  }, []);

  // Fetch data
  useEffect(() => {
    if (!currentAdmin) return;
    
    adminDb.getAdmins().then(setAdminsList).catch(() => setAdminsList([]));
    const reportedFrame = requestAnimationFrame(() => setReportedAccounts(adminDb.getReportedAccounts()));
    const loadLiveContent = async () => {
      try {
        const [events, internships, library, holidays, users, feedback] = await Promise.all([
          adminDb.getEvents(), adminDb.getInternships(), adminDb.getLibrary(), adminDb.getHolidays(), adminDb.getNonConfidentialUsers(), adminDb.getFeedback()
        ]);
        setEventsFeed(events);
        setInternshipsFeed(internships);
        setLibraryResourceFeed(library);
        setHolidaysFeed(holidays);
        setRegisteredUsers(users);
        setFeedbackList(feedback);
      } catch (error) {
        triggerToast(error instanceof Error ? error.message : "Unable to load live admin content.");
      }
    };
    loadLiveContent();

    const contentChannel = supabase
      .channel("admin-live-content")
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, loadLiveContent)
      .on("postgres_changes", { event: "*", schema: "public", table: "internships" }, loadLiveContent)
      .on("postgres_changes", { event: "*", schema: "public", table: "e_library" }, loadLiveContent)
      .on("postgres_changes", { event: "*", schema: "public", table: "holidays" }, loadLiveContent)
      .on("postgres_changes", { event: "*", schema: "public", table: "feedback" }, loadLiveContent)
      .subscribe();

    return () => {
      cancelAnimationFrame(reportedFrame);
      supabase.removeChannel(contentChannel);
    };
  }, [currentAdmin, activeTab]);

  // Theme toggle
  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    localStorage.setItem("acadsphere_admin_theme", nextDark ? "dark" : "light");
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    triggerToast(`Theme switched to ${nextDark ? "Dark" : "Light"}`);
  };

  // ----------------------------------------------------
  // AUTH PORTAL LOGIN CHECKING (SUPABASE AUTH + ADMIN ROLE)
  // ----------------------------------------------------
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsValidating(true);

    if (!email || !password) {
      setLoginError("Please enter both email and password.");
      setIsValidating(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.toLowerCase(), password });
      if (error) {
        setLoginError("Invalid login credentials or unauthorized access.");
        return;
      }
      const adminMatch = await adminDb.getCurrentAdmin(email.toLowerCase());

      if (!adminMatch) {
        await supabase.auth.signOut();
        setLoginError("Access Denied. This account is not registered as an administrator.");
        return;
      }

      setCurrentAdmin(adminMatch);
      triggerToast(`Access Granted • Welcome ${adminMatch.fullName}`);
    } catch {
      setLoginError("A security error occurred during hashing verification.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleAdminSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentAdmin(null);
    setActiveTab("Dashboard");
    triggerToast("Logged out of administrative system.");
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B] text-[#F4F4F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent"></div>
          <span className="text-sm font-medium text-zinc-400">Loading Acadsphere Admin Command...</span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTH LOGIN PANEL FOR ADMIN
  // ----------------------------------------------------
  if (!currentAdmin) {
    return (
      <div className={`flex min-h-screen items-center justify-center p-4 transition-colors duration-500 ${isDarkMode ? "bg-[#09090B] text-[#F4F4F5]" : "bg-[#FAFAFA] text-[#09090B]"}`}>
        
        {isDarkMode && (
          <>
            <div className="pointer-events-none absolute top-10 left-10 h-72 w-72 rounded-full bg-[#7C3AED]/10 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-[#06B6D4]/10 blur-[120px]" />
          </>
        )}

        <div className={`relative w-full max-w-md overflow-hidden rounded-2xl border p-8 shadow-2xl transition-all duration-300 ${isDarkMode ? "border-zinc-800 bg-[#121214] shadow-black/50" : "border-zinc-200 bg-white shadow-zinc-200"}`}>
          
          <div className="mb-8 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#06B6D4]/15 text-[#06B6D4] mb-3">
              <Sliders className="h-6 w-6 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Acadsphere Admin</h1>
            <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase mt-1">Ecosystem Management Portal</p>
          </div>

          {loginError && (
            <div className="mb-4 rounded-lg bg-red-500/15 border border-red-500/30 p-3 text-xs font-semibold text-red-500">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> Email ID
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@acadsph.com"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-all ${isDarkMode ? "border-zinc-800 bg-[#18181B] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" /> Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-all ${isDarkMode ? "border-zinc-800 bg-[#18181B] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
              />
            </div>

            <button
              type="submit"
              disabled={isValidating}
              className="w-full rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] px-4 py-2.5 text-sm font-semibold text-white transition-all shadow-lg shadow-[#06B6D4]/20 active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
            >
              {isValidating ? "Signing in..." : "Sign In to Admin Portal"}
            </button>
          </form>

          <button
            onClick={toggleTheme}
            className={`absolute top-4 right-4 p-2 rounded-lg border transition-all ${isDarkMode ? "border-zinc-800 bg-[#1c1c1f] text-[#06B6D4] hover:bg-zinc-800" : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100"}`}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // INTERACTIVE MODULE HANDLERS
  // ----------------------------------------------------
  
  // Events CRUD
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle) {
      triggerToast("Event/Announcement title is required.");
      return;
    }

    try {
    const saved = await adminDb.saveEvent({
      id: evId || undefined,
      title: evTitle,
      description: evDescription || undefined,
      organizer: evOrganizer || undefined,
      date: evDate || undefined,
      location: evLocation || undefined,
      applyLink: evLink || undefined,
      image: evImage || undefined,
      tags: evTags || undefined,
      category: evCategory
    });

    if (evId) {
      setEventsFeed(eventsFeed.map(evt => evt.id === evId ? saved : evt));
      triggerToast("Event content updated!");
    } else {
      setEventsFeed([...eventsFeed, saved]);
      triggerToast("New Event broadcast successfully!");
    }

    // Reset Form
    setEvId(null);
    setEvTitle("");
    setEvDescription("");
    setEvOrganizer("");
    setEvDate("");
    setEvLocation("");
    setEvLink("");
    setEvImage("");
    setEvTags("");
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Event could not be saved.");
    }
  };

  const handleEditEvent = (evt: EventEntry) => {
    setEvId(evt.id);
    setEvTitle(evt.title);
    setEvDescription(evt.description || "");
    setEvOrganizer(evt.organizer || "");
    setEvDate(evt.date || "");
    setEvLocation(evt.location || "");
    setEvLink(evt.applyLink || "");
    setEvImage(evt.image || "");
    setEvTags(evt.tags || "");
    setEvCategory(evt.category);
    triggerToast(`Editing: ${evt.title}`);
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await adminDb.deleteEvent(id);
      setEventsFeed(eventsFeed.filter(evt => evt.id !== id));
      triggerToast("Event node permanently deleted.");
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Event could not be deleted.");
    }
  };

  // Internships CRUD
  const handleSaveInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intTitle) {
      triggerToast("Internship Role Title is required.");
      return;
    }

    try {
    const saved = await adminDb.saveInternship({
      id: intId || undefined,
      title: intTitle,
      companyName: intCompany || undefined,
      applyLink: intLink || undefined,
      duration: intDuration || undefined,
      stipend: intStipend || undefined,
      qualification: intQualification || undefined,
      location: intLocation || undefined,
      description: intDesc || undefined
    });

    if (intId) {
      setInternshipsFeed(internshipsFeed.map(i => i.id === intId ? saved : i));
      triggerToast("Internship updated!");
    } else {
      setInternshipsFeed([...internshipsFeed, saved]);
      triggerToast("Internship logged!");
    }

    // Reset Form
    setIntId(null);
    setIntTitle("");
    setIntCompany("");
    setIntLink("");
    setIntDuration("");
    setIntStipend("");
    setIntQualification("");
    setIntLocation("");
    setIntDesc("");
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Internship could not be saved.");
    }
  };

  const handleEditInternship = (item: InternshipEntry) => {
    setIntId(item.id);
    setIntTitle(item.title);
    setIntCompany(item.companyName || "");
    setIntLink(item.applyLink || "");
    setIntDuration(item.duration || "");
    setIntStipend(item.stipend || "");
    setIntQualification(item.qualification || "");
    setIntLocation(item.location || "");
    setIntDesc(item.description || "");
    triggerToast(`Editing: ${item.companyName}`);
  };

  const handleDeleteInternship = async (id: string) => {
    try {
      await adminDb.deleteInternship(id);
      setInternshipsFeed(internshipsFeed.filter(i => i.id !== id));
      triggerToast("Internship deleted.");
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Internship could not be deleted.");
    }
  };

  // E-Library CRUD
  const handleSaveLibrary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!libTitle) {
      triggerToast("Resource title required.");
      return;
    }

    try {
    const saved = await adminDb.saveLibrary({
      id: libId || undefined,
      title: libTitle,
      category: libCategory,
      subject: libSubject || undefined,
      description: libDescription || undefined,
      fileLink: libFileLink || undefined,
      externalLink: libExternalLink || undefined
    });

    if (libId) {
      setLibraryResourceFeed(libraryFeed.map(l => l.id === libId ? saved : l));
      triggerToast("E-Library index updated!");
    } else {
      setLibraryResourceFeed([...libraryFeed, saved]);
      triggerToast("E-Library resource added!");
    }

    // Reset Form
    setLibId(null);
    setLibTitle("");
    setLibSubject("");
    setLibDescription("");
    setLibFileLink("");
    setLibExternalLink("");
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Library resource could not be saved.");
    }
  };

  const handleEditLibrary = (item: LibraryResource) => {
    setLibId(item.id);
    setLibTitle(item.title);
    setLibCategory(item.category);
    setLibSubject(item.subject || "");
    setLibDescription(item.description || "");
    setLibFileLink(item.fileLink || "");
    setLibExternalLink(item.externalLink || "");
    triggerToast(`Editing resource: ${item.title}`);
  };

  const handleDeleteLibrary = async (id: string) => {
    try {
      await adminDb.deleteLibrary(id);
      setLibraryResourceFeed(libraryFeed.filter(l => l.id !== id));
      triggerToast("Resource deleted.");
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Resource could not be deleted.");
    }
  };

  // Moderation Banning handlers
  const toggleBanStatus = async (report: ReportedAccount) => {
    if (currentAdmin.role !== 'Master Admin' && !currentAdmin.permissions.manageUsers) {
      triggerToast("Access Denied: Missing user moderation permissions.");
      return;
    }

    const nextStatus = report.status === 'Banned' ? 'Resolved' : 'Banned';
    adminDb.saveReportStatus(report.id, nextStatus);
    
    setReportedAccounts(reportedAccounts.map(r => r.id === report.id ? { ...r, status: nextStatus } : r));
    triggerToast(nextStatus === 'Banned' ? `Suspended email: ${report.email}` : `Restored email: ${report.email}`);

    // Synchronize registered students directory state in real-time
    const updatedUsers = await adminDb.getNonConfidentialUsers();
    setRegisteredUsers(updatedUsers);
  };

  const handleDirectBanToggle = async (user: NonConfidentialUser) => {
    if (currentAdmin.role !== 'Master Admin' && !currentAdmin.permissions.manageUsers) {
      triggerToast("Access Denied: Missing user moderation permissions.");
      return;
    }

    if (user.status === 'Banned') {
      adminDb.unbanUserEmailDirectly(user.email);
      triggerToast(`Restored system access for: ${user.fullName}`);
    } else {
      adminDb.banUserEmailDirectly(user.email, "Suspended by Administrator");
      triggerToast(`Account suspended: ${user.fullName}`);
    }

    // Refresh non-confidential directory state
    const updatedUsers = await adminDb.getNonConfidentialUsers();
    setRegisteredUsers(updatedUsers);

    // Refresh reported accounts list to reflect dynamic bans
    setReportedAccounts(adminDb.getReportedAccounts());
  };

  // Holidays CRUD handlers
  const handleSaveHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holTitle || !holDate) {
      triggerToast("Holiday/Event title and date are required.");
      return;
    }

    try {
    const saved = await adminDb.saveHoliday({
      id: holId || undefined,
      title: holTitle,
      description: holDescription || undefined,
      date: holDate,
      type: holType,
      color: holColor
    });

    if (holId) {
      setHolidaysFeed(holidaysFeed.map(h => h.id === holId ? saved : h));
      triggerToast("Holiday schedule updated!");
    } else {
      setHolidaysFeed([...holidaysFeed, saved]);
      triggerToast("Academic event published successfully!");
    }

    // Reset Form
    setHolId(null);
    setHolTitle("");
    setHolDescription("");
    setHolDate("");
    setHolType("holiday");
    setHolColor("violet");
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Calendar event could not be saved.");
    }
  };

  const handleEditHoliday = (h: HolidayEntry) => {
    setHolId(h.id);
    setHolTitle(h.title);
    setHolDescription(h.description || "");
    setHolDate(h.date);
    setHolType(h.type);
    setHolColor(h.color || "violet");
    triggerToast(`Editing: ${h.title}`);
  };

  const handleDeleteHoliday = async (id: string) => {
    try {
      await adminDb.deleteHoliday(id);
      setHolidaysFeed(holidaysFeed.filter(h => h.id !== id));
      triggerToast("Calendar event deleted.");
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : "Calendar event could not be deleted.");
    }
  };

  // Admin creation control (Master Only)
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin || currentAdmin.role !== 'Master Admin') {
      triggerToast("Master privilege required to instantiate administrators.");
      return;
    }
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPass.trim()) {
      triggerToast("All parameters required.");
      return;
    }

    try {
      triggerToast("Registering administrator account...");
      const res = await registerAdminAction({
        fullName: newAdminName,
        email: newAdminEmail,
        role: newAdminRole,
        permissions: {
          manageContent: permContent,
          manageUsers: permUsers
        },
        passwordPlain: newAdminPass
      });

      if (!res.success) {
        triggerToast(`Registration failed: ${res.error}`);
        return;
      }

      if (res.admin) {
        setAdminsList([...adminsList, res.admin]);
        setNewAdminName("");
        setNewAdminEmail("");
        setNewAdminPass("");
        triggerToast(`Administrator registered successfully: ${res.admin.fullName}`);
      }
    } catch (error: any) {
      triggerToast(error.message || "An unexpected error occurred during admin registration.");
    }
  };

  const handleRemoveAdmin = (id: string, name: string) => {
    if (currentAdmin.role !== 'Master Admin') return;
    if (id === currentAdmin.id) {
      triggerToast("Self-revocation of master credentials is prohibited.");
      return;
    }

    adminDb.deleteAdmin(id);
    setAdminsList(adminsList.filter(a => a.id !== id));
    triggerToast(`Revoked privileges for: ${name}`);
  };

  // ----------------------------------------------------
  // PRIMARY PORTAL RENDER SHAPE
  // ----------------------------------------------------
  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "bg-[#09090B] text-[#F4F4F5]" : "bg-[#FAFAFA] text-[#09090B]"}`}>
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 rounded-xl glass-panel border border-[#06B6D4]/40 bg-[#06B6D4]/10 px-4 py-3 text-xs font-semibold text-white shadow-xl shadow-black/30 flex items-center gap-2 animate-bounce">
          <Sparkles className="h-4 w-4 text-[#7C3AED]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MOBILE HEADER BAR */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b px-4 ${isDarkMode ? "border-zinc-800 bg-[#09090B]" : "border-zinc-200 bg-white"}`}>
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-[#06B6D4]" />
          <span className="font-bold tracking-tight text-sm">Acadsphere Admin</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-2 rounded-lg border ${isDarkMode ? "border-zinc-800 bg-zinc-900 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-800"}`}
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* MAIN CONTAINER TABS */}
      <main className="flex-1 w-full p-4 lg:p-8 mt-14 lg:mt-0 mr-0 lg:mr-64 transition-all duration-300">
        
        {/* TOP HEADER CONTROLS */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-zinc-500 uppercase">SYSTEM ADMINISTRATOR COMMAND</span>
              <div className="h-1.5 w-1.5 rounded-full bg-[#7C3AED] animate-ping" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">{activeTab}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 justify-end">
                {currentAdmin.fullName} 
                <span className="text-[9px] bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-white font-extrabold px-1.5 py-0.5 rounded uppercase">
                  {currentAdmin.role}
                </span>
              </span>
              <span className="text-[10px] text-zinc-500 font-semibold">{currentAdmin.email}</span>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all glass-card ${isDarkMode ? "border-zinc-800 bg-[#131315] text-[#06B6D4]" : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100"}`}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------
            TAB 1: ADMIN DASHBOARD
            ---------------------------------------------------- */}
        {activeTab === "Dashboard" && (
          <div className="space-y-6">
            
            {/* Elegant Welcome glassmorphic Banner */}
            <div className={`relative overflow-hidden rounded-2xl border p-6 ${isDarkMode ? "border-zinc-800 bg-zinc-900/40" : "border-zinc-200 bg-zinc-50"}`}>
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    Welcome back, Master Admin Harshil <Sparkles className="h-4.5 w-4.5 text-[#06B6D4] animate-float" />
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1 max-w-lg">
                    Admin session: <span className="text-[#06B6D4] font-bold">Authenticated</span>. Dual-mode synchronization logs: <span className="text-emerald-400 font-bold">Synced</span>. Row Level Security active.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-[#06B6D4]/10 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#06B6D4]/20">
                  <ShieldAlert className="h-4 w-4 text-[#7C3AED]" />
                  <span>Secure Encryption Check: Hashed</span>
                </div>
              </div>
            </div>

            {/* HIGH-FIDELITY ADMINISTRATIVE STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-card rounded-2xl p-5 text-center">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Ecosystem Students</span>
                <span className="text-4xl font-extrabold text-[#7C3AED] tracking-tight">{registeredUsers.length}</span>
              </div>
              
              <div className="glass-card rounded-2xl p-5 text-center">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Active Hackathons / Events</span>
                <span className="text-4xl font-extrabold text-[#06B6D4] tracking-tight">{eventsFeed.filter(e => e.category === 'Competition/Event').length}</span>
              </div>

              <div className="glass-card rounded-2xl p-5 text-center">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Internship listings</span>
                <span className="text-4xl font-extrabold text-white tracking-tight">{internshipsFeed.length}</span>
              </div>

              <div className="glass-card rounded-2xl p-5 text-center">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Banned Registries</span>
                <span className="text-4xl font-extrabold text-red-500 tracking-tight">
                  {reportedAccounts.filter(r => r.status === 'Banned').length}
                </span>
              </div>

            </div>

            {/* LIVE FEED RECENT LOGS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* Flagged Accounts Log */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-800/40 pb-3">
                  <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase flex items-center gap-1.5">
                    <UserX className="h-3.5 w-3.5 text-red-500" /> Flagged Account Reports
                  </h3>
                  <span className="text-[9px] font-bold text-zinc-500">Action Required</span>
                </div>

                <div className="space-y-3.5">
                  {reportedAccounts.slice(0, 3).map(rep => (
                    <div key={rep.id} className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/10 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-white block">{rep.fullName}</span>
                        <span className="text-[10px] text-zinc-500 font-semibold">{rep.email}</span>
                        <p className="text-[11px] text-zinc-400 mt-1 italic font-medium">&quot;{rep.reason}&quot;</p>
                      </div>
                      
                      <button
                        onClick={() => toggleBanStatus(rep)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${rep.status === 'Banned' ? "bg-red-500/15 border-red-500/30 text-red-500" : "bg-[#06B6D4]/15 border-[#06B6D4]/30 text-white hover:bg-[#06B6D4]/30"}`}
                      >
                        {rep.status === 'Banned' ? "Banned Account" : "Flag / Ban User"}
                      </button>
                    </div>
                  ))}
                  {reportedAccounts.length === 0 && (
                    <div className="text-center text-xs text-zinc-500 p-4 border border-dashed border-zinc-800/40 rounded-xl">
                      No pending reports. System secure.
                    </div>
                  )}
                </div>
              </div>

              {/* Active Admin permissions map */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-800/40 pb-3">
                  <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-[#06B6D4]" /> Administrative Security Grid
                  </h3>
                  <span className="text-[9px] font-bold text-zinc-500">{adminsList.length} Accounts mapped</span>
                </div>

                <div className="space-y-3">
                  {adminsList.map(a => (
                    <div key={a.id} className="p-3 rounded-xl border border-zinc-800 bg-[#161618] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">{a.fullName}</span>
                        <span className="text-[10px] text-zinc-500 font-medium">{a.email} • {a.role}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${a.permissions.manageContent ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border-transparent"}`}>
                          Content
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${a.permissions.manageUsers ? "bg-[#06B6D4]/10 text-white border-[#06B6D4]/20" : "bg-zinc-800 text-zinc-500 border-transparent"}`}>
                          Users
                        </span>
                      </div>
                    </div>
                  ))}
                  {adminsList.length === 0 && (
                    <div className="text-center text-xs text-zinc-500 p-4 border border-dashed border-zinc-800/40 rounded-xl">
                      No admin mapping found.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 2: EVENTS & ANNOUNCEMENTS MANAGER
            ---------------------------------------------------- */}
        {activeTab === "Events / Network" && (
          <div className="space-y-6">
            
            {/* Input Form */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-[#06B6D4]" /> 
                {evId ? `Modify Announcement: ${evTitle}` : "Create Competition / Announcement Nodes"}
              </h3>

              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Title (Required)</label>
                    <input 
                      type="text" 
                      value={evTitle} 
                      onChange={e => setEvTitle(e.target.value)} 
                      placeholder=" Genesis Hack 2026"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Type Categories</label>
                    <select 
                      value={evCategory} 
                      onChange={e => setEvCategory(e.target.value as EventEntry["category"])}
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    >
                      <option>Competition/Event</option>
                      <option>News/Announcement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Organizer (Optional)</label>
                    <input 
                      type="text" 
                      value={evOrganizer} 
                      onChange={e => setEvOrganizer(e.target.value)} 
                      placeholder="Google GDSC"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Date (Optional)</label>
                    <input 
                      type="text" 
                      value={evDate} 
                      onChange={e => setEvDate(e.target.value)} 
                      placeholder="June 12-14, 2026"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Location (Optional)</label>
                    <input 
                      type="text" 
                      value={evLocation} 
                      onChange={e => setEvLocation(e.target.value)} 
                      placeholder="San Francisco, CA"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Registration / CTA Link</label>
                    <input 
                      type="text" 
                      value={evLink} 
                      onChange={e => setEvLink(e.target.value)} 
                      placeholder="https://hack.google.com"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Image URL (Optional)</label>
                    <input 
                      type="text" 
                      value={evImage} 
                      onChange={e => setEvImage(e.target.value)} 
                      placeholder="https://unsplash.com/..."
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Description (Optional)</label>
                  <textarea 
                    rows={2}
                    value={evDescription}
                    onChange={e => setEvDescription(e.target.value)}
                    placeholder="48-hour build-a-thon focusing on AI..."
                    className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  {evId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEvId(null);
                        setEvTitle("");
                        setEvDescription("");
                      }}
                      className="px-3.5 py-2 text-xs font-bold border border-zinc-800 rounded-lg text-zinc-400 hover:bg-zinc-800"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                  >
                    {evId ? "Save Changes" : "Broadcast Event"}
                  </button>
                </div>
              </form>
            </div>

            {/* List */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4">Active Ecosystem Events Feed</h3>
              
              <div className="space-y-3">
                {eventsFeed.map(evt => (
                  <div key={evt.id} className="p-3.5 border border-zinc-800 bg-zinc-900/10 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white block">{evt.title}</span>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded border uppercase ${evt.category === 'Competition/Event' ? "bg-[#06B6D4]/15 border-[#06B6D4]/30 text-white" : "bg-amber-500/15 border-amber-500/30 text-amber-400"}`}>
                          {evt.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-semibold">{evt.organizer || "No Organizer"} • {evt.date || "No Date"}</span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditEvent(evt)}
                        className="text-zinc-400 hover:text-white p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all"
                        title="Edit Item"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="text-red-500 hover:text-red-400 p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all"
                        title="Delete Item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {eventsFeed.length === 0 && (
                  <div className="text-center text-xs text-zinc-500 py-8 border border-dashed border-zinc-800/40 rounded-xl">
                    No active ecosystem events published.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 3: INTERNSHIP MANAGER MODULE
            ---------------------------------------------------- */}
        {activeTab === "Internship" && (
          <div className="space-y-6">
            
            {/* Input Form */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-[#06B6D4]" />
                {intId ? `Modify Internship: ${intCompany}` : "Deploy Internship Listings"}
              </h3>

              <form onSubmit={handleSaveInternship} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Role Title (Required)</label>
                    <input 
                      type="text" 
                      value={intTitle} 
                      onChange={e => setIntTitle(e.target.value)} 
                      placeholder="Software Developer Intern"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Company (Optional)</label>
                    <input 
                      type="text" 
                      value={intCompany} 
                      onChange={e => setIntCompany(e.target.value)} 
                      placeholder="Stripe"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Apply Link</label>
                    <input 
                      type="text" 
                      value={intLink} 
                      onChange={e => setIntLink(e.target.value)} 
                      placeholder="https://stripe.com/jobs"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Duration (Optional)</label>
                    <input 
                      type="text" 
                      value={intDuration} 
                      onChange={e => setIntDuration(e.target.value)} 
                      placeholder="6 Months"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Stipend (Optional)</label>
                    <input 
                      type="text" 
                      value={intStipend} 
                      onChange={e => setIntStipend(e.target.value)} 
                      placeholder="$5,000 / month"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Qualification Required</label>
                    <input 
                      type="text" 
                      value={intQualification} 
                      onChange={e => setIntQualification(e.target.value)} 
                      placeholder="CS/IT Bachelors, basic React"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Location (Optional)</label>
                    <input 
                      type="text" 
                      value={intLocation} 
                      onChange={e => setIntLocation(e.target.value)} 
                      placeholder="Remote (US) / Hybrid"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Description (Optional)</label>
                  <textarea 
                    rows={2}
                    value={intDesc}
                    onChange={e => setIntDesc(e.target.value)}
                    placeholder="We are looking for frontend engineering students..."
                    className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  {intId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setIntId(null);
                        setIntTitle("");
                      }}
                      className="px-3.5 py-2 text-xs font-bold border border-zinc-800 rounded-lg text-zinc-400 hover:bg-zinc-800"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                  >
                    {intId ? "Save Changes" : "Deploy Internship"}
                  </button>
                </div>
              </form>
            </div>

            {/* List */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4">Active Internship Listings</h3>
              
              <div className="space-y-3">
                {internshipsFeed.map(item => (
                  <div key={item.id} className="p-3.5 border border-zinc-800 bg-zinc-900/10 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-extrabold text-white block">{item.title}</span>
                      <span className="text-[10px] text-[#06B6D4] font-bold">{item.companyName || "No Company"} • {item.location || "No Location"} • {item.stipend || "No Stipend"}</span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditInternship(item)}
                        className="text-zinc-400 hover:text-white p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all"
                        title="Edit Listing"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteInternship(item.id)}
                        className="text-red-500 hover:text-red-400 p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all"
                        title="Delete Listing"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {internshipsFeed.length === 0 && (
                  <div className="text-center text-xs text-zinc-500 py-8 border border-dashed border-zinc-800/40 rounded-xl">
                    No active internship listings available.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 4: E-LIBRARY INDEX MANAGER
            ---------------------------------------------------- */}
        {activeTab === "E-Library" && (
          <div className="space-y-6">
            
            {/* Input Form */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-[#06B6D4]" />
                {libId ? `Modify Resource: ${libTitle}` : "Index E-Library Academic Resources"}
              </h3>

              <form onSubmit={handleSaveLibrary} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Resource Title (Required)</label>
                    <input 
                      type="text" 
                      value={libTitle} 
                      onChange={e => setLibTitle(e.target.value)} 
                      placeholder="Calculus II Formulas Cheat Sheet"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Category</label>
                    <select 
                      value={libCategory} 
                      onChange={e => setLibCategory(e.target.value as LibraryResource["category"])}
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    >
                      <option>Notes</option>
                      <option>E-Books</option>
                      <option>Resource Links</option>
                      <option>PYQs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Subject (Optional)</label>
                    <input 
                      type="text" 
                      value={libSubject} 
                      onChange={e => setLibSubject(e.target.value)} 
                      placeholder="Mathematics"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">PDF File Link Simulation</label>
                    <input 
                      type="text" 
                      value={libFileLink} 
                      onChange={e => setLibFileLink(e.target.value)} 
                      placeholder="https://drive.google.com/calculus-pdf..."
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">External Resource URL (Optional)</label>
                    <input 
                      type="text" 
                      value={libExternalLink} 
                      onChange={e => setLibExternalLink(e.target.value)} 
                      placeholder="https://khanacademy.org/calculus..."
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Brief Description (Optional)</label>
                  <textarea 
                    rows={2}
                    value={libDescription}
                    onChange={e => setLibDescription(e.target.value)}
                    placeholder="Short summary of formulas included..."
                    className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  {libId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setLibId(null);
                        setLibTitle("");
                      }}
                      className="px-3.5 py-2 text-xs font-bold border border-zinc-800 rounded-lg text-zinc-400 hover:bg-zinc-800"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                  >
                    {libId ? "Save Changes" : "Log Resource"}
                  </button>
                </div>
              </form>
            </div>

            {/* List */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4">Indexed Library Directory</h3>
              
              <div className="space-y-3">
                {libraryFeed.map(item => (
                  <div key={item.id} className="p-3.5 border border-zinc-800 bg-zinc-900/10 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white block">{item.title}</span>
                        <span className="text-[8px] font-extrabold text-[#7C3AED] uppercase bg-[#7C3AED]/10 px-2 py-0.5 rounded border border-[#7C3AED]/20">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-semibold">{item.subject || "General"} • {item.description || "No description"}</span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditLibrary(item)}
                        className="text-zinc-400 hover:text-white p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all"
                        title="Edit Resource"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteLibrary(item.id)}
                        className="text-red-500 hover:text-red-400 p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all"
                        title="Delete Resource"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {libraryFeed.length === 0 && (
                  <div className="text-center text-xs text-zinc-500 py-8 border border-dashed border-zinc-800/40 rounded-xl">
                    No digital library resources added.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 5: REPORTED ACCOUNTS & BANNER MODERATION
            ---------------------------------------------------- */}
        {activeTab === "Reported Accounts" && (
          <div className="space-y-6">
            
            {/* Flagged Reports Card */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-6 flex items-center gap-1.5 border-b border-zinc-800 pb-3">
                <UserX className="h-4 w-4 text-red-500" /> Banned student registry and reports logs
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-[10px]">
                      <th className="py-2.5">Flagged Student</th>
                      <th className="py-2.5">Email address</th>
                      <th className="py-2.5">Report Reason</th>
                      <th className="py-2.5">Flagged Date</th>
                      <th className="py-2.5">Status Key</th>
                      <th className="py-2.5 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportedAccounts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-zinc-500 italic">
                          No flagged student reports logged.
                        </td>
                      </tr>
                    ) : (
                      reportedAccounts.map(rep => (
                        <tr key={rep.id} className="border-b border-zinc-850 hover:bg-zinc-800/10">
                          <td className="py-3 font-semibold text-white">{rep.fullName}</td>
                          <td className="py-3 text-zinc-400">{rep.email}</td>
                          <td className="py-3 text-zinc-400 max-w-[200px] truncate" title={rep.reason}>{rep.reason}</td>
                          <td className="py-3 text-zinc-500 font-medium">{rep.reportedDate}</td>
                          <td className="py-3">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${rep.status === 'Banned' ? "bg-red-500/10 border-red-500/35 text-red-500" : rep.status === 'Resolved' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-500"}`}>
                              {rep.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => toggleBanStatus(rep)}
                              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${rep.status === 'Banned' ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30" : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/30"}`}
                            >
                              {rep.status === 'Banned' ? "Restore Access" : "Ban Account"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Registered Users Directory (Non-Confidential) Card */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-zinc-800 pb-3">
                <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#06B6D4]" /> Registered Students Directory (Non-Confidential)
                </h3>
                
                {/* Clean search bar matching the futuristic theme */}
                <div className="relative">
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={e => setUserSearchQuery(e.target.value)}
                    placeholder="Search by name, email, college..."
                    className={`rounded-lg border px-3 py-1.5 text-xs w-64 transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white focus:border-[#06B6D4]" : "border-zinc-300 bg-zinc-50 text-zinc-950 focus:border-[#7C3AED]"}`}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-[10px]">
                      <th className="py-2.5">Full Name</th>
                      <th className="py-2.5">College / University</th>
                      <th className="py-2.5">Academic Year</th>
                      <th className="py-2.5">Official Email</th>
                      <th className="py-2.5">Status Key</th>
                      <th className="py-2.5">Join Date</th>
                      <th className="py-2.5 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-zinc-500 italic">
                          No student accounts found or Supabase synchronization initializing...
                        </td>
                      </tr>
                    ) : (
                      registeredUsers
                        .filter(u => 
                          u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          u.college.toLowerCase().includes(userSearchQuery.toLowerCase())
                        )
                        .map((user, idx) => (
                          <tr key={idx} className="border-b border-zinc-850 hover:bg-zinc-800/10">
                            <td className="py-3 font-semibold text-white">{user.fullName}</td>
                            <td className="py-3 text-zinc-400">{user.college}</td>
                            <td className="py-3 text-zinc-400">{user.year}</td>
                            <td className="py-3 text-zinc-400 font-mono">{user.email}</td>
                            <td className="py-3">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${user.status === 'Banned' ? "bg-red-500/10 border-red-500/35 text-red-500" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 text-zinc-500 font-medium">{user.joinDate}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleDirectBanToggle(user)}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${user.status === 'Banned' ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30" : "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/30"}`}
                              >
                                {user.status === 'Banned' ? "Unban student" : "Ban student"}
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB: USER FEEDBACK
            ---------------------------------------------------- */}
        {activeTab === "User Feedback" && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-extrabold tracking-tight text-white">Student Feedback Registry</h2>
                  <p className="text-xs text-zinc-500 mt-1">Review feedback, suggestions, and feature ratings submitted by students.</p>
                </div>
                <div className="text-xs font-bold text-zinc-500 bg-zinc-900/40 px-3 py-1.5 rounded-lg border border-zinc-800">
                  {feedbackList.length} Submissions
                </div>
              </div>

              {feedbackList.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/5">
                  <span className="text-xs text-zinc-500 block">No student feedback logs are available.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedbackList.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/10 dark:bg-zinc-950/20 hover:scale-[1.01] transition-all space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">{item.userFullName}</span>
                          <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{item.userEmail}</span>
                        </div>
                        <span className="text-[9px] text-zinc-500 font-semibold">{item.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-1 py-1 border-t border-b border-zinc-800/40">
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Rating:</span>
                        <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < item.rating ? "text-amber-500" : "text-zinc-700"}>★</span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed italic bg-zinc-900/20 p-2.5 rounded-lg border border-zinc-900/40">
                        "{item.message}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 6: ADMIN ACCESS CONTROL (MASTER ADMIN ONLY)
            ---------------------------------------------------- */}
        {activeTab === "Admin Access Control" && (
          <div className="space-y-6">
            
            {currentAdmin.role === 'Master Admin' ? (
              <>
                {/* Admin Spawning Form */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                    <PlusCircle className="h-4 w-4 text-[#06B6D4]" /> Spawn New Administrator Account
                  </h3>

                  <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Admin Full Name</label>
                        <input 
                          type="text" 
                          value={newAdminName} 
                          onChange={e => setNewAdminName(e.target.value)} 
                          placeholder="John Connor"
                          className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Email ID</label>
                        <input 
                          type="email" 
                          value={newAdminEmail} 
                          onChange={e => setNewAdminEmail(e.target.value)} 
                          placeholder="connor@acadsph.com"
                          className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Temporary Password</label>
                        <input 
                          type="password" 
                          value={newAdminPass} 
                          onChange={e => setNewAdminPass(e.target.value)} 
                          placeholder="••••••••"
                          className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                        />
                      </div>
                    </div>

                    {/* Permissions map */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-800 pt-4 items-center">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Admin Access Role</label>
                        <select 
                          value={newAdminRole} 
                          onChange={e => setNewAdminRole(e.target.value as AdminAccount["role"])}
                          className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                        >
                          <option>Normal Admin</option>
                          <option>Master Admin</option>
                        </select>
                      </div>

                      <div className="flex gap-4 sm:col-span-2">
                        <label className="flex items-center gap-2 text-xs text-zinc-400 font-semibold cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={permContent}
                            onChange={e => setPermContent(e.target.checked)}
                            className="rounded accent-[#06B6D4]"
                          />
                          <span>Allow content modifications (CRUD)</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs text-zinc-400 font-semibold cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={permUsers}
                            onChange={e => setPermUsers(e.target.checked)}
                            className="rounded accent-[#06B6D4]"
                          />
                          <span>Allow user suspensions (Ban/Flag)</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit"
                        className="rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                      >
                        Register Admin Account
                      </button>
                    </div>
                  </form>
                </div>

                {/* Directory list */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4">Ecosystem Administrators Directory</h3>
                  
                  <div className="space-y-3.5">
                    {adminsList.map(a => (
                      <div key={a.id} className="p-3.5 border border-zinc-800 bg-zinc-900/10 rounded-xl flex items-center justify-between gap-4">
                        <div>
                          <span className="text-xs font-extrabold text-white block">{a.fullName}</span>
                          <span className="text-[10px] text-zinc-500 font-semibold">{a.email} • <strong className="text-[#06B6D4]">{a.role}</strong></span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex gap-2">
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${a.permissions.manageContent ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-zinc-800 text-zinc-500"}`}>
                              Content Control
                            </span>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${a.permissions.manageUsers ? "bg-[#06B6D4]/10 text-white border-[#06B6D4]/20" : "bg-zinc-800 text-zinc-500"}`}>
                              Users Moderator
                            </span>
                          </div>

                          <button
                            onClick={() => handleRemoveAdmin(a.id, a.fullName)}
                            disabled={a.id === currentAdmin.id}
                            className={`p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all ${a.id === currentAdmin.id ? "text-zinc-600 border-transparent cursor-not-allowed" : "text-red-500 hover:text-red-400"}`}
                            title="Revoke Admin Access"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {adminsList.length === 0 && (
                      <div className="text-center text-xs text-zinc-500 py-6 border border-dashed border-zinc-800/40 rounded-xl">
                        No administrators mapped.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-card rounded-2xl p-6 text-center border border-red-500/20 bg-red-500/5 max-w-md mx-auto">
                <ShieldAlert className="h-8 w-8 text-red-500 mx-auto mb-3 animate-bounce" />
                <h4 className="text-sm font-bold text-white">Privileged Tab Restricted</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-normal">
                  Administrative directories and spawning controllers can exclusively be mapped by the Master Admin account.
                </p>
              </div>
            )}

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 4.5: CALENDAR / HOLIDAYS MANAGER
            ---------------------------------------------------- */}
        {activeTab === "Calendar / Holidays" && (
          <div className="space-y-6">
            
            {/* Input Form */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-[#06B6D4]" />
                {holId ? `Modify Event: ${holTitle}` : "Log Academic Event / Holiday"}
              </h3>

              <form onSubmit={handleSaveHoliday} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Event/Holiday Title (Required)</label>
                    <input 
                      type="text" 
                      value={holTitle} 
                      onChange={e => setHolTitle(e.target.value)} 
                      placeholder="Summer Break Begins"
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Event Type</label>
                    <select 
                      value={holType} 
                      onChange={e => setHolType(e.target.value as HolidayEntry["type"])}
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    >
                      <option value="holiday">Holiday / Recess</option>
                      <option value="exam">Exam Date</option>
                      <option value="deadline">Academic Deadline</option>
                      <option value="reminder">Ecosystem Reminder</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Color Theme Badge</label>
                    <select 
                      value={holColor} 
                      onChange={e => setHolColor(e.target.value as NonNullable<HolidayEntry["color"]>)}
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    >
                      <option value="violet">Violet Accent</option>
                      <option value="cyan">Cyan Accent</option>
                      <option value="amber">Amber Accent</option>
                      <option value="rose">Rose Accent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Date (YYYY-MM-DD)</label>
                    <input 
                      type="date" 
                      value={holDate} 
                      onChange={e => setHolDate(e.target.value)} 
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Brief Description (Optional)</label>
                    <input 
                      type="text" 
                      value={holDescription} 
                      onChange={e => setHolDescription(e.target.value)} 
                      placeholder="University closed. No lectures will be conducted."
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white" : "border-zinc-300 bg-zinc-50 text-zinc-950"}`}
                    />
                  </div>

                </div>

                <div className="flex justify-end gap-2 pt-2">
                  {holId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setHolId(null);
                        setHolTitle("");
                        setHolDescription("");
                        setHolDate("");
                      }}
                      className="px-3.5 py-2 text-xs font-bold border border-zinc-800 rounded-lg text-zinc-400 hover:bg-zinc-800"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                  >
                    {holId ? "Save Changes" : "Log Event"}
                  </button>
                </div>
              </form>
            </div>

            {/* List */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4">Ecosystem Calendar Schedule</h3>
              
              <div className="space-y-3">
                {holidaysFeed.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic py-4 text-center">
                    No academic calendar events or holidays logged.
                  </p>
                ) : (
                  holidaysFeed.map(item => (
                    <div key={item.id} className="p-3.5 border border-zinc-800 bg-zinc-900/10 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-white block">{item.title}</span>
                          <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                            item.color === 'cyan' ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : 
                            item.color === 'amber' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                            item.color === 'rose' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : 
                            "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-semibold">{item.date} • {item.description || "No description"}</span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditHoliday(item)}
                          className="text-zinc-400 hover:text-white p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all"
                          title="Edit Event"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteHoliday(item.id)}
                          className="text-red-500 hover:text-red-400 p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all"
                          title="Delete Event"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 7: SETTINGS MODULE
            ---------------------------------------------------- */}
        {activeTab === "Settings" && (
          <div className="space-y-6 max-w-md mx-auto">
            
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-[#06B6D4]" /> Settings Command Configuration
              </h3>

              <div className="space-y-4">
                <div className="p-3 bg-zinc-850 rounded-lg border border-zinc-800 text-xs">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase">System Key Code Model</span>
                  <span className="font-mono text-zinc-300 block mt-1 break-all bg-zinc-900 p-2 rounded">
                    SHA-256 Authentication Encryption Active.
                  </span>
                </div>

                <div className="p-3 bg-zinc-850 rounded-lg border border-zinc-800 text-xs">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase">Supabase Sync Trigger</span>
                  <span className="font-semibold text-emerald-400 block mt-1">
                    Ready for real-time Postgres synchronization bridge.
                  </span>
                </div>

                <div className="p-3 bg-zinc-850 rounded-lg border border-zinc-800 text-xs">
                  <span className="block text-[9px] font-bold text-zinc-500 uppercase">Dual-Mode Status</span>
                  <span className="font-semibold text-[#06B6D4] block mt-1">
                    Local Storage Cross-Tab Sync simulated successfully on default namespaces.
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ----------------------------------------------------
          RIGHT SIDEBAR FOR ADMINISTRATIVE HUB
          ---------------------------------------------------- */}
      <nav className={`fixed top-0 bottom-0 right-0 z-40 w-64 border-l transition-all duration-300 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0 ${isDarkMode ? "border-l-zinc-800 bg-[#111113]" : "border-l-zinc-200 bg-[#F4F4F5]"}`}>
        
        <div className="flex h-full flex-col justify-between py-6">
          
          <div className="space-y-8">
            
            <div className="px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-[#06B6D4]/20 border border-[#06B6D4]/35 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-[#7C3AED] animate-pulse" />
                </div>
                <span className="font-extrabold tracking-tight text-base text-white">Acadsphere</span>
              </div>
              
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1 px-3">
              {[
                { label: "Dashboard", icon: LayoutDashboard },
                { label: "Events / Network", icon: Code2 },
                { label: "Internship", icon: Briefcase },
                { label: "E-Library", icon: BookOpen },
                { label: "Calendar / Holidays", icon: CalendarDays },
                { label: "Admin Access Control", icon: ShieldAlert },
                { label: "Reported Accounts", icon: UserX },
                { label: "User Feedback", icon: MessageSquare },
                { label: "Settings", icon: Sliders }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.label;

                return (
                  <button
                    key={tab.label}
                    onClick={() => {
                      setActiveTab(tab.label);
                      setIsSidebarOpen(false);
                    }}
                    className={`relative z-0 w-full flex items-center gap-3.5 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${isActive ? (isDarkMode ? "text-white" : "text-zinc-950") : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-850/10"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="admin-sidebar-highlight"
                        className={`absolute inset-0 rounded-lg -z-10 ${isDarkMode ? "bg-zinc-800" : "bg-white shadow-sm border border-zinc-200"}`}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    {isActive && <div className="sidebar-indicator z-0" />}
                    <Icon className={`relative z-10 h-4.5 w-4.5 transition-colors ${isActive ? "text-[#06B6D4]" : "text-zinc-500"}`} />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

          </div>

          <div className="px-3 border-t border-zinc-800/40 pt-4">
            <button
              onClick={handleAdminSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Sign Out Admin</span>
            </button>
          </div>

        </div>

      </nav>

    </div>
  );
}
