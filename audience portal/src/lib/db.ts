import { createClient } from '@supabase/supabase-js';

// Initialize live Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface StudentUser {
  id: string;
  fullName: string;
  college: string;
  year: string;
  email: string;
  onboardingCompleted: boolean;
}

export interface TimetableEntry {
  id: string;
  userId: string;
  subject: string;
  faculty: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  color: string;
}

export interface AttendanceEntry {
  id: string;
  userId: string;
  subject: string;
  attended: number;
  total: number;
}

export interface CGPASubject {
  id: string;
  userId: string;
  semester: number;
  subjectName: string;
  credits: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F';
}

export interface MarksPrediction {
  id: string;
  userId: string;
  subject: string;
  internalScore: number;
  internalTotal: number;
  externalTotal: number;
  targetGrade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C';
}

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'exam' | 'deadline' | 'reminder' | 'holiday';
}

export interface FeedbackSubmission {
  id: string;
  userId: string;
  message: string;
  rating: number; // 1-5
  date: string;
}

export interface HackathonEvent {
  id: string;
  title: string;
  organizer: string;
  date: string;
  type: 'hackathon' | 'ideathon' | 'workshop' | 'competition';
  description: string;
  image: string;
  applyLink?: string;
}

export interface InternshipListing {
  id: string;
  company: string;
  role: string;
  stipend: string;
  eligibility: string;
  duration: string;
  logo: string;
  applyLink?: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  type: 'Notes' | 'PDF' | 'PYQ' | 'Book';
  subject: string;
  semester: string;
  size: string;
  downloadUrl: string;
}

// Helper database persistence functions
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {}
};

