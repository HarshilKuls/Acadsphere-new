"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  CalendarClock, 
  CheckCircle2, 
  GraduationCap, 
  Calculator, 
  Calendar, 
  Code2, 
  Briefcase, 
  BookOpen, 
  MessageSquare, 
  Sun, 
  Moon, 
  LogOut, 
  Plus, 
  Trash2, 
  Pencil,
  User, 
  Clock, 
  Sparkles, 
  Menu, 
  X, 
  ChevronRight, 
  Download, 
  Star, 
  Award, 
  FileText, 
  Percent, 
  Building,
  School,
  CalendarDays,
  Settings,
  HelpCircle
} from "lucide-react";
import { db, supabase, StudentUser, TimetableEntry, AttendanceEntry, CGPASubject, MarksPrediction, CalendarEvent, FeedbackSubmission, HackathonEvent, InternshipListing, LibraryItem } from "@/lib/db";

import Navbar from "@/components/homepage/Navbar";
import Hero from "@/components/homepage/Hero";
import Footer from "@/components/homepage/Footer";
import DashboardView from "@/components/Dashboard/DashboardView";
import OnboardingView from "@/components/Onboarding/OnboardingView";
import TimetableUpload from "@/components/Dashboard/TimetableUpload";

export default function Home() {
  type AuthUserProfile = {
    id: string;
    email?: string | null;
    user_metadata?: {
      full_name?: string;
      fullName?: string;
      college?: string;
      year?: string;
      name?: string;
      preferred_username?: string;
    } | null;
  };

  // --- Hydration & Mounted State ---
  const [mounted, setMounted] = useState(false);

  // --- Auth States ---
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [isVerificationPending, setIsVerificationPending] = useState(false);
  const [isBannedView, setIsBannedView] = useState(false);
  const [isForgotPasswordView, setIsForgotPasswordView] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  
  // Auth Form Fields
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [year, setYear] = useState("I Year");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Edit Profile States
  const [editFullName, setEditFullName] = useState("");
  const [editCollege, setEditCollege] = useState("");
  const [editYear, setEditYear] = useState("I Year");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Auth provider check (to hide Change Password for Google users)
  const [authProvider, setAuthProvider] = useState<string | null>(null);

  // Change Password Modal States
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [changeCurrentPassword, setChangeCurrentPassword] = useState("");
  const [changeNewPassword, setChangeNewPassword] = useState("");
  const [changeConfirmNewPassword, setChangeConfirmNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordUpdateError, setPasswordUpdateError] = useState<string | null>(null);

  // --- Theme State ---
  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- UI Layout States ---
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const closeSidebarOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };

    window.addEventListener("keydown", closeSidebarOnEscape);
    return () => window.removeEventListener("keydown", closeSidebarOnEscape);
  }, []);

  // --- Module Functional States ---
  // Timetable
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [ttSubject, setTtSubject] = useState("");
  const [ttFaculty, setTtFaculty] = useState("");
  const [ttRoom, setTtRoom] = useState("");
  const [ttDay, setTtDay] = useState("Monday");
  const [ttStart, setTtStart] = useState("09:00");
  const [ttEnd, setTtEnd] = useState("10:00");
  const [ttEditingId, setTtEditingId] = useState<string | null>(null);
  const [ttEditingColor, setTtEditingColor] = useState("bg-purple-600/20 text-purple-400 border-purple-500/20");

  // Clear All Timetable States
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [isClearingTimetable, setIsClearingTimetable] = useState(false);

  // Attendance
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [attEditingId, setAttEditingId] = useState<string | null>(null);
  const [attSubject, setAttSubject] = useState("");
  const [attAttended, setAttAttended] = useState("0");
  const [attTotal, setAttTotal] = useState("0");

  // CGPA
  const [cgpaSubjects, setCgpaSubjects] = useState<CGPASubject[]>([]);
  const [cgEditingId, setCgEditingId] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [cgSubjectName, setCgSubjectName] = useState("");
  const [cgCredits, setCgCredits] = useState("3");
  const [cgGrade, setCgGrade] = useState<'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F'>('A+');

  // Marks Predictor
  const [predictions, setPredictions] = useState<MarksPrediction[]>([]);
  const [predEditingId, setPredEditingId] = useState<string | null>(null);
  const [predSubject, setPredSubject] = useState("");
  const [predInternalScore, setPredInternalScore] = useState("40");
  const [predInternalTotal, setPredInternalTotal] = useState("60");
  const [predExternalTotal, setPredExternalTotal] = useState("100");
  const [predTargetGrade, setPredTargetGrade] = useState<'O' | 'A+' | 'A' | 'B+' | 'B' | 'C'>('A+');

  // Calendar
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calEditingId, setCalEditingId] = useState<string | null>(null);
  const [calTitle, setCalTitle] = useState("");
  const [calDate, setCalDate] = useState("");
  const [calType, setCalType] = useState<'exam' | 'deadline' | 'reminder' | 'holiday'>('deadline');
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());

  // Feedback
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackSubmission[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Internship & Events Applied list (local UI triggers)
  const [appliedInternships, setAppliedInternships] = useState<string[]>([]);
  const [appliedEvents, setAppliedEvents] = useState<string[]>([]);

  // Search filter for Library
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState("All");

  // Opportunity Radar
  const [radarFieldFilter, setRadarFieldFilter] = useState("All Fields");
  const [radarTypeFilter, setRadarTypeFilter] = useState("All Types");

  // Timetable Upload
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Notifications Toast helper
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronized listings state
  const [eventsFeed, setEventsFeed] = useState<HackathonEvent[]>([]);
  const [internshipsFeed, setInternshipsFeed] = useState<InternshipListing[]>([]);
  const [libraryFeed, setLibraryFeed] = useState<LibraryItem[]>([]);

  // Trigger brief alert toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const sanitizeProfileField = (value?: string | null): string => {
    const normalized = value?.trim() || "";
    if (!normalized) return "";
    if (normalized === "Acadsphere University" || normalized === "I Year") return "";
    return normalized;
  };

  const getDisplayProfileValue = (value: string, fallback: string): string => {
    return sanitizeProfileField(value) || fallback;
  };

  const buildProfileSnapshot = (authUser: AuthUserProfile, profile?: Record<string, unknown> | null): StudentUser => {
    const metadata = authUser.user_metadata ?? {};
    return {
      id: authUser.id,
      fullName:
        sanitizeProfileField(metadata.full_name) ||
        sanitizeProfileField(metadata.fullName) ||
        sanitizeProfileField(metadata.name) ||
        sanitizeProfileField(metadata.preferred_username) ||
        sanitizeProfileField(authUser.email?.split("@")[0]) ||
        (profile?.full_name ? String(profile.full_name) : "Student"),
      college:
        sanitizeProfileField(metadata.college) ||
        (profile?.college ? sanitizeProfileField(String(profile.college)) : ""),
      year:
        sanitizeProfileField(metadata.year) ||
        (profile?.year ? sanitizeProfileField(String(profile.year)) : ""),
      email: authUser.email || (profile?.email ? String(profile.email) : ""),
      onboardingCompleted: profile?.onboarding_completed === true
    };
  };

  const getOrCreateProfile = async (authUser: AuthUserProfile | null): Promise<StudentUser | null> => {
    if (!authUser) return null;
    
    // Detailed logging
    console.log("authUser:", authUser);
    
    try {
      // Fetch user profile from database using safe array query to check for duplicates
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id);
        
      console.log("profileData:", profileData);
      console.log("profileError:", profileError);
      
      if (profileError) {
        console.warn("Could not fetch user profile details:", profileError.message);
        triggerToast("Profile setup incomplete");
        return buildProfileSnapshot(authUser);
      }

      const sanitizedProfiles = (profileData ?? []).map((profile) => ({
        ...profile,
        full_name: sanitizeProfileField(String(profile.full_name ?? "")),
        college: sanitizeProfileField(String(profile.college ?? "")),
        year: sanitizeProfileField(String(profile.year ?? "")),
        email: String(profile.email ?? authUser.email ?? "")
      }));
      
      // Case 1: Profile record does not exist -> Automatically create it
      if (sanitizedProfiles.length === 0) {
        console.log("Profile does not exist. Automatically creating one for ID:", authUser.id);
        const profileSnapshot = buildProfileSnapshot(authUser);
        const newProfile = {
          id: authUser.id,
          full_name: profileSnapshot.fullName,
          college: profileSnapshot.college,
          year: profileSnapshot.year,
          email: profileSnapshot.email,
          created_at: new Date().toISOString()
        };
        
        // Prevent duplicate creation by double checking/handling inserts carefully
        const { data: insertData, error: insertError } = await supabase
          .from('users')
          .insert(newProfile)
          .select()
          .maybeSingle();
          
        if (insertError) {
          console.warn("Error creating automatic profile:", insertError.message);
          triggerToast("Profile setup incomplete");
          return null;
        }
        
        const created = insertData || newProfile;
        return buildProfileSnapshot(authUser, created);
      }
      
      // Case 2: Duplicate profile records exist
      if (sanitizedProfiles.length > 1) {
        console.warn(`Duplicate profiles detected for user ID ${authUser.id}. Count: ${sanitizedProfiles.length}`);
        return buildProfileSnapshot(authUser, sanitizedProfiles[0]);
      }
      
      // Standard Case: Single profile exists
      return buildProfileSnapshot(authUser, sanitizedProfiles[0]);
    } catch (error: unknown) {
      console.warn("Exception in getOrCreateProfile:", error);
      triggerToast("Profile setup incomplete");
      return buildProfileSnapshot(authUser);
    }
  };

  // Run only on Client Mount
  useEffect(() => {
    setMounted(true);
    
    // Read theme preference
    const savedTheme = localStorage.getItem("acadsphere_theme");
    const isDark = savedTheme ? savedTheme === "dark" : true;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Check if user session already exists in Supabase
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const email = session.user.email || "";
        const provider = session.user.app_metadata?.provider || (session.user.app_metadata?.providers?.[0]) || "email";
        setAuthProvider(provider);
        
        // 1. Check if admin
        const { data: isAdmin } = await supabase
          .from('admins')
          .select('id')
          .eq('email', email.toLowerCase())
          .maybeSingle();

        if (isAdmin) {
          setAuthError("This account is an Administrator. Please log in through the Admin Portal.");
          setCurrentUser(null);
          localStorage.removeItem("acadsphere_session");
          await supabase.auth.signOut();
          return;
        }

        // 2. Check ban
        if (await db.isEmailBanned(email)) {
          setIsBannedView(true);
          setCurrentUser(null);
          await supabase.auth.signOut();
          return;
        }

        // 3. Check if verified
        if (!session.user.email_confirmed_at) {
          setIsVerificationPending(true);
          setCurrentUser(null);
          return;
        }

        // 4. Fetch user profile (safe handling with fallback / auto-creation)
        const studentUser = await getOrCreateProfile(session.user);
        if (studentUser) {
          localStorage.setItem("acadsphere_session", JSON.stringify(studentUser));
          setCurrentUser(studentUser);
        }
      }
    };

    initAuth();

    // Listen to live Supabase Auth state modifications
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Supabase Auth State Change Event:", event);
      if (session?.user) {
        const email = session.user.email || "";
        const provider = session.user.app_metadata?.provider || (session.user.app_metadata?.providers?.[0]) || "email";
        setAuthProvider(provider);

        // Check if admin
        const { data: isAdmin } = await supabase
          .from('admins')
          .select('id')
          .eq('email', email.toLowerCase())
          .maybeSingle();

        if (isAdmin) {
          setAuthError("This account is an Administrator. Please log in through the Admin Portal.");
          setCurrentUser(null);
          setAuthProvider(null);
          localStorage.removeItem("acadsphere_session");
          await supabase.auth.signOut();
          return;
        }
        
        if (await db.isEmailBanned(email)) {
          setIsBannedView(true);
          setCurrentUser(null);
          setAuthProvider(null);
          await supabase.auth.signOut();
          return;
        }

        if (!session.user.email_confirmed_at) {
          setIsVerificationPending(true);
          setCurrentUser(null);
          return;
        }

        const studentUser = await getOrCreateProfile(session.user);
        if (studentUser) {
          localStorage.setItem("acadsphere_session", JSON.stringify(studentUser));
          setCurrentUser(studentUser);
          setIsVerificationPending(false);
          setIsBannedView(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setAuthProvider(null);
        localStorage.removeItem("acadsphere_session");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Synchronize profile inputs with logged-in user profile
  useEffect(() => {
    if (currentUser) {
      setEditFullName(currentUser.fullName || "");
      setEditCollege(currentUser.college || "");
      setEditYear(currentUser.year || "I Year");
    }
  }, [currentUser]);

  // Fetch student specific records whenever user logs in or switches tabs
  useEffect(() => {
    if (!currentUser || !currentUser.onboardingCompleted) return;
    const userId = currentUser.id;
    
    // Set immediate cached local layout first for instant UI response
    setTimetable(db.getTimetable(userId));
    setAttendance(db.getAttendance(userId));
    setCgpaSubjects(db.getCGPASubjects(userId));
    setPredictions(db.getMarksPredictions(userId));
    setCalendarEvents(db.getCalendarEvents(userId));
    setFeedbackHistory(db.getFeedbackHistory(userId));

    // Async trigger live Supabase sync in the background
    db.syncUserData(userId).then(() => {
      setTimetable(db.getTimetable(userId));
      setAttendance(db.getAttendance(userId));
      setCgpaSubjects(db.getCGPASubjects(userId));
      setPredictions(db.getMarksPredictions(userId));
      setCalendarEvents(db.getCalendarEvents(userId));
      setFeedbackHistory(db.getFeedbackHistory(userId));
    });

    const loadSharedContent = async () => {
      const [events, internships, library] = await Promise.all([
        db.getEvents(),
        db.getInternships(),
        db.getLibrary(),
      ]);
      setEventsFeed(events);
      setInternshipsFeed(internships);
      setLibraryFeed(library);
    };
    loadSharedContent();

    const sharedContentChannel = supabase
      .channel("dashboard-shared-content")
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, loadSharedContent)
      .on("postgres_changes", { event: "*", schema: "public", table: "internships" }, loadSharedContent)
      .on("postgres_changes", { event: "*", schema: "public", table: "e_library" }, loadSharedContent)
      .subscribe();

    const refreshCalendar = async () => {
      await db.syncUserData(userId);
      setCalendarEvents(db.getCalendarEvents(userId));
    };
    const calendarChannel = supabase
      .channel(`dashboard-calendar-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "holidays" }, refreshCalendar)
      .on("postgres_changes", { event: "*", schema: "public", table: "calendar", filter: `user_id=eq.${userId}` }, refreshCalendar)
      .subscribe();

    return () => {
      supabase.removeChannel(sharedContentChannel);
      supabase.removeChannel(calendarChannel);
    };
  }, [currentUser, activeTab]);

  // Handle HTML document theme changes
  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    localStorage.setItem("acadsphere_theme", nextDark ? "dark" : "light");
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    triggerToast(`Theme switched to ${nextDark ? "Dark" : "Light"} mode`);
  };

  // ----------------------------------------------------
  // AUTH SYSTEM HANDLERS
  // ----------------------------------------------------
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    // 1. Basic empty check
    if (!fullName || !college || !email || !password || !confirmPassword) {
      setAuthError("All fields are mandatory.");
      return;
    }

    // 2. Rigorous Frontend Email Format Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setAuthError("Please enter a valid email address (e.g., name@domain.com).");
      return;
    }

    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    // 2. Ban Check
    if (await db.isEmailBanned(email)) {
      setAuthError("Your account has been suspended by an administrator.");
      return;
    }

    try {
      console.log("=== STARTING SUPABASE AUTH SIGNUP FLOW ===");
      console.log("Signup Payload:", { fullName, college, year, email: email.toLowerCase() });
      
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
      });

      console.log("Supabase signUp Response (data):", data);
      console.log("Supabase signUp Error (error):", error);

      if (error) {
        console.warn("Supabase Auth signUp failed:", error.message);
        setAuthError(error.message);
        return;
      }

      if (data.user) {
        console.log("Auth user created in Supabase. ID:", data.user.id);
        
        // Insert profile details into public.users table in Supabase
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          full_name: fullName,
          college: college,
          year: year,
          email: email.toLowerCase()
        });

        console.log("public.users Insert Response (error):", insertError);

        if (insertError) {
          console.warn("Failed to insert user profile into public.users:", insertError.message);
          setAuthError(`Profile creation failed: ${insertError.message}`);
          return;
        }

        console.log("Successfully created user profile in public.users");
        
        // Check if email confirmation is required (session = null)
        if (!data.session) {
          setIsVerificationPending(true);
          triggerToast("Confirmation email dispatched! Please verify.");
        } else {
          // Direct login if verification is bypassed/disabled
          const studentUser: StudentUser = {
            id: data.user.id,
            fullName,
            college,
            year,
            email: email.toLowerCase(),
            onboardingCompleted: false
          };
          localStorage.setItem("acadsphere_session", JSON.stringify(studentUser));
          setCurrentUser(studentUser);
          triggerToast("Account created and logged in!");
        }
      }
    } catch (error: unknown) {
      setAuthError("An unexpected error occurred during profile registration.");
      console.error("Signup exception:", error);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError("");
    try {
      console.log("Starting Google OAuth login");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        setAuthError(error.message);
        console.warn("Supabase Google OAuth failed:", error.message);
      }
    } catch (error: unknown) {
      setAuthError("An unexpected error occurred during Google authentication.");
      console.error("Google auth exception:", error);
    }
  };

  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!email || !password) {
      setAuthError("Please fill in all fields.");
      return;
    }

    if (await db.isEmailBanned(email)) {
      setIsBannedView(true);
      setAuthError("Your account has been suspended by an administrator.");
      return;
    }

    try {
      // Check rate limit on student login
      const rlCheck = await fetch("/api/auth/rate-limit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "login", email: email.toLowerCase() }),
      });
      const rlData = await rlCheck.json();
      if (!rlCheck.ok) {
        setAuthError(rlData.error || "Too many login attempts. Please try again later.");
        return;
      }

      console.log("Starting Supabase login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        setAuthError(error.message);
        console.warn("Supabase signIn failed:", error.message);
        return;
      }

      if (data.user) {
        // Check if email is verified
        if (!data.user.email_confirmed_at) {
          await supabase.auth.signOut();
          setIsVerificationPending(true);
          setAuthError("Email verification pending. Please check your inbox.");
          return;
        }

        // Fetch profile using safe getOrCreateProfile wrapper
        const studentSession = await getOrCreateProfile(data.user);
        if (studentSession) {
          localStorage.setItem("acadsphere_session", JSON.stringify(studentSession));
          setCurrentUser(studentSession);
          setIsBannedView(false);
          setIsVerificationPending(false);
          triggerToast(`Logged in as ${studentSession.fullName}`);
        } else {
          triggerToast("Profile setup incomplete");
        }
      }
    } catch (error: unknown) {
      setAuthError("A cryptographic login verification error occurred.");
      console.error("Login exception:", error);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!email) {
      setAuthError("Please input your registered email address.");
      return;
    }
    try {
      // Check rate limit on student password reset
      const rlCheck = await fetch("/api/auth/rate-limit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "password_reset", email: email.toLowerCase() }),
      });
      const rlData = await rlCheck.json();
      if (!rlCheck.ok) {
        setAuthError(rlData.error || "Too many attempts. Please try again later.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });
      if (error) {
        setAuthError(error.message);
      } else {
        setIsResetSuccess(true);
        triggerToast("Password reset link dispatched!");
      }
    } catch (error: unknown) {
      setAuthError("Could not dispatch reset request.");
    }
  };

  const handleResendVerification = async () => {
    setAuthError("");
    if (!email) {
      setAuthError("Please enter your email to request code resend.");
      return;
    }
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) {
        setAuthError(error.message);
      } else {
        triggerToast("Verification link re-sent! Check your inbox.");
      }
    } catch (error: unknown) {
      setAuthError("Could not request verification link resend.");
    }
  };


  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("acadsphere_session");
    setCurrentUser(null);
    setActiveTab("Dashboard");
    setIsVerificationPending(false);
    setIsBannedView(false);
    triggerToast("Logged out successfully.");
  };

  const handleOnboardingComplete = async (college: string, year: string): Promise<boolean> => {
    if (!currentUser) return false;
    const success = await db.completeOnboarding(currentUser.id, college, year);
    if (success) {
      const updatedUser: StudentUser = {
        ...currentUser,
        college,
        year,
        onboardingCompleted: true
      };
      setCurrentUser(updatedUser);
      localStorage.setItem("acadsphere_session", JSON.stringify(updatedUser));
      triggerToast("Welcome to AcadSphere!");
    }
    return success;
  };

  const handleOnboardingSkip = async (): Promise<boolean> => {
    if (!currentUser) return false;
    const success = await db.skipOnboarding(currentUser.id);
    if (success) {
      const updatedUser: StudentUser = {
        ...currentUser,
        onboardingCompleted: true
      };
      setCurrentUser(updatedUser);
      localStorage.setItem("acadsphere_session", JSON.stringify(updatedUser));
      triggerToast("Onboarding skipped — you can update your profile anytime.");
    }
    return success;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!editFullName.trim() || !editCollege.trim()) {
      triggerToast("Full Name and College/Institution are required.");
      return;
    }
    setIsSavingProfile(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: editFullName,
          college: editCollege,
          year: editYear
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      const updatedUser = {
        ...currentUser,
        fullName: editFullName,
        college: editCollege,
        year: editYear
      };

      setCurrentUser(updatedUser);
      localStorage.setItem("acadsphere_session", JSON.stringify(updatedUser));
      triggerToast("Profile settings updated successfully!");
    } catch (err: any) {
      triggerToast(err.message || "Failed to update profile settings.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setPasswordUpdateError(null);

    if (!changeCurrentPassword || !changeNewPassword || !changeConfirmNewPassword) {
      setPasswordUpdateError("All fields are required.");
      return;
    }

    if (changeNewPassword.length < 6) {
      setPasswordUpdateError("New password must be at least 6 characters long.");
      return;
    }

    if (changeNewPassword !== changeConfirmNewPassword) {
      setPasswordUpdateError("New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // 1. Re-authenticate user to verify current password
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: changeCurrentPassword
      });

      if (reauthError) {
        setPasswordUpdateError("Incorrect current password.");
        setIsUpdatingPassword(false);
        return;
      }

      // 2. Perform the update
      const { error: updateError } = await supabase.auth.updateUser({
        password: changeNewPassword
      });

      if (updateError) {
        throw updateError;
      }

      // Success!
      triggerToast("Password updated successfully!");
      setIsChangePasswordOpen(false);
      setChangeCurrentPassword("");
      setChangeNewPassword("");
      setChangeConfirmNewPassword("");
    } catch (err: any) {
      setPasswordUpdateError(err.message || "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };


  // Hydration Guard
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B] text-[#F4F4F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent"></div>
          <span className="text-sm font-medium text-zinc-400">Loading Acadsphere...</span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER AUTH SCREEN IF NOT LOGGED IN
  // ----------------------------------------------------
  if (isBannedView) {
    return (
      <div className={`flex min-h-screen items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? "bg-[#09090f] text-[#e6e0ee]" : "bg-[#f4f1fb] text-[#1c1a24]"}`}>
        <div className={`relative w-full max-w-md overflow-hidden rounded-2xl border p-8 shadow-2xl text-center bg-white/85 dark:bg-[#14121b]/80 border-zinc-200 dark:border-red-500/20 shadow-red-500/5`}>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 text-red-500 mb-4 animate-bounce">
            <X className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-850 dark:text-zinc-100">Account Suspended</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Acadsphere Security Center</p>
          <div className="my-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-500 dark:text-red-400">
            Your account access has been suspended due to an administrative policy violation. Please contact student affairs or ecosystem administration.
          </div>
          <button
            onClick={handleSignOut}
            className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-bold text-white transition-all"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (isVerificationPending) {
    return (
      <div className={`flex min-h-screen items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? "bg-[#09090f] text-[#e6e0ee]" : "bg-[#f4f1fb] text-[#1c1a24]"}`}>
        <div className={`relative w-full max-w-md overflow-hidden rounded-2xl border p-8 shadow-2xl text-center bg-white/85 dark:bg-[#14121b]/80 border-zinc-200 dark:border-[#06B6D4]/20 shadow-[#06B6D4]/5`}>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#06B6D4]/15 text-[#06B6D4] mb-4 animate-pulse">
            <Clock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-850 dark:text-zinc-100">Verification Link Dispatched</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Ecosystem Registration Flow</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 my-6 leading-relaxed">
            We have dispatched a verification link to your email <strong className="text-[#06B6D4]">{email}</strong>. 
            Please check your inbox (and spam folder) and verify your account before accessing the command center dashboard.
          </p>
          {authError && (
            <div className="mb-4 rounded-lg bg-red-500/15 border border-red-500/30 p-3 text-xs text-red-500">
              {authError}
            </div>
          )}
          <div className="space-y-3">
            <button
              onClick={handleResendVerification}
              className="w-full rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] px-4 py-2.5 text-xs font-bold text-white transition-all"
            >
              Resend Verification Email
            </button>
            <button
              onClick={handleSignOut}
              className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-all"
            >
              Back to Login Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isForgotPasswordView) {
    return (
      <div className={`flex min-h-screen items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? "bg-[#09090f] text-[#e6e0ee]" : "bg-[#f4f1fb] text-[#1c1a24]"}`}>
        <div className={`relative w-full max-w-md overflow-hidden rounded-2xl border p-8 shadow-2xl text-center bg-white/85 dark:bg-[#14121b]/80 border-zinc-200 dark:border-zinc-800/40 shadow-black/10`}>
          
          <div className="mb-8 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#7C3AED]/15 text-[#7C3AED] mb-3">
              <User className="h-6 w-6 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-850 dark:text-zinc-100">Reset Your Passcode</h1>
            <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mt-1">Ecosystem Access Recovery</p>
          </div>

          {authError && (
            <div className="mb-4 rounded-lg bg-red-500/15 border border-red-500/30 p-3 text-xs text-red-500">
              {authError}
            </div>
          )}

          {isResetSuccess ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-500 dark:text-emerald-400 leading-relaxed font-semibold">
                A secure passcode recovery link has been dispatched to your email! Please follow the link to reset your credentials.
              </div>
              <button
                onClick={() => {
                  setIsForgotPasswordView(false);
                  setIsResetSuccess(false);
                }}
                className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-bold text-white transition-all"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 text-left">Enter your Email ID</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-xs font-medium transition-all focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none ${isDarkMode ? "border-zinc-800 bg-[#18181B] text-[#F4F4F5] placeholder:text-zinc-650" : "border-zinc-250 bg-zinc-50 text-zinc-950 placeholder:text-zinc-450"}`}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-lg mt-2"
              >
                Dispatch Passcode Link
              </button>

              <button
                type="button"
                onClick={() => setIsForgotPasswordView(false)}
                className="w-full rounded-lg bg-transparent hover:underline text-xs text-zinc-500 mt-2 text-center"
              >
                Back to Login
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={`mesh-gradient-bg min-h-screen flex flex-col font-body-md text-zinc-800 dark:text-zinc-100 ${isDarkMode ? 'dark' : ''}`}>
        <Navbar toggleTheme={toggleTheme} />
        <Hero 
          isLoginView={isLoginView}
          setIsLoginView={setIsLoginView}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogIn={handleLogIn}
          handleGoogleLogin={handleGoogleLogin}
          fullName={fullName}
          setFullName={setFullName}
          college={college}
          setCollege={setCollege}
          year={year}
          setYear={setYear}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          handleSignUp={handleSignUp}
          setIsForgotPasswordView={setIsForgotPasswordView}
          isForgotPasswordView={isForgotPasswordView}
          authError={authError}
        />
        <Footer />
      </div>
    );
  }

  if (!currentUser.onboardingCompleted) {
    return (
      <OnboardingView
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  // ----------------------------------------------------
  // COMPUTED VARIABLES FOR THE STUDENT
  // ----------------------------------------------------
  const parseWholeNumber = (value: string): number => Number.parseInt(value, 10);
  const parseDecimalNumber = (value: string): number => Number.parseFloat(value);
  const isValidNumber = (value: number): boolean => Number.isFinite(value);
  const normalizeSubject = (value: string): string => value.trim().replace(/\s+/g, " ");
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return (hours * 60) + minutes;
  };

  const gradePoints: Record<string, number> = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'F': 0
  };

  const gradeThresholds: Record<string, number> = {
    'O': 90, 'A+': 80, 'A': 70, 'B+': 60, 'B': 50, 'C': 40
  };

  const getExternalRequirement = (prediction: MarksPrediction) => {
    const targetBoundary = gradeThresholds[prediction.targetGrade] ?? 0;
    const internalContrib = prediction.internalTotal > 0
      ? (prediction.internalScore / prediction.internalTotal) * 60
      : 0;
    const neededExternalContrib = targetBoundary - internalContrib;
    const rawExternalNeeded = Math.ceil(Math.max(0, (neededExternalContrib / 40) * prediction.externalTotal));
    const alreadySecured = neededExternalContrib <= 0;
    const feasible = rawExternalNeeded <= prediction.externalTotal;

    return { targetBoundary, internalContrib, neededExternalContrib, rawExternalNeeded, alreadySecured, feasible };
  };
  
  // 1. Attendance Metrics
  const totalClasses = attendance.reduce((sum, item) => sum + item.total, 0);
  const attendedClasses = attendance.reduce((sum, item) => sum + item.attended, 0);
  const cumulativeAttendancePercent = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
  
  // Skip margin calculation: Total classes skip margin (overall)
  const isCumulativeSafe = cumulativeAttendancePercent >= 75;
  const skipMargin = totalClasses > 0 
    ? Math.max(0, Math.floor((attendedClasses * 4 - totalClasses * 3) / 3)) 
    : 0;
  const recoveryNeeded = totalClasses > 0 && !isCumulativeSafe
    ? Math.ceil((0.75 * totalClasses - attendedClasses) / 0.25)
    : 0;

  // 2. CGPA Metrics
  const getSGPA = (sem: number): number => {
    const semSubjects = cgpaSubjects.filter(s => s.semester === sem);
    const totalCredits = semSubjects.reduce((sum, s) => sum + s.credits, 0);
    if (totalCredits === 0) return 0;
    const weightedPoints = semSubjects.reduce((sum, s) => sum + (s.credits * (gradePoints[s.grade] ?? 0)), 0);
    return Number((weightedPoints / totalCredits).toFixed(2));
  };

  const activeSemesters = Array.from(new Set(cgpaSubjects.map(s => s.semester))).sort();
  const overallCredits = cgpaSubjects.reduce((sum, s) => sum + s.credits, 0);
  const overallCGPA = (() => {
    if (overallCredits === 0) return 0;
    const totalWeightedPoints = cgpaSubjects.reduce((sum, s) => sum + (s.credits * (gradePoints[s.grade] ?? 0)), 0);
    return Number((totalWeightedPoints / overallCredits).toFixed(2));
  })();

  const getPerformanceSummary = (cg: number): string => {
    if (cg >= 9.5) return "Outstanding! Top tier academic excellence.";
    if (cg >= 9.0) return "Excellent! Solid core standing.";
    if (cg >= 8.0) return "Great job! Consistent performance.";
    if (cg >= 7.0) return "Good. Focus on minor grade boosters.";
    if (cg >= 6.0) return "Above average. Seek library supports.";
    return "Action required. Setup study groups immediately.";
  };

  // 4. Academic Health Score
  const getAcademicHealth = () => {
    const attScore = Math.min(100, cumulativeAttendancePercent);
    const cgpaScore = overallCGPA * 10;
    
    let marksScore = 100;
    if (predictions.length > 0) {
      const avgMarks = predictions.reduce((sum, p) => sum + (p.internalScore / Math.max(1, p.internalTotal)), 0) / predictions.length;
      marksScore = avgMarks * 100;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
    const twoWeeksStr = twoWeeksLater.toISOString().split('T')[0];

    const pendingAssignments = calendarEvents.filter(e => e.type === 'deadline' && e.date >= todayStr && e.date <= twoWeeksStr);
    let assignScore = 100;
    if (pendingAssignments.length === 1) assignScore = 80;
    else if (pendingAssignments.length >= 2) assignScore = 60;

    const totalScore = (0.3 * attScore) + (0.3 * cgpaScore) + (0.2 * marksScore) + (0.2 * assignScore);
    const finalScore = Math.round(totalScore) || 0;

    let status: 'Safe' | 'Warning' | 'Critical' = 'Safe';
    if (finalScore < 50) status = 'Critical';
    else if (finalScore < 80) status = 'Warning';

    const insights: { text: string; type: 'safe' | 'warning' | 'critical' }[] = [];
    
    const lowAttSubs = attendance.filter(a => a.total > 0 && (a.attended / a.total) < 0.75);
    if (lowAttSubs.length > 0) {
      insights.push({ text: `Attendance low in ${lowAttSubs[0].subject}`, type: 'critical' });
    } else {
      insights.push({ text: 'Attendance is above minimum', type: 'safe' });
    }

    if (pendingAssignments.length > 0) {
      insights.push({ text: `${pendingAssignments.length} Assignment(s) pending`, type: 'warning' });
    } else {
      insights.push({ text: 'No pending deadlines', type: 'safe' });
    }

    if (overallCGPA >= 8.0) {
      insights.push({ text: 'CGPA is on track', type: 'safe' });
    } else if (overallCGPA >= 6.5) {
      insights.push({ text: 'CGPA needs attention', type: 'warning' });
    } else if (overallCredits > 0) {
      insights.push({ text: 'Critical CGPA alert', type: 'critical' });
    } else {
      insights.push({ text: 'Log grades to track CGPA', type: 'warning' });
    }

    return { score: finalScore, status, insights };
  };

  const healthData = getAcademicHealth();

  // 5. Timetable filter for Today
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = weekdays[new Date().getDay()];
  const todaysClasses = timetable
    .filter(t => t.day.toLowerCase() === currentDayName.toLowerCase())
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Next Class preview
  const currentTimeMinutes = (() => {
    const now = new Date();
    return (now.getHours() * 60) + now.getMinutes();
  })();
  const currentClass = todaysClasses.find(t =>
    timeToMinutes(t.startTime) <= currentTimeMinutes && currentTimeMinutes < timeToMinutes(t.endTime)
  );

  const getNextClass = () => {
    if (todaysClasses.length === 0) return null;
    const next = todaysClasses.find(t => timeToMinutes(t.startTime) > currentTimeMinutes);
    return currentClass || next || null;
  };
  const nextClass = getNextClass();

  // ----------------------------------------------------
  // MODULE ACTIONS
  // ----------------------------------------------------
  
  // Timetable Save
  const handleAddTimetable = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = normalizeSubject(ttSubject);
    const faculty = normalizeSubject(ttFaculty);
    const room = normalizeSubject(ttRoom);

    if (!subject || !faculty || !room) {
      triggerToast("Please fill in subject, faculty, and room fields.");
      return;
    }
    if (timeToMinutes(ttStart) >= timeToMinutes(ttEnd)) {
      triggerToast("End time must be after start time.");
      return;
    }
    const hasConflict = timetable.some(item => {
      if (item.id === ttEditingId || item.day !== ttDay) return false;
      const startsBeforeExistingEnds = timeToMinutes(ttStart) < timeToMinutes(item.endTime);
      const endsAfterExistingStarts = timeToMinutes(ttEnd) > timeToMinutes(item.startTime);
      return startsBeforeExistingEnds && endsAfterExistingStarts;
    });
    if (hasConflict) {
      triggerToast("This class overlaps with another lecture on the same day.");
      return;
    }

    const colors = [
      "bg-purple-600/20 text-purple-400 border-purple-500/20",
      "bg-cyan-600/20 text-cyan-400 border-cyan-500/20",
      "bg-emerald-600/20 text-emerald-400 border-emerald-500/20",
      "bg-amber-600/20 text-amber-400 border-amber-500/20",
      "bg-rose-600/20 text-rose-400 border-rose-500/20"
    ];
    const color = ttEditingId ? ttEditingColor : colors[Math.floor(Math.random() * colors.length)];

    const entry = db.saveTimetableEntry({
      id: ttEditingId || undefined,
      userId: currentUser.id,
      subject,
      faculty,
      room,
      day: ttDay,
      startTime: ttStart,
      endTime: ttEnd,
      color
    });

    setTimetable(ttEditingId ? timetable.map(item => item.id === ttEditingId ? entry : item) : [...timetable, entry]);
    setTtEditingId(null);
    setTtEditingColor("bg-purple-600/20 text-purple-400 border-purple-500/20");
    setTtSubject("");
    setTtFaculty("");
    setTtRoom("");
    setTtDay("Monday");
    setTtStart("09:00");
    setTtEnd("10:00");
    triggerToast(ttEditingId ? "Lecture block updated." : "Timetable entry logged!");
  };

  const handleEditTimetable = (entry: TimetableEntry) => {
    setTtEditingId(entry.id);
    setTtEditingColor(entry.color);
    setTtSubject(entry.subject);
    setTtFaculty(entry.faculty);
    setTtRoom(entry.room);
    setTtDay(entry.day);
    setTtStart(entry.startTime);
    setTtEnd(entry.endTime);
    triggerToast(`Editing ${entry.subject}.`);
  };

  const cancelTimetableEdit = () => {
    setTtEditingId(null);
    setTtEditingColor("bg-purple-600/20 text-purple-400 border-purple-500/20");
    setTtSubject("");
    setTtFaculty("");
    setTtRoom("");
    setTtDay("Monday");
    setTtStart("09:00");
    setTtEnd("10:00");
  };

  const handleDeleteTimetable = (id: string) => {
    db.deleteTimetableEntry(id);
    setTimetable(timetable.filter(t => t.id !== id));
    if (ttEditingId === id) {
      setTtEditingId(null);
      setTtSubject("");
      setTtFaculty("");
      setTtRoom("");
    }
    triggerToast("Class schedule removed.");
  };

  const handleClearAllTimetable = async () => {
    if (!currentUser) return;
    setIsClearingTimetable(true);
    try {
      db.clearAllTimetable(currentUser.id);
      setTimetable([]);
      setTtEditingId(null);
      setTtSubject("");
      setTtFaculty("");
      setTtRoom("");
      setIsClearAllModalOpen(false);
      triggerToast("Weekly lecture timetable cleared successfully.");
    } catch (err: any) {
      triggerToast("Failed to clear timetable.");
    } finally {
      setIsClearingTimetable(false);
    }
  };

  // Timetable Upload — import extracted entries from Gemini
  const handleImportExtracted = (entries: { subject: string; faculty: string; room: string; day: string; startTime: string; endTime: string }[]) => {
    if (!currentUser) return;
    const colors = [
      "bg-purple-600/20 text-purple-400 border-purple-500/20",
      "bg-cyan-600/20 text-cyan-400 border-cyan-500/20",
      "bg-emerald-600/20 text-emerald-400 border-emerald-500/20",
      "bg-amber-600/20 text-amber-400 border-amber-500/20",
      "bg-rose-600/20 text-rose-400 border-rose-500/20"
    ];
    const newEntries: TimetableEntry[] = [];
    entries.forEach((e, i) => {
      const entry = db.saveTimetableEntry({
        userId: currentUser.id,
        subject: e.subject,
        faculty: e.faculty,
        room: e.room,
        day: e.day,
        startTime: e.startTime,
        endTime: e.endTime,
        color: colors[i % colors.length]
      });
      newEntries.push(entry);
    });
    setTimetable(prev => [...prev, ...newEntries]);
    setIsUploadModalOpen(false);
    triggerToast(`Imported ${newEntries.length} timetable entries!`);
  };

  // Attendance CRUD
  const handleAddAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = normalizeSubject(attSubject);
    const attended = parseWholeNumber(attAttended);
    const total = parseWholeNumber(attTotal);

    if (!subject) {
      triggerToast("Enter the subject name first.");
      return;
    }
    if (!isValidNumber(attended) || !isValidNumber(total) || attended < 0 || total < 0) {
      triggerToast("Attendance counts must be zero or positive whole numbers.");
      return;
    }
    if (total === 0) {
      triggerToast("Total classes must be at least 1 to calculate attendance.");
      return;
    }
    if (attended > total) {
      triggerToast("Attended classes cannot exceed total classes.");
      return;
    }
    const duplicate = attendance.find(item => item.id !== attEditingId && item.subject.toLowerCase() === subject.toLowerCase());
    if (duplicate) {
      triggerToast("That subject already exists. Edit the existing tracker instead.");
      return;
    }

    const entry = db.saveAttendance({
      id: attEditingId || undefined,
      userId: currentUser.id,
      subject,
      attended,
      total
    });

    setAttendance(attEditingId ? attendance.map(item => item.id === attEditingId ? entry : item) : [...attendance, entry]);
    setAttEditingId(null);
    setAttSubject("");
    setAttAttended("0");
    setAttTotal("0");
    triggerToast(attEditingId ? "Attendance tracker updated." : "Subject attendance tracker enabled!");
  };

  const handleEditAttendance = (entry: AttendanceEntry) => {
    setAttEditingId(entry.id);
    setAttSubject(entry.subject);
    setAttAttended(String(entry.attended));
    setAttTotal(String(entry.total));
    triggerToast(`Editing attendance for ${entry.subject}.`);
  };

  const cancelAttendanceEdit = () => {
    setAttEditingId(null);
    setAttSubject("");
    setAttAttended("0");
    setAttTotal("0");
  };

  const handleIncrementAttendance = (id: string, isAttended: boolean) => {
    const item = attendance.find(a => a.id === id);
    if (!item) return;

    const updated = {
      ...item,
      attended: isAttended ? item.attended + 1 : item.attended,
      total: item.total + 1
    };

    db.saveAttendance(updated);
    setAttendance(attendance.map(a => a.id === id ? updated : a));
    triggerToast(isAttended ? "+1 Attended Class" : "+1 Missed Class");
  };

  const handleDeleteAttendance = (id: string) => {
    db.deleteAttendance(id);
    setAttendance(attendance.filter(a => a.id !== id));
    if (attEditingId === id) {
      setAttEditingId(null);
      setAttSubject("");
      setAttAttended("0");
      setAttTotal("0");
    }
    triggerToast("Course deleted from log.");
  };

  // CGPA Subject Save
  const handleAddCGPASubject = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectName = normalizeSubject(cgSubjectName);
    const credits = parseWholeNumber(cgCredits);

    if (!subjectName) {
      triggerToast("Subject name required.");
      return;
    }
    if (!isValidNumber(credits) || credits <= 0 || credits > 10) {
      triggerToast("Credits must be a whole number between 1 and 10.");
      return;
    }
    const duplicate = cgpaSubjects.find(item =>
      item.id !== cgEditingId &&
      item.semester === selectedSemester &&
      item.subjectName.toLowerCase() === subjectName.toLowerCase()
    );
    if (duplicate) {
      triggerToast("This course is already logged for the selected semester.");
      return;
    }

    const sub = db.saveCGPASubject({
      id: cgEditingId || undefined,
      userId: currentUser.id,
      semester: selectedSemester,
      subjectName,
      credits,
      grade: cgGrade
    });

    setCgpaSubjects(cgEditingId ? cgpaSubjects.map(item => item.id === cgEditingId ? sub : item) : [...cgpaSubjects, sub]);
    setCgEditingId(null);
    setCgSubjectName("");
    setCgCredits("3");
    setCgGrade("A+");
    triggerToast(cgEditingId ? "Course grade updated." : "Course grade logged!");
  };

  const handleEditCGPASubject = (subject: CGPASubject) => {
    setCgEditingId(subject.id);
    setSelectedSemester(subject.semester);
    setCgSubjectName(subject.subjectName);
    setCgCredits(String(subject.credits));
    setCgGrade(subject.grade);
    triggerToast(`Editing ${subject.subjectName}.`);
  };

  const cancelCGPAEdit = () => {
    setCgEditingId(null);
    setCgSubjectName("");
    setCgCredits("3");
    setCgGrade("A+");
  };

  const handleDeleteCGPASubject = (id: string) => {
    db.deleteCGPASubject(id);
    setCgpaSubjects(cgpaSubjects.filter(s => s.id !== id));
    if (cgEditingId === id) {
      setCgEditingId(null);
      setCgSubjectName("");
      setCgCredits("3");
      setCgGrade("A+");
    }
    triggerToast("Course removed from CGPA ledger.");
  };

  // Marks Predictor Save
  const handleAddPrediction = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = normalizeSubject(predSubject);
    const internalScore = parseDecimalNumber(predInternalScore);
    const internalTotal = parseDecimalNumber(predInternalTotal);
    const externalTotal = parseDecimalNumber(predExternalTotal);

    if (!subject) {
      triggerToast("Enter the course name for the prediction.");
      return;
    }
    if (!isValidNumber(internalScore) || !isValidNumber(internalTotal) || !isValidNumber(externalTotal)) {
      triggerToast("Marks fields must contain valid numbers.");
      return;
    }
    if (internalScore < 0 || internalTotal <= 0 || externalTotal <= 0) {
      triggerToast("Marks totals must be positive, and secured marks cannot be negative.");
      return;
    }
    if (internalScore > internalTotal) {
      triggerToast("Internal marks secured cannot exceed the internal total.");
      return;
    }

    const entry = db.saveMarksPrediction({
      id: predEditingId || undefined,
      userId: currentUser.id,
      subject,
      internalScore,
      internalTotal,
      externalTotal,
      targetGrade: predTargetGrade
    });

    setPredictions(predEditingId ? predictions.map(item => item.id === predEditingId ? entry : item) : [...predictions, entry]);
    setPredEditingId(null);
    setPredSubject("");
    setPredInternalScore("40");
    setPredInternalTotal("60");
    setPredExternalTotal("100");
    setPredTargetGrade("A+");
    triggerToast(predEditingId ? "Prediction updated." : "Predictor registered!");
  };

  const handleEditPrediction = (prediction: MarksPrediction) => {
    setPredEditingId(prediction.id);
    setPredSubject(prediction.subject);
    setPredInternalScore(String(prediction.internalScore));
    setPredInternalTotal(String(prediction.internalTotal));
    setPredExternalTotal(String(prediction.externalTotal));
    setPredTargetGrade(prediction.targetGrade);
    triggerToast(`Editing marks target for ${prediction.subject}.`);
  };

  const cancelPredictionEdit = () => {
    setPredEditingId(null);
    setPredSubject("");
    setPredInternalScore("40");
    setPredInternalTotal("60");
    setPredExternalTotal("100");
    setPredTargetGrade("A+");
  };

  const handleDeletePrediction = (id: string) => {
    db.deleteMarksPrediction(id);
    setPredictions(predictions.filter(p => p.id !== id));
    if (predEditingId === id) {
      setPredEditingId(null);
      setPredSubject("");
      setPredInternalScore("40");
      setPredInternalTotal("60");
      setPredExternalTotal("100");
    }
    triggerToast("Target prediction cleared.");
  };

  // Calendar Event Save
  const handleAddCalendarEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const title = normalizeSubject(calTitle);
    if (!title || !calDate) {
      triggerToast("Fill in summary and date.");
      return;
    }
    if (Number.isNaN(new Date(`${calDate}T00:00:00`).getTime())) {
      triggerToast("Choose a valid calendar date.");
      return;
    }

    const ev = db.saveCalendarEvent({
      id: calEditingId || undefined,
      userId: currentUser.id,
      title,
      date: calDate,
      type: calType
    });

    setCalendarEvents(calEditingId ? calendarEvents.map(item => item.id === calEditingId ? ev : item) : [...calendarEvents, ev]);
    setCalEditingId(null);
    setCalTitle("");
    setCalDate("");
    setCalType("deadline");
    triggerToast(calEditingId ? "Calendar event updated." : "Academic event added to schedule.");
  };

  const handleEditCalendarEvent = (event: CalendarEvent) => {
    setCalEditingId(event.id);
    setCalTitle(event.title);
    setCalDate(event.date);
    setCalType(event.type);
    triggerToast(`Editing ${event.title}.`);
  };

  const cancelCalendarEdit = () => {
    setCalEditingId(null);
    setCalTitle("");
    setCalDate("");
    setCalType("deadline");
  };

  const handleDeleteCalendarEvent = (id: string) => {
    db.deleteCalendarEvent(id);
    setCalendarEvents(calendarEvents.filter(e => e.id !== id));
    if (calEditingId === id) {
      setCalEditingId(null);
      setCalTitle("");
      setCalDate("");
      setCalType("deadline");
    }
    triggerToast("Event deleted.");
  };

  // Star Feedback Save
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage) {
      triggerToast("Feedback message cannot be blank.");
      return;
    }

    const sub = db.saveFeedback({
      userId: currentUser.id,
      message: feedbackMessage,
      rating: feedbackRating
    });

    setFeedbackHistory([sub, ...feedbackHistory]);
    setFeedbackMessage("");
    setFeedbackSubmitted(true);
    triggerToast("Feedback sent to administrators!");
    setTimeout(() => setFeedbackSubmitted(false), 4000);
  };

  // Apply trigger functions
  const applyForInternship = (id: string, company: string, role: string, applyLink?: string) => {
    if (!appliedInternships.includes(id)) {
      setAppliedInternships([...appliedInternships, id]);
      triggerToast(`Application submitted to ${company} for ${role}!`);
    }
    if (applyLink && applyLink !== "#" && applyLink.trim() !== "") {
      window.open(applyLink, "_blank", "noopener,noreferrer");
    }
  };

  const applyForEvent = (id: string, title: string, applyLink?: string) => {
    if (!appliedEvents.includes(id)) {
      setAppliedEvents([...appliedEvents, id]);
      triggerToast(`Registered successfully for ${title}!`);
    }
    if (applyLink && applyLink !== "#" && applyLink.trim() !== "") {
      window.open(applyLink, "_blank", "noopener,noreferrer");
    }
  };

  // Search Logic
  const filteredLibrary = libraryFeed.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(librarySearch.toLowerCase()) || 
                          item.subject.toLowerCase().includes(librarySearch.toLowerCase());
    const matchesCategory = libraryCategoryFilter === "All" || item.type === libraryCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Opportunity Radar Logic
  const fieldKeywords: Record<string, string[]> = {
    "ECE": ["ece", "electronics", "communication", "hardware", "circuit", "vlsi", "embedded", "microcontroller", "pcb"],
    "Embedded": ["embedded", "microcontroller", "arduino", "raspberry pi", "iot", "sensor", "firmware", "rtos"],
    "Robotics": ["robotics", "automation", "ros", "drone", "kinematics", "mechatronics", "bot"],
    "CS/IT": ["cs", "it", "computer science", "software", "developer", "coding", "programming", "web", "app", "data", "ai", "machine learning"]
  };

  const filteredEvents = eventsFeed.filter(ev => {
    const matchesType = radarTypeFilter === "All Types" || 
      (radarTypeFilter === "Hackathons" && ev.type.toLowerCase() === "hackathon") ||
      (radarTypeFilter === "Competitions" && ev.type.toLowerCase() === "competition") ||
      (radarTypeFilter === "Workshops" && ev.type.toLowerCase() === "workshop");
    
    if (!matchesType) return false;
    if (radarFieldFilter === "All Fields") return true;

    const searchString = `${ev.title} ${ev.description} ${ev.organizer}`.toLowerCase();
    const keywords = fieldKeywords[radarFieldFilter] || [radarFieldFilter.toLowerCase()];
    return keywords.some(kw => searchString.includes(kw));
  });

  const filteredInternships = internshipsFeed.filter(item => {
    if (radarFieldFilter === "All Fields") return true;
    const searchString = `${item.role} ${item.company} ${item.eligibility}`.toLowerCase();
    const keywords = fieldKeywords[radarFieldFilter] || [radarFieldFilter.toLowerCase()];
    return keywords.some(kw => searchString.includes(kw));
  });

  // Calendar render grid helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const calendarDays = getDaysInMonth(currentCalendarMonth);
  const startDayOffset = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), 1).getDay();

  // ----------------------------------------------------
  // PRIMARY WEB APPLICATION VIEW PORTAL
  // ----------------------------------------------------
  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 bg-[var(--bg)] text-[var(--on-surface)] ${isDarkMode ? 'dark' : ''}`}>
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] rounded-xl border border-[#7C3AED]/40 px-5 py-3 text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce ${isDarkMode ? 'bg-[#1a1625] text-white shadow-black/30' : 'bg-white text-zinc-800 shadow-zinc-300/50'}`}>
          <Sparkles className="h-4 w-4 text-[#06B6D4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* App Shell */}
      <div className={`app-shell ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {isSidebarOpen && (
          <button
            type="button"
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}
        
        {/* SIDEBAR */}
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
            onClick={() => setIsSidebarCollapsed(prev => !prev)}
            className="sidebar-collapse-btn"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="material-symbols-outlined">
              {isSidebarCollapsed ? "chevron_right" : "chevron_left"}
            </span>
            <span>Collapse</span>
          </button>
        </aside>

        {/* MAIN WRAPPER */}
        <div className="main-wrapper">
          
          {/* TOP NAV */}
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
                value={librarySearch}
                onChange={(e) => {
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
              
              <button className="icon-btn notif-btn" aria-label="Notifications" onClick={() => triggerToast("You have no new notifications.")}>
                <span className="material-symbols-outlined">notifications</span>
                <span className="notif-badge" />
              </button>

              <button className="icon-btn" aria-label="History" onClick={() => setActiveTab("Feedback")}>
                <span className="material-symbols-outlined">history_edu</span>
              </button>

              <div className="nav-divider"></div>
              
              <div className="user-chip">
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

          {/* SCROLLABLE MAIN CONTENT */}
          <main className="dashboard-main flex-1 overflow-y-auto p-3 sm:p-5 relative">

            {/* ─── TAB 1: MAIN DASHBOARD ─── */}
            {activeTab === "Dashboard" && (
              <DashboardView 
                currentUser={currentUser!}
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
                totalXp={(timetable.length * 50) + (attendance.length * 20) + (cgpaSubjects.length * 100) + (calendarEvents.length * 10) + (predictions.length * 10)}
                momentum={cumulativeAttendancePercent > 75 ? 12 : cumulativeAttendancePercent > 60 ? 5 : 2}
              />
            )}

        {/* ----------------------------------------------------
            TAB 2: TIMETABLE MODULE
            ---------------------------------------------------- */}
        {activeTab === "Timetable / Schedule" && (
          <div className="space-y-6">
            
            {/* Input Schedule Form */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-[#7C3AED]" /> Log Course Schedule
                </h3>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-3.5 py-2 text-[10px] font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Upload Timetable (AI)
                </button>
              </div>

              <form onSubmit={handleAddTimetable} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Course Subject</label>
                  <input 
                    type="text" 
                    value={ttSubject} 
                    onChange={e => setTtSubject(e.target.value)} 
                    placeholder="Computer Networks"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Instructor / Faculty</label>
                  <input 
                    type="text" 
                    value={ttFaculty} 
                    onChange={e => setTtFaculty(e.target.value)} 
                    placeholder="Dr. Alan Turing"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Room Code</label>
                  <input 
                    type="text" 
                    value={ttRoom} 
                    onChange={e => setTtRoom(e.target.value)} 
                    placeholder="Lab-304"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Weekday Day</label>
                  <select 
                    value={ttDay} 
                    onChange={e => setTtDay(e.target.value)}
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  >
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Starts At</label>
                    <input 
                      type="time" 
                      value={ttStart} 
                      onChange={e => setTtStart(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Ends At</label>
                    <input 
                      type="time" 
                      value={ttEnd} 
                      onChange={e => setTtEnd(e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                    />
                  </div>
                </div>

                <div className="lg:col-span-3 flex justify-end gap-3">
                  {ttEditingId && (
                    <button
                      type="button"
                      onClick={cancelTimetableEdit}
                      className="rounded-lg border border-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-400 hover:bg-zinc-800/60 transition-all"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md active:scale-95"
                  >
                    {ttEditingId ? "Update Lecture Block" : "Add Lecture Block"}
                  </button>
                </div>
              </form>
            </div>

            {/* Weekly Timetable Grid Board */}
            <div className="glass-card rounded-2xl p-5 overflow-x-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase">Weekly Lecture Grid</h3>
                {timetable.length > 0 && (
                  <button
                    onClick={() => setIsClearAllModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="min-w-[800px] grid grid-cols-6 gap-4">
                
                {/* Index Col */}
                <div className="space-y-3 font-semibold text-center border-r border-zinc-800/40 pr-2">
                  <div className="h-10 flex items-center justify-center text-zinc-500 text-[10px] uppercase font-bold">Weekdays</div>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                    <div key={day} className="h-[88px] flex items-center justify-center text-xs text-zinc-400 font-bold">{day.slice(0, 3)}</div>
                  ))}
                </div>

                {/* Schedule rows: a single right-hand column keeps every weekday aligned with its label. */}
                <div className="col-span-5 grid grid-rows-[repeat(6,88px)] gap-3 pt-[52px]">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(dayName => {
                  const classes = timetable.filter(t => t.day.toLowerCase() === dayName.toLowerCase());
                  return (
                    <div key={dayName} className="relative min-h-0">
                      
                      {classes.length > 0 ? (
                        <div className="flex h-full items-stretch gap-3 overflow-x-auto py-1">
                          {classes.map(item => (
                            <div 
                              key={item.id} 
                              className={`flex-shrink-0 w-48 rounded-xl border p-3 flex flex-col justify-between ${item.color} relative group ${currentClass?.id === item.id ? "ring-2 ring-[#06B6D4] ring-offset-2 ring-offset-[#09090B]" : ""}`}
                            >
                              <div>
                                <span className="text-xs font-bold block truncate">{item.subject}</span>
                                <span className="text-[9px] opacity-80 block truncate">Room: {item.room} &bull; {item.faculty}</span>
                              </div>

                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/10">
                                <span className="text-[9px] font-bold">{item.startTime} - {item.endTime}</span>
                                
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                  <button
                                    onClick={() => handleEditTimetable(item)}
                                    className="p-1 text-zinc-500 hover:text-[#06B6D4] transition-all"
                                    title="Edit lecture block"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteTimetable(item.id)}
                                    className="p-1 text-red-500 hover:text-red-400 transition-all"
                                    title="Delete lecture block"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center pl-4 text-[10px] text-zinc-600 font-semibold italic h-16">
                          No lectures scheduled
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>

              </div>
            </div>

            {/* AI Upload Modal */}
            {isUploadModalOpen && (
              <TimetableUpload
                isDarkMode={isDarkMode}
                onImport={handleImportExtracted}
                onClose={() => setIsUploadModalOpen(false)}
                triggerToast={triggerToast}
              />
            )}

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 3: ATTENDANCE MODULE
            ---------------------------------------------------- */}
        {activeTab === "Attendance" && (
          <div className="space-y-6">
            
            {/* Quick Setup Form */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-[#7C3AED]" /> {attEditingId ? "Update Course Attendance" : "Register Course Attendance"}
              </h3>

              <form onSubmit={handleAddAttendance} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Subject / Course Name</label>
                  <input 
                    type="text" 
                    value={attSubject} 
                    onChange={e => setAttSubject(e.target.value)} 
                    placeholder="Compiler Design"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Classes Attended</label>
                  <input 
                    type="number" 
                    value={attAttended} 
                    onChange={e => setAttAttended(e.target.value)}
                    min="0"
                    step="1"
                    placeholder="18"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Total Classes Conducted</label>
                  <input 
                    type="number" 
                    value={attTotal} 
                    onChange={e => setAttTotal(e.target.value)}
                    min="1"
                    step="1"
                    placeholder="24"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end gap-3">
                  {attEditingId && (
                    <button
                      type="button"
                      onClick={cancelAttendanceEdit}
                      className="rounded-lg border border-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-400 hover:bg-zinc-800/60 transition-all"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                  >
                    {attEditingId ? "Update Tracker" : "Track Subject"}
                  </button>
                </div>
              </form>
            </div>

            {/* Attendance Trackers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {attendance.map(item => {
                const percent = item.total > 0 ? (item.attended / item.total) * 100 : 0;
                const isSafe = percent >= 75;
                const skips = Math.max(0, Math.floor((item.attended * 4 - item.total * 3) / 3));
                const rec = Math.max(0, Math.ceil((0.75 * item.total - item.attended) / 0.25));

                return (
                  <div key={item.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-sm font-bold text-white block">{item.subject}</span>
                          <span className="text-[10px] text-zinc-500 font-semibold">Tally: {item.attended} / {item.total} lectures</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${isSafe ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                          {percent.toFixed(1)}%
                        </span>
                      </div>

                      {/* Horizontal progress bar */}
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full my-4 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${isSafe ? "bg-[#06B6D4]" : "bg-red-500"}`} 
                          style={{ width: `${Math.min(100, percent)}%` }} 
                        />
                      </div>

                      {/* Dynamic indicators */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 bg-zinc-800/30 rounded-xl border border-zinc-800/50">
                        <div className="text-center border-r border-zinc-800">
                          <span className="block text-[10px] font-bold text-zinc-500 uppercase">Skip Margin</span>
                          <span className={`text-base font-extrabold block ${isSafe ? "text-emerald-400" : "text-zinc-500"}`}>
                            {isSafe ? `${skips} Classes` : "0"}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="block text-[10px] font-bold text-zinc-500 uppercase">Recovery Target</span>
                          <span className={`text-base font-extrabold block ${!isSafe ? "text-red-400" : "text-zinc-500"}`}>
                            {!isSafe ? `${rec} classes` : "Safe"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick increment buttons */}
                    <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-zinc-800/40">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleIncrementAttendance(item.id, true)}
                          className="bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
                        >
                          +1 Attended
                        </button>
                        <button 
                          onClick={() => handleIncrementAttendance(item.id, false)}
                          className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-bold text-[10px] px-2.5 py-1.5 rounded-lg transition-all"
                        >
                          +1 Missed
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditAttendance(item)}
                          className="text-zinc-600 hover:text-[#06B6D4] p-1 transition-all"
                          title="Edit Course Tracker"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAttendance(item.id)}
                          className="text-zinc-600 hover:text-red-500 p-1 transition-all"
                          title="Delete Course Tracker"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {attendance.length === 0 && (
                <div className="md:col-span-2 text-center border border-dashed border-zinc-800 rounded-2xl p-8">
                  <p className="text-sm font-bold text-zinc-300">No attendance trackers yet.</p>
                  <p className="text-xs text-zinc-500 mt-1">Add each subject once, then use the quick buttons after every class.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 4: CGPA CALCULATOR
            ---------------------------------------------------- */}
        {activeTab === "CGPA Calculator" && (
          <div className="space-y-6">
            
            {/* Quick Metrics Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-card rounded-2xl p-5 text-center">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Cumulative CGPA</span>
                <span className="text-4xl font-extrabold text-[#7C3AED] tracking-tight">{overallCGPA > 0 ? overallCGPA.toFixed(2) : "0.00"}</span>
              </div>
              <div className="glass-card rounded-2xl p-5 text-center">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Total Credits Earned</span>
                <span className="text-4xl font-extrabold text-[#06B6D4] tracking-tight">{overallCredits} pts</span>
              </div>
              <div className="glass-card rounded-2xl p-5 text-center flex flex-col justify-center">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Batch Standing</span>
                <span className="text-xs font-semibold text-zinc-400 mt-1">{getPerformanceSummary(overallCGPA)}</span>
              </div>
            </div>

            {/* Semester selector & Input Form */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-zinc-800/40">
                <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase">Grade Ledger Panel</h3>
                
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <button 
                      key={sem}
                      onClick={() => setSelectedSemester(sem)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${selectedSemester === sem ? "bg-[#7C3AED] text-white border-transparent" : "border-zinc-800 hover:bg-zinc-800 text-zinc-400"}`}
                    >
                      Sem {sem}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add grade input form */}
              <form onSubmit={handleAddCGPASubject} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Subject Title</label>
                  <input 
                    type="text" 
                    value={cgSubjectName} 
                    onChange={e => setCgSubjectName(e.target.value)} 
                    placeholder="Engineering Mathematics III"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Course Credit Value</label>
                  <input 
                    type="number" 
                    value={cgCredits} 
                    onChange={e => setCgCredits(e.target.value)}
                    min="1"
                    max="10"
                    step="1"
                    placeholder="3"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Awarded Grade Scale</label>
                  <select 
                    value={cgGrade} 
                    onChange={e => setCgGrade(e.target.value as CGPASubject["grade"])}
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  >
                    <option>O</option>
                    <option>A+</option>
                    <option>A</option>
                    <option>B+</option>
                    <option>B</option>
                    <option>C</option>
                    <option>F</option>
                  </select>
                </div>

                <div className="sm:col-span-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-[10px] text-zinc-500 font-medium">
                    SGPA = total credit-weighted grade points divided by total credits.
                  </p>
                  <div className="flex justify-end gap-3">
                    {cgEditingId && (
                      <button
                        type="button"
                        onClick={cancelCGPAEdit}
                        className="rounded-lg border border-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-400 hover:bg-zinc-800/60 transition-all"
                      >
                        Cancel Edit
                      </button>
                    )}
                  <button 
                    type="submit"
                    className="rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                  >
                      {cgEditingId ? "Update Grade Course" : "Log Grade Course"}
                  </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Semester Grades Ledger Table */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold tracking-wide text-zinc-500 uppercase">Grades Sheet - Semester {selectedSemester}</h4>
                <div className="text-xs font-bold text-zinc-400 bg-zinc-800/40 border border-zinc-800 px-3 py-1 rounded-lg">
                  SGPA: <strong className="text-[#06B6D4]">{getSGPA(selectedSemester).toFixed(2)}</strong>
                </div>
              </div>

              {cgpaSubjects.filter(s => s.semester === selectedSemester).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-[560px] w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500">
                        <th className="py-2.5">Subject</th>
                        <th className="py-2.5">Credits</th>
                        <th className="py-2.5">Grade</th>
                        <th className="py-2.5">Points Value</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cgpaSubjects.filter(s => s.semester === selectedSemester).map(item => (
                        <tr key={item.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/10">
                          <td className="py-3 font-semibold text-white">{item.subjectName}</td>
                          <td className="py-3 text-zinc-400">{item.credits}</td>
                          <td className="py-3 font-extrabold text-[#7C3AED]">{item.grade}</td>
                          <td className="py-3 text-zinc-400">{gradePoints[item.grade]}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleEditCGPASubject(item)}
                              className="text-zinc-600 hover:text-[#06B6D4] p-1.5 transition-all"
                              title="Edit course grade"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCGPASubject(item.id)}
                              className="text-zinc-600 hover:text-red-500 p-1.5 transition-all"
                              title="Delete course grade"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 text-center py-8 border border-dashed border-zinc-800 rounded-xl">
                  No courses logged under Semester {selectedSemester}. Enter course details to compile SGPAs.
                </p>
              )}
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 5: MARKS PREDICTOR
            ---------------------------------------------------- */}
        {activeTab === "Marks Predictor" && (
          <div className="space-y-6">
            
            {/* Input target panel */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-[#7C3AED]" /> Target Grade Calibration Form
              </h3>

              <form onSubmit={handleAddPrediction} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Course Name</label>
                  <input 
                    type="text" 
                    value={predSubject} 
                    onChange={e => setPredSubject(e.target.value)} 
                    placeholder="Operating Systems"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Internals Secured (e.g. 40)</label>
                  <input 
                    type="number" 
                    value={predInternalScore} 
                    onChange={e => setPredInternalScore(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="40"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Internals Total Cap (e.g. 60)</label>
                  <input 
                    type="number" 
                    value={predInternalTotal} 
                    onChange={e => setPredInternalTotal(e.target.value)}
                    min="0.01"
                    step="0.01"
                    placeholder="60"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">External Total Cap</label>
                  <input
                    type="number"
                    value={predExternalTotal}
                    onChange={e => setPredExternalTotal(e.target.value)}
                    min="0.01"
                    step="0.01"
                    placeholder="100"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Target Grade Boundary</label>
                  <select 
                    value={predTargetGrade} 
                    onChange={e => setPredTargetGrade(e.target.value as MarksPrediction["targetGrade"])}
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  >
                    <option>O</option>
                    <option>A+</option>
                    <option>A</option>
                    <option>B+</option>
                    <option>B</option>
                    <option>C</option>
                  </select>
                </div>

                <div className="lg:col-span-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 text-[10px] text-zinc-500 font-medium pb-2 italic self-center">
                    * Calculation scale assumes Internals = 60%, Externals = 40% grade weighting.
                  </div>
                  <div className="flex justify-end gap-3">
                    {predEditingId && (
                      <button
                        type="button"
                        onClick={cancelPredictionEdit}
                        className="rounded-lg border border-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-400 hover:bg-zinc-800/60 transition-all"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                    >
                      {predEditingId ? "Update Prediction" : "Generate Prediction"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Predictions List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {predictions.map(item => {
                const requirement = getExternalRequirement(item);

                return (
                  <div key={item.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between border-t-2 border-t-[#06B6D4]">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-base font-extrabold text-white block">{item.subject}</span>
                          <span className="text-[10px] text-zinc-500 font-semibold">Current Internals: {item.internalScore} / {item.internalTotal} ({requirement.internalContrib.toFixed(1)} / 60.0 pts)</span>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-zinc-500 block uppercase">Target Grade</span>
                          <span className="text-lg font-extrabold text-[#7C3AED] block">{item.targetGrade} ({requirement.targetBoundary}%)</span>
                        </div>
                      </div>

                      {/* Calculations Details block */}
                      <div className="space-y-3 p-3 bg-zinc-800/30 rounded-xl border border-zinc-800">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-400">Needed External Score:</span>
                          <span className={`font-bold ${requirement.feasible ? "text-white" : "text-rose-500"}`}>
                            {requirement.alreadySecured ? "Already secured" : requirement.feasible ? `${requirement.rawExternalNeeded} / ${item.externalTotal}` : "Impossible"}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-zinc-500">Weighted points still needed:</span>
                          <span className="font-bold text-zinc-300">{Math.max(0, requirement.neededExternalContrib).toFixed(1)} / 40</span>
                        </div>

                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${requirement.feasible ? "bg-[#7C3AED]" : "bg-red-500"}`}
                            style={{ width: `${Math.min(100, Math.max(0, (requirement.rawExternalNeeded / item.externalTotal) * 100))}%` }}
                          />
                        </div>

                        {!requirement.feasible && (
                          <p className="text-[10px] text-red-500 font-bold leading-normal">
                            Target grade is mathematically out of bounds. Reduce the target grade or confirm your exam totals.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-3 border-t border-zinc-800/40">
                      <span className="text-[10px] font-medium text-zinc-500 italic">
                        {requirement.alreadySecured ? "Current internals already meet this target." : requirement.feasible ? "Use this as your minimum final exam target." : "Target grade warning active."}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditPrediction(item)}
                          className="text-zinc-600 hover:text-[#06B6D4] p-1.5 transition-all"
                          title="Edit prediction"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePrediction(item.id)}
                          className="text-zinc-600 hover:text-red-500 p-1.5 transition-all"
                          title="Delete prediction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {predictions.length === 0 && (
                <div className="md:col-span-2 text-center border border-dashed border-zinc-800 rounded-2xl p-8">
                  <p className="text-sm font-bold text-zinc-300">No marks predictions yet.</p>
                  <p className="text-xs text-zinc-500 mt-1">Add a course to see the exact external score needed for your target grade.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 6: CALENDAR MODULE
            ---------------------------------------------------- */}
        {activeTab === "Calendar" && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Core Calendar UI Grid */}
              <div className="glass-card rounded-2xl p-5 xl:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase">Academic Calendar</h3>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1))}
                      className="px-2.5 py-1.5 text-xs border border-zinc-800 hover:bg-zinc-800 rounded-lg text-zinc-400 font-bold"
                    >
                      Prev
                    </button>
                    <span className="text-xs font-bold text-white px-2">
                      {currentCalendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                    <button 
                      onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1))}
                      className="px-2.5 py-1.5 text-xs border border-zinc-800 hover:bg-zinc-800 rounded-lg text-zinc-400 font-bold"
                    >
                      Next
                    </button>
                  </div>
                </div>

                {/* Calendar monthly block */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold mb-2 text-zinc-500 uppercase tracking-wider text-[9px] sm:text-[10px]">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                    <div key={d} className="py-1">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {/* Offsets */}
                  {Array.from({ length: startDayOffset }).map((_, i) => (
                    <div key={`offset-${i}`} className="h-10 sm:h-16 border border-zinc-800/10 rounded-lg" />
                  ))}

                  {/* Month days */}
                  {calendarDays.map(dayObj => {
                    const dateStr = dayObj.toISOString().split("T")[0];
                    const dayEvents = calendarEvents.filter(e => e.date === dateStr);
                    const isToday = new Date().toDateString() === dayObj.toDateString();

                    return (
                      <div 
                        key={dateStr}
                        className={`min-h-[64px] border p-1 rounded-lg flex flex-col justify-between transition-all ${isToday ? "border-[#7C3AED] bg-[#7C3AED]/5" : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/10"}`}
                      >
                        <span className={`text-[10px] font-bold block text-left ${isToday ? "text-[#7C3AED]" : "text-zinc-500"}`}>
                          {dayObj.getDate()}
                        </span>

                        <div className="space-y-1 mt-1">
                          {dayEvents.slice(0, 2).map(ev => {
                            const badgeColors = {
                              exam: "bg-red-500/20 text-red-400 border-red-500/20",
                              deadline: "bg-amber-500/20 text-amber-400 border-amber-500/20",
                              reminder: "bg-purple-500/20 text-purple-400 border-purple-500/20",
                              holiday: "bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/20"
                            };
                            return (
                              <div 
                                key={ev.id}
                                className={`text-[8px] px-1 rounded truncate border font-medium ${badgeColors[ev.type]}`}
                                title={ev.title}
                              >
                                {ev.title}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add event Form */}
              <div className="space-y-6">
                
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-[#7C3AED]" /> {calEditingId ? "Update Task Event" : "Record Task Event"}
                  </h3>

                  <form onSubmit={handleAddCalendarEvent} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Event Summary</label>
                      <input 
                        type="text" 
                        value={calTitle} 
                        onChange={e => setCalTitle(e.target.value)} 
                        placeholder="Study Group Session"
                        className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Target Date</label>
                      <input 
                        type="date" 
                        value={calDate} 
                        onChange={e => setCalDate(e.target.value)} 
                        className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Type Categories</label>
                      <select 
                        value={calType} 
                        onChange={e => setCalType(e.target.value as CalendarEvent["type"])}
                        className={`w-full rounded-lg border px-3 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                      >
                        <option>exam</option>
                        <option>deadline</option>
                        <option>reminder</option>
                        <option>holiday</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      {calEditingId && (
                        <button
                          type="button"
                          onClick={cancelCalendarEdit}
                          className="flex-1 rounded-lg border border-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-400 hover:bg-zinc-800/60 transition-all"
                        >
                          Cancel
                        </button>
                      )}
                      <button 
                        type="submit"
                        className="flex-1 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                      >
                        {calEditingId ? "Update Event" : "Log Event"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Event lists logger details */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-3">Academic Milestones</h3>
                  
                  <div className="space-y-2.5 overflow-y-auto max-h-48 pr-1">
                    {calendarEvents.filter(e => e.userId !== 'admin').length > 0 ? calendarEvents.filter(e => e.userId !== 'admin').map(ev => (
                      <div key={ev.id} className="flex items-center justify-between p-2.5 border border-zinc-800 rounded-lg bg-zinc-900/10">
                        <div>
                          <span className="text-xs font-bold text-white block truncate max-w-[120px]">{ev.title}</span>
                          <span className="text-[9px] text-zinc-500 block font-semibold">{ev.date} &bull; {ev.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditCalendarEvent(ev)}
                            className="text-zinc-600 hover:text-[#06B6D4] transition-all p-1"
                            title="Edit event"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCalendarEvent(ev.id)}
                            className="text-zinc-600 hover:text-red-500 transition-all p-1"
                            title="Delete event"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )) : (
                      <p className="text-xs text-zinc-500 text-center py-6 border border-dashed border-zinc-800 rounded-xl">
                        No personal events yet. Add deadlines, exams, reminders, or holidays here.
                      </p>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 7: EVENTS / NETWORK MODULE
            ---------------------------------------------------- */}
        {activeTab === "Events / Network" && (
          <div className="space-y-6">
            
            {/* Filter Controls Panel (Opportunity Radar) */}
            <div className="glass-card rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center gap-5 justify-between">
              <div className="flex-1">
                <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#7C3AED]" /> Technical Field Focus
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  {["All Fields", "ECE", "Embedded", "Robotics", "CS/IT"].map(field => (
                    <button 
                      key={field}
                      onClick={() => setRadarFieldFilter(field)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${radarFieldFilter === field ? "bg-[#7C3AED] text-white border-transparent shadow-md shadow-[#7C3AED]/20" : "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-400"}`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:border-l lg:border-zinc-800/60 lg:pl-5">
                <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-3 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-[#06B6D4]" /> Event Type
                </h3>
                <select 
                  value={radarTypeFilter}
                  onChange={(e) => setRadarTypeFilter(e.target.value)}
                  className={`w-full lg:w-48 rounded-lg border px-3 py-2 text-xs font-bold transition-all outline-none ${isDarkMode ? "border-zinc-800 bg-[#121214] text-white focus:border-[#06B6D4]" : "border-zinc-300 bg-zinc-50 text-zinc-900 focus:border-[#06B6D4]"}`}
                >
                  <option value="All Types">All Types</option>
                  <option value="Hackathons">Hackathons</option>
                  <option value="Competitions">Competitions</option>
                  <option value="Workshops">Workshops</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(ev => (
                  <div key={ev.id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#7C3AED]/40 transition-all group">
                    <div className="relative">
                      {ev.image ? (
                        <img 
                          src={ev.image} 
                          alt={ev.title} 
                          className="h-44 w-full object-cover border-b border-zinc-800/40 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-44 w-full border-b border-zinc-800/40 bg-gradient-to-br from-[#7C3AED]/35 via-[#18121f] to-[#06B6D4]/20" aria-hidden="true" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-white uppercase bg-[#7C3AED]/80 px-2 py-0.5 rounded backdrop-blur-md">
                          {ev.type}
                        </span>
                        <span className="text-[10px] text-zinc-300 font-bold drop-shadow-md">{ev.date}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-base font-extrabold text-white leading-snug">{ev.title}</h4>
                        <span className="text-[11px] text-[#06B6D4] font-bold block mt-1.5 mb-3">{ev.organizer}</span>
                        <p className="text-xs text-zinc-500 leading-relaxed mb-4">{ev.description}</p>
                      </div>

                      <button 
                        onClick={() => applyForEvent(ev.id, ev.title, ev.applyLink)}
                        className={`w-full rounded-lg py-2.5 text-xs font-bold transition-all border ${appliedEvents.includes(ev.id) ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold" : "bg-[#7C3AED] hover:bg-[#6D28D9] border-transparent text-white active:scale-95"}`}
                      >
                        {appliedEvents.includes(ev.id) ? "Registration Confirmed ✓" : "Register to Network"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center border border-zinc-800/40 border-dashed rounded-2xl bg-zinc-900/20">
                  <Code2 className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400 font-bold">No events found</p>
                  <p className="text-xs text-zinc-500 mt-1">Try adjusting your field focus.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 8: INTERNSHIP MODULE
            ---------------------------------------------------- */}
        {activeTab === "Internship" && (
          <div className="space-y-6">
            
            {/* Filter Controls Panel (Opportunity Radar) */}
            <div className="glass-card rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center gap-5 justify-between">
              <div className="flex-1">
                <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#7C3AED]" /> Technical Field Focus
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  {["All Fields", "ECE", "Embedded", "Robotics", "CS/IT"].map(field => (
                    <button 
                      key={field}
                      onClick={() => setRadarFieldFilter(field)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all ${radarFieldFilter === field ? "bg-[#7C3AED] text-white border-transparent shadow-md shadow-[#7C3AED]/20" : "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-400"}`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInternships.length > 0 ? (
                filteredInternships.map(item => (
                  <div key={item.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between border-l-4 border-l-[#7C3AED] hover:border-l-[#06B6D4] transition-all">
                    
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-base font-extrabold text-white">{item.role}</h4>
                          <span className="text-xs text-[#06B6D4] font-bold block mt-1">{item.company}</span>
                        </div>

                        <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center font-black text-white border border-zinc-700 shadow-inner">
                          {item.logo}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-zinc-800/20 rounded-xl border border-zinc-850">
                        <div>
                          <span className="block text-[9px] font-bold text-zinc-500 uppercase">Stipend Cap</span>
                          <span className="text-xs font-extrabold text-white">{item.stipend}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-zinc-500 uppercase">Duration</span>
                          <span className="text-xs font-bold text-zinc-400">{item.duration}</span>
                        </div>
                      </div>

                      <div className="space-y-1 mb-5">
                        <span className="block text-[9px] font-bold text-zinc-500 uppercase">Eligibility Criteria</span>
                        <p className="text-xs text-zinc-400 leading-normal line-clamp-2">{item.eligibility}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => applyForInternship(item.id, item.company, item.role, item.applyLink)}
                      className={`w-full rounded-lg py-2.5 text-xs font-bold transition-all border ${appliedInternships.includes(item.id) ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold" : "bg-[#7C3AED] hover:bg-[#6D28D9] border-transparent text-white active:scale-95"}`}
                    >
                      {appliedInternships.includes(item.id) ? "Application Transmitted ✓" : "Apply Instantly"}
                    </button>

                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center border border-zinc-800/40 border-dashed rounded-2xl bg-zinc-900/20">
                  <Briefcase className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400 font-bold">No internships found</p>
                  <p className="text-xs text-zinc-500 mt-1">Try adjusting your field focus.</p>
                </div>
              )}
            </div>

          </div>
        )}


        {/* ----------------------------------------------------
            TAB 9: E-LIBRARY
            ---------------------------------------------------- */}
        {activeTab === "E-Library" && (
          <div className="space-y-6">
            
            {/* Search Filter and Category Board */}
            <div className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
              
              <div className="w-full sm:max-w-md">
                <input 
                  type="text" 
                  value={librarySearch}
                  onChange={e => setLibrarySearch(e.target.value)}
                  placeholder="Search notes, subjects, exams or keywords..."
                  className={`w-full rounded-lg border px-4 py-2.5 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {["All", "Notes", "PDF", "PYQ", "Book"].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setLibraryCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${libraryCategoryFilter === cat ? "bg-[#7C3AED] text-white border-transparent" : "border-zinc-800 hover:bg-zinc-800 text-zinc-400"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Library Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLibrary.length > 0 ? (
                filteredLibrary.map(item => (
                  <div key={item.id} className="glass-card rounded-2xl p-5 flex flex-col justify-between hover:border-[#06B6D4]/50 transition-all">
                    
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-extrabold text-[#7C3AED] uppercase bg-[#7C3AED]/10 px-2 py-0.5 rounded border border-[#7C3AED]/20">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold">{item.size}</span>
                      </div>

                      <h4 className="text-sm font-extrabold text-white leading-snug tracking-tight mb-2">{item.title}</h4>
                      <p className="text-[11px] text-zinc-400 font-semibold">{item.subject} &bull; {item.semester}</p>
                    </div>

                    <button 
                      onClick={() => triggerToast(`Downloading: ${item.title}...`)}
                      className="mt-5 w-full flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-850 hover:border-zinc-700 py-2.5 text-xs font-bold text-white transition-all active:scale-95"
                    >
                      <Download className="h-3.5 w-3.5 text-[#06B6D4]" />
                      Download Resource
                    </button>

                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center">
                  <p className="text-xs text-zinc-500 font-semibold italic">No matched academic resources. Adjust filtering query.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 10: FEEDBACK MODULE
            ---------------------------------------------------- */}
        {activeTab === "Feedback" && (
          <div className="space-y-6 max-w-xl mx-auto">
            
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-[#7C3AED]" /> Feedback Dispatch Portal
              </h3>

              {feedbackSubmitted ? (
                <div className="py-6 text-center text-emerald-400 space-y-2">
                  <Sparkles className="h-8 w-8 mx-auto animate-bounce text-[#06B6D4]" />
                  <h4 className="text-sm font-bold">Feedback Registered!</h4>
                  <p className="text-xs text-zinc-400">Thank you for making Acadsphere better.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-5">
                  
                  {/* Stars Widget */}
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Rating Scale</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button 
                          key={val} 
                          type="button"
                          onClick={() => setFeedbackRating(val)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`h-6 w-6 transition-all ${val <= feedbackRating ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" : "text-zinc-600"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Your Message</label>
                    <textarea 
                      rows={4}
                      value={feedbackMessage}
                      onChange={e => setFeedbackMessage(e.target.value)}
                      placeholder="Write your suggestions, bug reports, or feature requests here..."
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-[#7C3AED]/10 active:scale-95"
                  >
                    Submit Feedback
                  </button>

                </form>
              )}
            </div>

            {/* History timeline */}
            {feedbackHistory.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase mb-4">Transmission History</h3>
                
                <div className="space-y-4">
                  {feedbackHistory.map(item => (
                    <div key={item.id} className="p-3.5 border border-zinc-800 rounded-xl bg-zinc-900/10 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-bold">
                        <span className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </span>
                        <span>{item.date}</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-normal">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ----------------------------------------------------
            TAB 11: SETTINGS
            ---------------------------------------------------- */}
        {activeTab === "Settings" && (
          <div className="space-y-6 max-w-2xl">
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-sm font-bold tracking-wide text-zinc-500 uppercase">Profile Settings</h3>
              
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400">Full Name</label>
                    <input 
                      type="text" 
                      value={editFullName} 
                      onChange={e => setEditFullName(e.target.value)} 
                      placeholder="Your Full Name"
                      className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400">College / Institution</label>
                    <input 
                      type="text" 
                      value={editCollege} 
                      onChange={e => setEditCollege(e.target.value)} 
                      placeholder="Your College / Institution"
                      className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400">Email Address (Locked)</label>
                    <div className="w-full px-4 py-3 bg-zinc-900/10 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-500">
                      {currentUser.email}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400">Academic Year</label>
                    <select 
                      value={editYear} 
                      onChange={e => setEditYear(e.target.value)}
                      className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                    >
                      <option>I Year</option>
                      <option>II Year</option>
                      <option>III Year</option>
                      <option>IV Year</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    disabled={isSavingProfile}
                    className="rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isSavingProfile ? "Saving changes..." : "Save Profile Settings"}
                  </button>
                </div>
              </form>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-bold tracking-wide text-zinc-500 uppercase">Preferences</h3>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Theme Mode</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">Toggle between dark-first and light mode.</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${isDarkMode ? "border-zinc-800 bg-zinc-900 text-[#06B6D4]" : "border-zinc-200 bg-zinc-100 text-zinc-600"}`}
                >
                  {isDarkMode ? "Dark Mode" : "Light Mode"}
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-zinc-200/50 dark:border-zinc-800/40">
                <div className="flex flex-col">
                  <span className="text-xs font-bold">Database Synchronizer</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">Force sync local storage with live database.</span>
                </div>
                <button
                  onClick={() => {
                    db.syncUserData(currentUser.id).then(() => {
                      triggerToast("Database cache re-synchronized!");
                    });
                  }}
                  className="px-4 py-2 text-xs font-bold bg-[#7c5cff] hover:bg-[#6D28D9] text-white rounded-lg transition-all"
                >
                  Sync Now
                </button>
              </div>
            </div>
            {authProvider !== "google" && (
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-bold tracking-wide text-zinc-500 uppercase">Change Password</h3>
                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Update Account Security</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">Modify your password securely using Supabase Auth.</span>
                  </div>
                  <button
                    onClick={() => {
                      setChangeCurrentPassword("");
                      setChangeNewPassword("");
                      setChangeConfirmNewPassword("");
                      setPasswordUpdateError(null);
                      setIsChangePasswordOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-bold bg-[#7c5cff] hover:bg-[#6D28D9] text-white rounded-lg transition-all"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 12: SUPPORT
            ---------------------------------------------------- */}
        {activeTab === "Support" && (
          <div className="space-y-6 max-w-2xl">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-bold tracking-wide text-zinc-500 uppercase">Need Assistance?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Welcome to the Acadsphere Support channel. If you have any technical questions, encounter bugs, or need help with course tracking or GPA predictors, please choose one of the options below.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-900/10 space-y-2">
                  <span className="text-xs font-bold block">Submit a Bug Report</span>
                  <p className="text-[10px] text-zinc-500">File a bug directly to developers using our feedback module.</p>
                  <button 
                    onClick={() => setActiveTab("Feedback")} 
                    className="text-[10px] font-bold text-[#7c5cff] hover:underline flex items-center gap-1 mt-1"
                  >
                    Go to Feedback <ChevronRight className="h-3 w-3 inline" />
                  </button>
                </div>

                <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-900/10 space-y-2">
                  <span className="text-xs font-bold block">Documentation & FAQ</span>
                  <p className="text-[10px] text-zinc-500">Learn how skip margins are calculated and CGPA weights are handled.</p>
                  <p className="text-[10px] font-medium text-zinc-500">Documentation is not available yet.</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-sm font-bold tracking-wide text-zinc-500 uppercase">Ecosystem Verification</h3>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Supabase API Status</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Connected & Verified
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-zinc-200/50 dark:border-zinc-800/40 pt-3">
                <span className="text-zinc-500">Admin Console Sync</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Active (Port 3001)
                </span>
              </div>
            </div>
          </div>
        )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsChangePasswordOpen(false)}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl flex flex-col ${
              isDarkMode
                ? "bg-[#14121b] border-zinc-800 shadow-purple-500/5 text-zinc-100"
                : "bg-white border-zinc-200 shadow-purple-500/10 text-zinc-900"
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-5 border-b ${isDarkMode ? "border-zinc-800" : "border-zinc-200"}`}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">lock</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold">Change Password</h2>
                  <p className={`text-[10px] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                    Update your account security settings
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
                  isDarkMode ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-zinc-100 text-zinc-500"
                }`}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePasswordChange}>
              {/* Body */}
              <div className="p-5 space-y-4">
                {passwordUpdateError && (
                  <div className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs ${
                    isDarkMode ? "border-red-500/20 bg-red-500/5 text-red-400" : "border-red-200 bg-red-50 text-red-600"
                  }`}>
                    <span className="material-symbols-outlined text-red-500 select-none">error</span>
                    <span>{passwordUpdateError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400">Current Password</label>
                  <input
                    type="password"
                    value={changeCurrentPassword}
                    onChange={e => setChangeCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400">New Password</label>
                  <input
                    type="password"
                    value={changeNewPassword}
                    onChange={e => setChangeNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-400">Confirm New Password</label>
                  <input
                    type="password"
                    value={changeConfirmNewPassword}
                    onChange={e => setChangeConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className={`w-full rounded-lg border px-3.5 py-2 text-xs transition-all ${isDarkMode ? "border-zinc-800 bg-[#121214] text-zinc-100 focus:ring-2 focus:ring-[#7c5cff]/30 focus:border-[#7c5cff]" : "border-zinc-250 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-[#7c5cff]/20 focus:border-[#7c5cff]"}`}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className={`flex items-center justify-end gap-2.5 p-4 border-t ${isDarkMode ? "border-zinc-800" : "border-zinc-200"}`}>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className={`rounded-lg border px-4 py-2 text-xs font-bold transition-all ${
                    isDarkMode
                      ? "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                      : "border-zinc-300 text-zinc-500 hover:bg-zinc-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-40"
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear All Timetable Confirmation Modal */}
      {isClearAllModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsClearAllModalOpen(false)}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-sm overflow-hidden rounded-2xl border shadow-2xl flex flex-col ${
              isDarkMode
                ? "bg-[#14121b] border-zinc-800 shadow-red-500/5 text-zinc-100"
                : "bg-white border-zinc-200 shadow-red-500/10 text-zinc-900"
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-5 border-b ${isDarkMode ? "border-zinc-800" : "border-zinc-200"}`}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-650 to-orange-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">warning</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold">Clear Timetable?</h2>
                  <p className={`text-[10px] ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsClearAllModalOpen(false)}
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
                  isDarkMode ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-zinc-100 text-zinc-500"
                }`}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to clear your entire weekly lecture timetable? This will permanently delete all your schedule blocks from the database.
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-end gap-2.5 p-4 border-t ${isDarkMode ? "border-zinc-800" : "border-zinc-200"}`}>
              <button
                type="button"
                onClick={() => setIsClearAllModalOpen(false)}
                className={`rounded-lg border px-4 py-2 text-xs font-bold transition-all ${
                  isDarkMode
                    ? "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    : "border-zinc-300 text-zinc-500 hover:bg-zinc-100"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllTimetable}
                disabled={isClearingTimetable}
                className="rounded-lg bg-red-600 hover:bg-red-700 px-5 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-40"
              >
                {isClearingTimetable ? "Clearing..." : "Clear Timetable"}
              </button>
            </div>
          </div>
        </div>
      )}

      </main>
    </div>
  </div>
</div>

  );
}
