"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Sparkles, X, User, Clock } from "lucide-react";
import { db, supabase, StudentUser, TimetableEntry, AttendanceEntry, CGPASubject, MarksPrediction, CalendarEvent, FeedbackSubmission, HackathonEvent, InternshipListing, LibraryItem } from "@/lib/db";


export type AuthUserProfile = {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    fullName?: string;
    college?: string;
    course?: string;
    year?: string;
    name?: string;
    preferred_username?: string;
  } | null;
};


interface AcadsphereContextType {
  // Hydration & mount
  mounted: boolean;
  
  // Auth states
  currentUser: StudentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<StudentUser | null>>;
  isLoginView: boolean;
  setIsLoginView: React.Dispatch<React.SetStateAction<boolean>>;
  isVerificationPending: boolean;
  setIsVerificationPending: React.Dispatch<React.SetStateAction<boolean>>;
  isBannedView: boolean;
  setIsBannedView: React.Dispatch<React.SetStateAction<boolean>>;
  isForgotPasswordView: boolean;
  setIsForgotPasswordView: React.Dispatch<React.SetStateAction<boolean>>;
  isResetSuccess: boolean;
  setIsResetSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  
  fullName: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
  college: string;
  setCollege: React.Dispatch<React.SetStateAction<string>>;
  year: string;
  setYear: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  authError: string;
  setAuthError: React.Dispatch<React.SetStateAction<string>>;
  
  editFullName: string;
  setEditFullName: React.Dispatch<React.SetStateAction<string>>;
  editCollege: string;
  setEditCollege: React.Dispatch<React.SetStateAction<string>>;
  editCourse: string;
  setEditCourse: React.Dispatch<React.SetStateAction<string>>;
  editYear: string;
  setEditYear: React.Dispatch<React.SetStateAction<string>>;
  isSavingProfile: boolean;
  setIsSavingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  
  authProvider: string | null;
  setAuthProvider: React.Dispatch<React.SetStateAction<string | null>>;
  isChangePasswordOpen: boolean;
  setIsChangePasswordOpen: React.Dispatch<React.SetStateAction<boolean>>;
  changeCurrentPassword: string;
  setChangeCurrentPassword: React.Dispatch<React.SetStateAction<string>>;
  changeNewPassword: string;
  setChangeNewPassword: React.Dispatch<React.SetStateAction<string>>;
  changeConfirmNewPassword: string;
  setChangeConfirmNewPassword: React.Dispatch<React.SetStateAction<string>>;
  isUpdatingPassword: boolean;
  setIsUpdatingPassword: React.Dispatch<React.SetStateAction<boolean>>;
  passwordUpdateError: string | null;
  setPasswordUpdateError: React.Dispatch<React.SetStateAction<string | null>>;
  
  // Theme & sidebar
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  toggleTheme: () => void;
  