// ----------------------------------------------------
// HYBRID DATABASE CONTROLLER WITH SUPABASE BACKEND
// ----------------------------------------------------
export const db = {
  // Sync all user profile data from Supabase
  syncUserData: async (userId: string): Promise<void> => {
    try {
      const [
        { data: tt },
        { data: att },
        { data: cg },
        { data: pred },
        { data: cal },
        { data: hol }
      ] = await Promise.all([
        supabase.from('timetable').select('*').eq('user_id', userId),
        supabase.from('attendance').select('*').eq('user_id', userId),
        supabase.from('cgpa').select('*').eq('user_id', userId),
        supabase.from('predictor').select('*').eq('user_id', userId),
        supabase.from('calendar').select('*').eq('user_id', userId),
        supabase.from('holidays').select('*')
      ]);

      // 1. Timetable
      if (tt) setStorageItem('acadsphere_timetable', tt.map(item => ({
        id: item.id,
        userId: item.user_id,
        subject: item.subject,
        faculty: item.faculty,
        room: item.room,
        day: item.day,
        startTime: item.start_time,
        endTime: item.end_time,
        color: item.color
      })));

      // 2. Attendance
      if (att) setStorageItem('acadsphere_attendance', att.map(item => ({
        id: item.id,
        userId: item.user_id,
        subject: item.subject,
        attended: item.attended,
        total: item.total
      })));

      // 3. CGPA
      if (cg) setStorageItem('acadsphere_cgpa', cg.map(item => ({
        id: item.id,
        userId: item.user_id,
        semester: item.semester,
        subjectName: item.subject_name,
        credits: item.credits,
        grade: item.grade
      })));

      // 4. Marks Predictor
      if (pred) setStorageItem('acadsphere_predictions', pred.map(item => ({
        id: item.id,
        userId: item.user_id,
        subject: item.subject,
        internalScore: Number(item.internal_score),
        internalTotal: Number(item.internal_total),
        externalTotal: Number(item.external_total),
        targetGrade: item.target_grade
      })));

      // 5. Custom Events
      if (cal) setStorageItem('acadsphere_calendar', cal.map(item => ({
        id: item.id,
        userId: item.user_id,
        title: item.title,
        date: item.date,
        type: item.type
      })));

      // 6. Global Holidays & Calendar Sync (Real-Time Admin Sync)
      if (hol) setStorageItem('acadsphere_holidays', hol.map(item => ({
        id: item.id,
        userId: 'admin',
        title: item.title,
        date: item.date,
        type: item.type
      })));

    } catch (e) {
      console.warn('Supabase profile synchronizer failed. Falling back to local cache.');
    }
  },

  // --- Timetable API ---
  getTimetable: (userId: string): TimetableEntry[] => {
    return getStorageItem<TimetableEntry[]>('acadsphere_timetable', []).filter(e => e.userId === userId);
  },
  
  saveTimetableEntry: (entry: Omit<TimetableEntry, 'id'> & { id?: string }): TimetableEntry => {
    const entries = getStorageItem<TimetableEntry[]>('acadsphere_timetable', []);
    const newEntry: TimetableEntry = {
      ...entry,
      id: entry.id || 'tt-' + Math.random().toString(36).substr(2, 9)
    };
    
    const index = entries.findIndex(e => e.id === newEntry.id);
    if (index >= 0) {
      entries[index] = newEntry;
    } else {
      entries.push(newEntry);
    }
    
    setStorageItem('acadsphere_timetable', entries);

    // Sync in background to Supabase
    supabase.from('timetable').upsert({
      id: newEntry.id.startsWith('tt-') ? undefined : newEntry.id, // let Postgres generate UUID if mock ID
      user_id: newEntry.userId,
      subject: newEntry.subject,
      faculty: newEntry.faculty,
      room: newEntry.room,
      day: newEntry.day,
      start_time: newEntry.startTime,
      end_time: newEntry.endTime,
      color: newEntry.color
    }).then();

    return newEntry;
  },

  deleteTimetableEntry: (id: string): void => {
    const entries = getStorageItem<TimetableEntry[]>('acadsphere_timetable', []);
    setStorageItem('acadsphere_timetable', entries.filter(e => e.id !== id));

    // Sync deletion in background
    supabase.from('timetable').delete().eq('id', id).then();
  },

  // --- Attendance API ---
  getAttendance: (userId: string): AttendanceEntry[] => {
    const entries = getStorageItem<AttendanceEntry[]>('acadsphere_attendance', []);
    return entries.filter(e => e.userId === userId);
  },

  saveAttendance: (entry: Omit<AttendanceEntry, 'id'> & { id?: string }): AttendanceEntry => {
    const entries = getStorageItem<AttendanceEntry[]>('acadsphere_attendance', []);
    const newEntry: AttendanceEntry = {
      ...entry,
      id: entry.id || 'att-' + Math.random().toString(36).substr(2, 9)
    };

    const index = entries.findIndex(e => e.id === newEntry.id);
    if (index >= 0) {
      entries[index] = newEntry;
    } else {
      entries.push(newEntry);
    }

    setStorageItem('acadsphere_attendance', entries);

    // Sync in background
    supabase.from('attendance').upsert({
      id: newEntry.id.startsWith('att-') ? undefined : newEntry.id,
      user_id: newEntry.userId,
      subject: newEntry.subject,
      attended: newEntry.attended,
      total: newEntry.total
    }).then();

    return newEntry;
  },

  deleteAttendance: (id: string): void => {
    const entries = getStorageItem<AttendanceEntry[]>('acadsphere_attendance', []);
    setStorageItem('acadsphere_attendance', entries.filter(e => e.id !== id));

    supabase.from('attendance').delete().eq('id', id).then();
  },

  // --- CGPA API ---
  getCGPASubjects: (userId: string): CGPASubject[] => {
    const subjects = getStorageItem<CGPASubject[]>('acadsphere_cgpa', []);
    return subjects.filter(s => s.userId === userId);
  },

  saveCGPASubject: (subject: Omit<CGPASubject, 'id'> & { id?: string }): CGPASubject => {
    const subjects = getStorageItem<CGPASubject[]>('acadsphere_cgpa', []);
    const newSubject: CGPASubject = {
      ...subject,
      id: subject.id || 'cg-' + Math.random().toString(36).substr(2, 9)
    };

    const index = subjects.findIndex(s => s.id === newSubject.id);
    if (index >= 0) {
      subjects[index] = newSubject;
    } else {
      subjects.push(newSubject);
    }

    setStorageItem('acadsphere_cgpa', subjects);

    supabase.from('cgpa').upsert({
      id: newSubject.id.startsWith('cg-') ? undefined : newSubject.id,
      user_id: newSubject.userId,
      semester: newSubject.semester,
      subject_name: newSubject.subjectName,
      credits: newSubject.credits,
      grade: newSubject.grade
    }).then();

    return newSubject;
  },

  deleteCGPASubject: (id: string): void => {
    const subjects = getStorageItem<CGPASubject[]>('acadsphere_cgpa', []);
    setStorageItem('acadsphere_cgpa', subjects.filter(s => s.id !== id));

    supabase.from('cgpa').delete().eq('id', id).then();
  },

  // --- Marks Predictor API ---
  getMarksPredictions: (userId: string): MarksPrediction[] => {
    const predictions = getStorageItem<MarksPrediction[]>('acadsphere_predictions', []);
    return predictions.filter(p => p.userId === userId);
  },

  saveMarksPrediction: (prediction: Omit<MarksPrediction, 'id'> & { id?: string }): MarksPrediction => {
    const predictions = getStorageItem<MarksPrediction[]>('acadsphere_predictions', []);
    const newPred: MarksPrediction = {
      ...prediction,
      id: prediction.id || 'pred-' + Math.random().toString(36).substr(2, 9)
    };

    const index = predictions.findIndex(p => p.id === newPred.id);
    if (index >= 0) {
      predictions[index] = newPred;
    } else {
      predictions.push(newPred);
    }

    setStorageItem('acadsphere_predictions', predictions);

    supabase.from('predictor').upsert({
      id: newPred.id.startsWith('pred-') ? undefined : newPred.id,
      user_id: newPred.userId,
      subject: newPred.subject,
      internal_score: newPred.internalScore,
      internal_total: newPred.internalTotal,
      external_total: newPred.externalTotal,
      target_grade: newPred.targetGrade
    }).then();

    return newPred;
  },

  deleteMarksPrediction: (id: string): void => {
    const predictions = getStorageItem<MarksPrediction[]>('acadsphere_predictions', []);
    setStorageItem('acadsphere_predictions', predictions.filter(p => p.id !== id));

    supabase.from('predictor').delete().eq('id', id).then();
  },

  // --- Calendar Events API ---
  getCalendarEvents: (userId: string): CalendarEvent[] => {
    const events = getStorageItem<CalendarEvent[]>('acadsphere_calendar', []);
    const holidays = getStorageItem<CalendarEvent[]>('acadsphere_holidays', []);
    const filtered = events.filter(e => e.userId === userId);
    return [...filtered, ...holidays];
  },

  saveCalendarEvent: (event: Omit<CalendarEvent, 'id'> & { id?: string }): CalendarEvent => {
    const events = getStorageItem<CalendarEvent[]>('acadsphere_calendar', []);
    const newEvent: CalendarEvent = {
      ...event,
      id: event.id || 'cal-' + Math.random().toString(36).substr(2, 9)
    };

    const index = events.findIndex(e => e.id === newEvent.id);
    if (index >= 0) {
      events[index] = newEvent;
    } else {
      events.push(newEvent);
    }

    setStorageItem('acadsphere_calendar', events);

    supabase.from('calendar').upsert({
      id: newEvent.id.startsWith('cal-') ? undefined : newEvent.id,
      user_id: newEvent.userId,
      title: newEvent.title,
      date: newEvent.date,
      type: newEvent.type
    }).then();

    return newEvent;
  },

  deleteCalendarEvent: (id: string): void => {
    const events = getStorageItem<CalendarEvent[]>('acadsphere_calendar', []);
    setStorageItem('acadsphere_calendar', events.filter(e => e.id !== id));

    supabase.from('calendar').delete().eq('id', id).then();
  },

  // --- Feedback API ---
  saveFeedback: (feedback: Omit<FeedbackSubmission, 'id' | 'date'>): FeedbackSubmission => {
    const submissions = getStorageItem<FeedbackSubmission[]>('acadsphere_feedback', []);
    const newSub: FeedbackSubmission = {
      ...feedback,
      id: 'fb-' + Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    submissions.push(newSub);
    setStorageItem('acadsphere_feedback', submissions);

    supabase.from('feedback').insert({
      user_id: newSub.userId,
      message: newSub.message,
      rating: newSub.rating
    }).then();

    return newSub;
  },

  getFeedbackHistory: (userId: string): FeedbackSubmission[] => {
    return getStorageItem<FeedbackSubmission[]>('acadsphere_feedback', []).filter(s => s.userId === userId);
  },

  // ----------------------------------------------------
  // ECOSYSTEM LIVE SYNC GETTERS (FETCH FROM SUPABASE)
  // ----------------------------------------------------
  getEvents: async (): Promise<HackathonEvent[]> => {
    const { data, error } = await supabase.from('events').select('*');
    if (error || !data) return [];
    return data.map(item => ({
      id: item.id,
      title: item.title,
      organizer: item.organizer || "",
      date: item.date || "",
      type: item.category === 'Competition/Event' ? 'competition' : 'workshop',
      description: item.description || "",
      image: item.image || "",
      applyLink: item.apply_link || ""
    }));
  },

  getInternships: async (): Promise<InternshipListing[]> => {
    const { data, error } = await supabase.from('internships').select('*');
    if (error || !data) return [];
    return data.map(item => ({
      id: item.id,
      company: item.company_name || "",
      role: item.title || "",
      stipend: item.stipend || "",
      eligibility: item.qualification || "",
      duration: item.duration || "",
      logo: item.company_name ? item.company_name[0].toUpperCase() : "",
      applyLink: item.apply_link || ""
    }));
  },

  getLibrary: async (): Promise<LibraryItem[]> => {
    const { data, error } = await supabase.from('e_library').select('*');
    if (error || !data) return [];
    return data.map(item => ({
      id: item.id,
      title: item.title,
      type: item.category === 'Notes' ? 'Notes' : item.category === 'PYQs' ? 'PYQ' : item.category === 'E-Books' ? 'Book' : 'PDF',
      subject: item.subject || "",
      semester: item.semester || "",
      size: item.size || "",
      downloadUrl: item.file_link || item.external_link || ""
    }));
  },

  isEmailBanned: async (email: string): Promise<boolean> => {
    try {
      const { data } = await supabase.from('banned_users').select('email').eq('email', email.toLowerCase()).single();
      return !!data;
    } catch (e) {
      // In case of network error, check local storage as fallback
      const list = getStorageItem<string[]>('acadsphere_banned_users', []);
      return list.includes(email.toLowerCase());
    }
  },

  completeOnboarding: async (userId: string, college: string, year: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          college,
          year,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.warn('Failed to complete onboarding:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Exception completing onboarding:', e);
      return false;
    }
  },

  skipOnboarding: async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.warn('Failed to skip onboarding:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Exception skipping onboarding:', e);
      return false;
    }
  }
};