  // Timetable
  timetable: TimetableEntry[];
  setTimetable: React.Dispatch<React.SetStateAction<TimetableEntry[]>>;
  ttSubject: string;
  setTtSubject: React.Dispatch<React.SetStateAction<string>>;
  ttFaculty: string;
  setTtFaculty: React.Dispatch<React.SetStateAction<string>>;
  ttRoom: string;
  setTtRoom: React.Dispatch<React.SetStateAction<string>>;
  ttDay: string;
  setTtDay: React.Dispatch<React.SetStateAction<string>>;
  ttStart: string;
  setTtStart: React.Dispatch<React.SetStateAction<string>>;
  ttEnd: string;
  setTtEnd: React.Dispatch<React.SetStateAction<string>>;
  ttEditingId: string | null;
  setTtEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  ttEditingColor: string;
  setTtEditingColor: React.Dispatch<React.SetStateAction<string>>;
  isClearAllModalOpen: boolean;
  setIsClearAllModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isClearingTimetable: boolean;
  setIsClearingTimetable: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Attendance
  attendance: AttendanceEntry[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceEntry[]>>;
  minAttendanceThreshold: 66 | 75;
  setMinAttendanceThreshold: React.Dispatch<React.SetStateAction<66 | 75>>;
  attEditingId: string | null;
  setAttEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  attSubject: string;
  setAttSubject: React.Dispatch<React.SetStateAction<string>>;
  attAttended: string;
  setAttAttended: React.Dispatch<React.SetStateAction<string>>;
  attTotal: string;
  setAttTotal: React.Dispatch<React.SetStateAction<string>>;
  
  // CGPA
  cgpaSubjects: CGPASubject[];
  setCgpaSubjects: React.Dispatch<React.SetStateAction<CGPASubject[]>>;
  cgEditingId: string | null;
  setCgEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSemester: number;
  setSelectedSemester: React.Dispatch<React.SetStateAction<number>>;
  cgSubjectName: string;
  setCgSubjectName: React.Dispatch<React.SetStateAction<string>>;
  cgCredits: string;
  setCgCredits: React.Dispatch<React.SetStateAction<string>>;
  cgGrade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F';
  setCgGrade: React.Dispatch<React.SetStateAction<'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F'>>;
  
  // Predictions
  predictions: MarksPrediction[];
  setPredictions: React.Dispatch<React.SetStateAction<MarksPrediction[]>>;
  predEditingId: string | null;
  setPredEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  predSubject: string;
  setPredSubject: React.Dispatch<React.SetStateAction<string>>;
  predInternalScore: string;
  setPredInternalScore: React.Dispatch<React.SetStateAction<string>>;
  predInternalTotal: string;
  setPredInternalTotal: React.Dispatch<React.SetStateAction<string>>;
  predExternalTotal: string;
  setPredExternalTotal: React.Dispatch<React.SetStateAction<string>>;
  predTargetGrade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C';
  setPredTargetGrade: React.Dispatch<React.SetStateAction<'O' | 'A+' | 'A' | 'B+' | 'B' | 'C'>>;
  
  // Calendar
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  calEditingId: string | null;
  setCalEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  calTitle: string;
  setCalTitle: React.Dispatch<React.SetStateAction<string>>;
  calDate: string;
  setCalDate: React.Dispatch<React.SetStateAction<string>>;
  calType: 'exam' | 'deadline' | 'reminder' | 'holiday';
  setCalType: React.Dispatch<React.SetStateAction<'exam' | 'deadline' | 'reminder' | 'holiday'>>;
  currentCalendarMonth: Date;
  setCurrentCalendarMonth: React.Dispatch<React.SetStateAction<Date>>;
  
  // Feedback
  feedbackHistory: FeedbackSubmission[];
  setFeedbackHistory: React.Dispatch<React.SetStateAction<FeedbackSubmission[]>>;
  feedbackMessage: string;
  setFeedbackMessage: React.Dispatch<React.SetStateAction<string>>;
  feedbackRating: number;
  setFeedbackRating: React.Dispatch<React.SetStateAction<number>>;
  feedbackSubmitted: boolean;
  setFeedbackSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Career feeds
  appliedInternships: string[];
  setAppliedInternships: React.Dispatch<React.SetStateAction<string[]>>;
  appliedEvents: string[];
  setAppliedEvents: React.Dispatch<React.SetStateAction<string[]>>;
  
  librarySearch: string;
  setLibrarySearch: React.Dispatch<React.SetStateAction<string>>;
  libraryCategoryFilter: string;
  setLibraryCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  
  radarFieldFilter: string;
  setRadarFieldFilter: React.Dispatch<React.SetStateAction<string>>;
  radarTypeFilter: string;
  setRadarTypeFilter: React.Dispatch<React.SetStateAction<string>>;
  
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  
  toastMessage: string | null;
  setToastMessage: React.Dispatch<React.SetStateAction<string | null>>;
  
  eventsFeed: HackathonEvent[];
  setEventsFeed: React.Dispatch<React.SetStateAction<HackathonEvent[]>>;
  internshipsFeed: InternshipListing[];
  setInternshipsFeed: React.Dispatch<React.SetStateAction<InternshipListing[]>>;
  libraryFeed: LibraryItem[];
  setLibraryFeed: React.Dispatch<React.SetStateAction<LibraryItem[]>>;
  
  // Actions & Mutations
  triggerToast: (msg: string) => void;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  handleLogIn: (e: React.FormEvent) => Promise<void>;
  handleForgotPassword: (e: React.FormEvent) => Promise<void>;
  handleResendVerification: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  handleOnboardingComplete: (college: string, course: string, year: string) => Promise<boolean>;
  handleOnboardingSkip: () => Promise<boolean>;
  handleSaveProfile: (e: React.FormEvent) => Promise<void>;
  handlePasswordChange: (e: React.FormEvent) => Promise<void>;
  
  // Timetable Handlers
  handleAddTimetable: (e: React.FormEvent) => void;
  handleEditTimetable: (entry: TimetableEntry) => void;
  handleDeleteTimetable: (id: string) => void;
  handleClearAllTimetable: () => Promise<void>;
  handleImportExtracted: (entries: { subject: string; faculty: string; room: string; day: string; startTime: string; endTime: string }[]) => void;
  cancelTimetableEdit: () => void;
  
  // Attendance Handlers
  handleAddAttendance: (e: React.FormEvent) => void;
  handleEditAttendance: (entry: AttendanceEntry) => void;
  handleIncrementAttendance: (id: string, isAttended: boolean) => void;
  handleDeleteAttendance: (id: string) => void;
  cancelAttendanceEdit: () => void;
  
  // CGPA Handlers
  handleAddCGPASubject: (e: React.FormEvent) => void;
  handleEditCGPASubject: (subject: CGPASubject) => void;
  handleDeleteCGPASubject: (id: string) => void;
  cancelCGPAEdit: () => void;
  
  // Prediction Handlers
  handleAddPrediction: (e: React.FormEvent) => void;
  handleEditPrediction: (prediction: MarksPrediction) => void;
  handleDeletePrediction: (id: string) => void;
  cancelPredictionEdit: () => void;
  
  // Calendar Handlers
  handleAddCalendarEvent: (e: React.FormEvent) => void;
  handleEditCalendarEvent: (event: CalendarEvent) => void;
  handleDeleteCalendarEvent: (id: string) => void;
  cancelCalendarEdit: () => void;
  
  // Feedback
  handleSubmitFeedback: (e: React.FormEvent) => void;
  
  // Career feeds
  applyForInternship: (id: string, company: string, role: string, applyLink?: string) => void;
  applyForEvent: (id: string, title: string, applyLink?: string) => void;
  
  // Computed values
  todaysClasses: TimetableEntry[];
  healthData: { score: number; status: 'Safe' | 'Warning' | 'Critical'; insights: { text: string; type: 'safe' | 'warning' | 'critical' }[] };
  currentDayName: string;
  overallCGPA: number;
  cumulativeAttendancePercent: number;
  nextClass: TimetableEntry | null | undefined;
  getSGPA: (sem: number) => number;
  getPerformanceSummary: (cg: number) => string;
  overallCredits: number;
  activeSemesters: number[];
  attendedClasses: number;
  totalClasses: number;
  timeToMinutes: (time: string) => number;
  getExternalRequirement: (prediction: MarksPrediction) => { targetBoundary: number; internalContrib: number; neededExternalContrib: number; rawExternalNeeded: number; alreadySecured: boolean; feasible: boolean };
  
  // Filtered lists
  filteredLibrary: LibraryItem[];
  filteredEvents: HackathonEvent[];
  filteredInternships: InternshipListing[];
  
  // Calendar Helpers
  getDaysInMonth: (date: Date) => Date[];
  calendarDays: Date[];
  startDayOffset: number;
  
  // Additional Exposes
  gradePoints: Record<string, number>;
  gradeThresholds: Record<string, number>;
  currentClass: TimetableEntry | undefined;
}

const AcadsphereContext = createContext<AcadsphereContextType | undefined>(undefined);

export function AcadsphereProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Tab mapping configs
  const tabToRouteMap: Record<string, string> = {
    "Dashboard": "/dashboard",
    "Timetable / Schedule": "/timetable",
    "Attendance": "/attendance",
    "CGPA Calculator": "/cgpa",
    "Marks Predictor": "/marks-predictor",
    "Calendar": "/calendar",
    "Events / Network": "/events",
    "Internship": "/internship",
    "E-Library": "/e-library",
    "Feedback": "/feedback",
    "Settings": "/settings",
    "Support": "/support"
  };

  const routeToTabMap: Record<string, string> = Object.fromEntries(
    Object.entries(tabToRouteMap).map(([k, v]) => [v, k])
  );

  const activeTab = routeToTabMap[pathname] || "Dashboard";
  const setActiveTab = (tabName: string) => {
    const route = tabToRouteMap[tabName];
    if (route) {
      router.push(route);
    }
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
  const [editCourse, setEditCourse] = useState("");
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
//   const [activeTab, setActiveTab] = useState<string>("Dashboard");
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
  const [minAttendanceThreshold, setMinAttendanceThreshold] = useState<66 | 75>(75);
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
      course:
        sanitizeProfileField(metadata.course) ||
        (profile?.course ? sanitizeProfileField(String(profile.course)) : ""),
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
    // console.log("authUser:", authUser);

    try {
      // Fetch user profile from database using safe array query to check for duplicates
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id);

      // console.log("profileData:", profileData);
      // console.log("profileError:", profileError);

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
        // console.log("Profile does not exist. Automatically creating one for ID:", authUser.id);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      // console.log("Supabase Auth State Change Event:", event);
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditFullName(currentUser.fullName || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditCollege(currentUser.college || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditCourse(currentUser.course || "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditYear(currentUser.year || "I Year");
    }
  }, [currentUser]);

  // Fetch student specific records whenever user logs in or switches tabs
  useEffect(() => {
    if (!currentUser || !currentUser.onboardingCompleted) return;
    const userId = currentUser.id;

    // Set immediate cached local layout first for instant UI response
    queueMicrotask(() => {
      setTimetable(db.getTimetable(userId));
      setAttendance(db.getAttendance(userId));
      setCgpaSubjects(db.getCGPASubjects(userId));
      setPredictions(db.getMarksPredictions(userId));
      setCalendarEvents(db.getCalendarEvents(userId));
      setFeedbackHistory(db.getFeedbackHistory(userId));
    });

    // Async trigger live Supabase sync in the background
    db.syncUserData(userId).then(() => {
      queueMicrotask(() => {
        setTimetable(db.getTimetable(userId));
        setAttendance(db.getAttendance(userId));
        setCgpaSubjects(db.getCGPASubjects(userId));
        setPredictions(db.getMarksPredictions(userId));
        setCalendarEvents(db.getCalendarEvents(userId));
        setFeedbackHistory(db.getFeedbackHistory(userId));
      });
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
      // console.log("=== STARTING SUPABASE AUTH SIGNUP FLOW ===");
      // console.log("Signup Payload:", { fullName, college, year, email: email.toLowerCase() });

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
      });

      // console.log("Supabase signUp Response (data):", data);
      // console.log("Supabase signUp Error (error):", error);

      if (error) {
        console.warn("Supabase Auth signUp failed:", error.message);
        setAuthError(error.message);
        return;
      }

      if (data.user) {
        // console.log("Auth user created in Supabase. ID:", data.user.id);

        // Insert profile details into public.users table in Supabase
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          full_name: fullName,
          college: college,
          year: year,
          email: email.toLowerCase()
        });

        // console.log("public.users Insert Response (error):", insertError);

        if (insertError) {
          console.warn("Failed to insert user profile into public.users:", insertError.message);
          setAuthError(`Profile creation failed: ${insertError.message}`);
          return;
        }

        // console.log("Successfully created user profile in public.users");

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
      // console.log("Starting Google OAuth login");
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

      // console.log("Starting Supabase login for:", email);
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

  const handleOnboardingComplete = async (college: string, course: string, year: string): Promise<boolean> => {
    if (!currentUser) return false;
    const success = await db.completeOnboarding(currentUser.id, college, course, year);
    if (success) {
      const updatedUser: StudentUser = {
        ...currentUser,
        college,
        course,
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
        .from('users').update({
          full_name: editFullName,
          college: editCollege,
          course: editCourse,
          year: editYear,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (error) {
        throw error;
      }

      const updatedUser: StudentUser = {
        ...currentUser,
        fullName: editFullName,
        college: editCollege,
        course: editCourse,
        year: editYear
      };

      setCurrentUser(updatedUser);
      localStorage.setItem("acadsphere_session", JSON.stringify(updatedUser));
      triggerToast("Profile settings updated successfully!");
    } catch (err: unknown) {
      triggerToast((err as Error)?.message || "Failed to update profile settings.");
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
        email: currentUser?.email || '',
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : (err as { message?: string })?.message || "Failed to update password.";
      setPasswordUpdateError(errorMessage);
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
  const cumulativeAttendancePercent = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

  // Skip margin calculation: Total classes skip margin (overall)
  const reqRatio = minAttendanceThreshold / 100;
  const isCumulativeSafe = cumulativeAttendancePercent >= minAttendanceThreshold;
  const skipMargin = totalClasses > 0
    ? Math.max(0, Math.floor((attendedClasses - reqRatio * totalClasses) / reqRatio))
    : 0;
  const recoveryNeeded = totalClasses > 0 && !isCumulativeSafe
    ? Math.ceil((reqRatio * totalClasses - attendedClasses) / (1 - reqRatio))
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

    const lowAttSubs = attendance.filter(a => a.total > 0 && (a.attended / a.total) < (minAttendanceThreshold / 100));
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
      userId: currentUser?.id || '',
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
    } catch (err: unknown) {
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
        userId: currentUser?.id || '',
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
      userId: currentUser?.id || '',
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
      userId: currentUser?.id || '',
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
      userId: currentUser?.id || '',
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
      userId: currentUser?.id || '',
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
      userId: currentUser?.id || '',
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


  // Hydration Guard Render
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

  return (
    <AcadsphereContext.Provider value={{
      mounted,
      currentUser, setCurrentUser,
      isLoginView, setIsLoginView,
      isVerificationPending, setIsVerificationPending,
      isBannedView, setIsBannedView,
      isForgotPasswordView, setIsForgotPasswordView,
      isResetSuccess, setIsResetSuccess,
      fullName, setFullName,
      college, setCollege,
      year, setYear,
      email, setEmail,
      password, setPassword,
      confirmPassword, setConfirmPassword,
      authError, setAuthError,
      editFullName, setEditFullName,
      editCollege, setEditCollege,
      editCourse, setEditCourse,
      editYear, setEditYear,
      isSavingProfile, setIsSavingProfile,
      authProvider, setAuthProvider,
      isChangePasswordOpen, setIsChangePasswordOpen,
      changeCurrentPassword, setChangeCurrentPassword,
      changeNewPassword, setChangeNewPassword,
      changeConfirmNewPassword, setChangeConfirmNewPassword,
      isUpdatingPassword, setIsUpdatingPassword,
      passwordUpdateError, setPasswordUpdateError,
      isDarkMode, setIsDarkMode,
      isSidebarOpen, setIsSidebarOpen,
      isSidebarCollapsed, setIsSidebarCollapsed,
      activeTab, setActiveTab,
      toggleTheme,
      timetable, setTimetable,
      ttSubject, setTtSubject,
      ttFaculty, setTtFaculty,
      ttRoom, setTtRoom,
      ttDay, setTtDay,
      ttStart, setTtStart,
      ttEnd, setTtEnd,
      ttEditingId, setTtEditingId,
      ttEditingColor, setTtEditingColor,
      isClearAllModalOpen, setIsClearAllModalOpen,
      isClearingTimetable, setIsClearingTimetable,
      attendance, setAttendance,
      minAttendanceThreshold, setMinAttendanceThreshold,
      attEditingId, setAttEditingId,
      attSubject, setAttSubject,
      attAttended, setAttAttended,
      attTotal, setAttTotal,
      cgpaSubjects, setCgpaSubjects,
      cgEditingId, setCgEditingId,
      selectedSemester, setSelectedSemester,
      cgSubjectName, setCgSubjectName,
      cgCredits, setCgCredits,
      cgGrade, setCgGrade,
      predictions, setPredictions,
      predEditingId, setPredEditingId,
      predSubject, setPredSubject,
      predInternalScore, setPredInternalScore,
      predInternalTotal, setPredInternalTotal,
      predExternalTotal, setPredExternalTotal,
      predTargetGrade, setPredTargetGrade,
      calendarEvents, setCalendarEvents,
      calEditingId, setCalEditingId,
      calTitle, setCalTitle,
      calDate, setCalDate,
      calType, setCalType,
      currentCalendarMonth, setCurrentCalendarMonth,
      feedbackHistory, setFeedbackHistory,
      feedbackMessage, setFeedbackMessage,
      feedbackRating, setFeedbackRating,
      feedbackSubmitted, setFeedbackSubmitted,
      appliedInternships, setAppliedInternships,
      appliedEvents, setAppliedEvents,
      librarySearch, setLibrarySearch,
      libraryCategoryFilter, setLibraryCategoryFilter,
      radarFieldFilter, setRadarFieldFilter,
      radarTypeFilter, setRadarTypeFilter,
      isUploadModalOpen, setIsUploadModalOpen,
      toastMessage, setToastMessage,
      eventsFeed, setEventsFeed,
      internshipsFeed, setInternshipsFeed,
      libraryFeed, setLibraryFeed,
      triggerToast,
      handleSignUp,
      handleGoogleLogin,
      handleLogIn,
      handleForgotPassword,
      handleResendVerification,
      handleSignOut,
      handleOnboardingComplete,
      handleOnboardingSkip,
      handleSaveProfile,
      handlePasswordChange,
      handleAddTimetable,
      handleEditTimetable,
      handleDeleteTimetable,
      handleClearAllTimetable,
      handleImportExtracted,
      cancelTimetableEdit,
      handleAddAttendance,
      handleEditAttendance,
      handleIncrementAttendance,
      handleDeleteAttendance,
      cancelAttendanceEdit,
      handleAddCGPASubject,
      handleEditCGPASubject,
      handleDeleteCGPASubject,
      cancelCGPAEdit,
      handleAddPrediction,
      handleEditPrediction,
      handleDeletePrediction,
      cancelPredictionEdit,
      handleAddCalendarEvent,
      handleEditCalendarEvent,
      handleDeleteCalendarEvent,
      cancelCalendarEdit,
      handleSubmitFeedback,
      applyForInternship: applyForInternship,
      applyForEvent: applyForEvent,
      todaysClasses,
      healthData,
      currentDayName,
      overallCGPA,
      cumulativeAttendancePercent,
      nextClass,
      getSGPA,
      getPerformanceSummary,
      overallCredits,
      activeSemesters,
      attendedClasses,
      totalClasses,
      timeToMinutes,
      getExternalRequirement,
      filteredLibrary,
      filteredEvents,
      filteredInternships,
      getDaysInMonth,
      calendarDays,
      startDayOffset,
      gradePoints,
      gradeThresholds,
      currentClass
    }}>
      {children}
    </AcadsphereContext.Provider>
  );
}

export function useAcadsphere() {
  const context = useContext(AcadsphereContext);
  if (context === undefined) {
    throw new Error("useAcadsphere must be used within an AcadsphereProvider");
  }
  return context;
}
