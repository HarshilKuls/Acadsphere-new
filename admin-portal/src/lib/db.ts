import { createClient } from '@supabase/supabase-js';

// Initialize live Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function hashPassword(password: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = (hash << 5) - hash + password.charCodeAt(i);
      hash |= 0;
    }
    return 'fb-' + Math.abs(hash).toString(16);
  }
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface AdminAccount {
  id: string;
  fullName: string;
  email: string;
  role: 'Master Admin' | 'Normal Admin';
  permissions: {
    manageContent: boolean;
    manageUsers: boolean;
  };
  passwordHash: string;
}

export interface EventEntry {
  id: string;
  title: string;
  description?: string;
  organizer?: string;
  date?: string;
  location?: string;
  applyLink?: string;
  image?: string;
  tags?: string;
  category: 'Competition/Event' | 'News/Announcement';
}

export interface InternshipEntry {
  id: string;
  title: string;
  companyName?: string;
  applyLink?: string;
  duration?: string;
  stipend?: string;
  qualification?: string;
  location?: string;
  description?: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  category: 'Notes' | 'E-Books' | 'Resource Links' | 'PYQs';
  subject?: string;
  description?: string;
  fileLink?: string;
  externalLink?: string;
}

export interface ReportedAccount {
  id: string;
  fullName: string;
  email: string;
  reason: string;
  reportedDate: string;
  status: 'Flagged' | 'Banned' | 'Resolved';
}

// Student profile showing ONLY non-confidential fields
export interface NonConfidentialUser {
  fullName: string;
  college: string;
  year: string;
  email: string;
  status: 'Active' | 'Banned';
  joinDate: string;
}

export interface HolidayEntry {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  type: 'holiday' | 'exam' | 'deadline' | 'reminder';
  color?: 'violet' | 'cyan' | 'amber' | 'rose';
}

export interface FeedbackEntry {
  id: string;
  userEmail: string;
  userFullName: string;
  message: string;
  rating: number;
  createdAt: string;
}

const mapEvent = (item: Record<string, unknown>): EventEntry => ({
  id: String(item.id), title: String(item.title ?? ""), description: item.description ? String(item.description) : undefined,
  organizer: item.organizer ? String(item.organizer) : undefined, date: item.date ? String(item.date) : undefined,
  location: item.location ? String(item.location) : undefined, applyLink: item.apply_link ? String(item.apply_link) : undefined,
  image: item.image ? String(item.image) : undefined, tags: item.tags ? String(item.tags) : undefined,
  category: item.category === "News/Announcement" ? "News/Announcement" : "Competition/Event"
});
const mapInternship = (item: Record<string, unknown>): InternshipEntry => ({
  id: String(item.id), title: String(item.title ?? ""), companyName: item.company_name ? String(item.company_name) : undefined,
  applyLink: item.apply_link ? String(item.apply_link) : undefined, duration: item.duration ? String(item.duration) : undefined,
  stipend: item.stipend ? String(item.stipend) : undefined, qualification: item.qualification ? String(item.qualification) : undefined,
  location: item.location ? String(item.location) : undefined, description: item.description ? String(item.description) : undefined
});
const mapLibrary = (item: Record<string, unknown>): LibraryResource => ({
  id: String(item.id), title: String(item.title ?? ""), category: item.category as LibraryResource["category"],
  subject: item.subject ? String(item.subject) : undefined, description: item.description ? String(item.description) : undefined,
  fileLink: item.file_link ? String(item.file_link) : undefined, externalLink: item.external_link ? String(item.external_link) : undefined
});
const mapHoliday = (item: Record<string, unknown>): HolidayEntry => ({
  id: String(item.id), title: String(item.title ?? ""), description: item.description ? String(item.description) : undefined,
  date: String(item.date ?? ""), type: item.type as HolidayEntry["type"], color: item.color as HolidayEntry["color"]
});

const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const isBootstrapAdminEmail = (email: string): boolean => {
  const normalized = email.toLowerCase();
  return normalized.endsWith('@acadsph.com') || normalized.endsWith('@acadsphere.edu');
};

const buildBootstrapAdmin = (email: string): AdminAccount => ({
  id: `bootstrap-${email.toLowerCase()}`,
  fullName: 'Master Admin',
  email,
  role: 'Master Admin',
  permissions: { manageContent: true, manageUsers: true },
  passwordHash: ''
});

export const adminDb = {
  getCurrentAdmin: async (emailHint?: string): Promise<AdminAccount | null> => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const resolvedEmail = (emailHint || sessionData.session?.user?.email || "").toLowerCase();
    if (sessionError || !resolvedEmail) return null;

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', resolvedEmail)
      .maybeSingle();
    if (!error && data) {
      return {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        role: data.role,
        permissions: { manageContent: data.manage_content, manageUsers: data.manage_users },
        passwordHash: ''
      };
    }

    const cachedAdmins = getStorageItem<AdminAccount[]>('acadsphere_admins', []);
    const cachedMatch = cachedAdmins.find((admin) => admin.email.toLowerCase() === resolvedEmail);
    if (cachedMatch) return cachedMatch;

    if (isBootstrapAdminEmail(resolvedEmail)) {
      const bootstrapAdmin = buildBootstrapAdmin(resolvedEmail);
      setStorageItem('acadsphere_admins', [bootstrapAdmin, ...cachedAdmins.filter((admin) => admin.email.toLowerCase() !== resolvedEmail)]);
      return bootstrapAdmin;
    }

    if (error) throw error;

    return null;
  },

  // --- Admin Access Toggles ---
  getAdmins: async (): Promise<AdminAccount[]> => {
    const { data, error } = await supabase.from('admins').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(item => ({
      id: item.id, fullName: item.full_name, email: item.email, role: item.role,
      permissions: { manageContent: item.manage_content, manageUsers: item.manage_users }, passwordHash: item.password_hash || ''
    }));
  },

  saveAdmin: (admin: Omit<AdminAccount, 'id'> & { id?: string }): AdminAccount => {
    const list = getStorageItem<AdminAccount[]>('acadsphere_admins', []);
    const newAdmin: AdminAccount = {
      ...admin,
      id: admin.id || crypto.randomUUID()
    };

    const idx = list.findIndex(a => a.id === newAdmin.id);
    if (idx >= 0) {
      list[idx] = newAdmin;
    } else {
      list.push(newAdmin);
    }
    setStorageItem('acadsphere_admins', list);

    // Sync in background to Supabase
    supabase.from('admins').upsert({
      id: newAdmin.id,
      full_name: newAdmin.fullName,
      email: newAdmin.email,
      role: newAdmin.role,
      manage_content: newAdmin.permissions.manageContent,
      manage_users: newAdmin.permissions.manageUsers,
      password_hash: newAdmin.passwordHash
    }).then();

    return newAdmin;
  },

  deleteAdmin: (id: string): void => {
    const list = getStorageItem<AdminAccount[]>('acadsphere_admins', []);
    setStorageItem('acadsphere_admins', list.filter(a => a.id !== id));

    supabase.from('admins').delete().eq('id', id).then();
  },

  getFeedback: async (): Promise<FeedbackEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('id, message, rating, created_at, user_id, users(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        return data.map(item => {
          const user = item.users as any;
          return {
            id: String(item.id),
            userEmail: user ? String(user.email) : "Unknown",
            userFullName: user ? String(user.full_name) : "Unknown Student",
            message: String(item.message ?? ""),
            rating: Number(item.rating ?? 5),
            createdAt: new Date(item.created_at).toLocaleString()
          };
        });
      }
    } catch (e) {
      console.warn("Could not query feedback from Supabase:", e);
    }
    return [];
  },

  // --- Events Sync CRUD ---
  getEvents: async (): Promise<EventEntry[]> => {
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapEvent);
  },

  saveEvent: async (entry: Omit<EventEntry, 'id'> & { id?: string }): Promise<EventEntry> => {
    const payload = {
      ...(entry.id ? { id: entry.id } : {}), title: entry.title, description: entry.description ?? null,
      organizer: entry.organizer ?? null, date: entry.date ?? null, location: entry.location ?? null,
      apply_link: entry.applyLink ?? null, image: entry.image ?? null, tags: entry.tags ?? null, category: entry.category
    };
    const { data, error } = await supabase.from('events').upsert(payload).select().single();
    if (error) throw error;
    return mapEvent(data);
  },

  deleteEvent: async (id: string): Promise<void> => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Internships CRUD ---
  getInternships: async (): Promise<InternshipEntry[]> => {
    const { data, error } = await supabase.from('internships').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapInternship);
  },

  saveInternship: async (entry: Omit<InternshipEntry, 'id'> & { id?: string }): Promise<InternshipEntry> => {
    const { data, error } = await supabase.from('internships').upsert({
      ...(entry.id ? { id: entry.id } : {}), title: entry.title, company_name: entry.companyName ?? null,
      apply_link: entry.applyLink ?? null, duration: entry.duration ?? null, stipend: entry.stipend ?? null,
      qualification: entry.qualification ?? null, location: entry.location ?? null, description: entry.description ?? null
    }).select().single();
    if (error) throw error;
    return mapInternship(data);
  },

  deleteInternship: async (id: string): Promise<void> => {
    const { error } = await supabase.from('internships').delete().eq('id', id);
    if (error) throw error;
  },

  // --- E-Library CRUD ---
  getLibrary: async (): Promise<LibraryResource[]> => {
    const { data, error } = await supabase.from('e_library').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapLibrary);
  },

  saveLibrary: async (entry: Omit<LibraryResource, 'id'> & { id?: string }): Promise<LibraryResource> => {
    const { data, error } = await supabase.from('e_library').upsert({
      ...(entry.id ? { id: entry.id } : {}), title: entry.title, category: entry.category,
      subject: entry.subject ?? null, description: entry.description ?? null, file_link: entry.fileLink ?? null,
      external_link: entry.externalLink ?? null
    }).select().single();
    if (error) throw error;
    return mapLibrary(data);
  },

  deleteLibrary: async (id: string): Promise<void> => {
    const { error } = await supabase.from('e_library').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Non-Confidential Registered Platform Users Directory ---
  getNonConfidentialUsers: async (): Promise<NonConfidentialUser[]> => {
    try {
      // 1. Fetch all users from Supabase
      const { data: profilesData } = await supabase.from('users').select('full_name, college, year, email, created_at');
      
      // 2. Fetch banned email registries
      const { data: bannedData } = await supabase.from('banned_users').select('email');
      const bannedEmails = bannedData ? bannedData.map(b => b.email.toLowerCase()) : [];

      if (profilesData) {
        return profilesData.map(p => ({
          fullName: p.full_name,
          college: p.college,
          year: p.year,
          email: p.email,
          status: bannedEmails.includes(p.email.toLowerCase()) ? 'Banned' : 'Active',
          joinDate: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }));
      }
    } catch {
      console.warn("Could not query Supabase profile listings. Loading fallback.");
    }
    return [];
  },

  // --- Moderation logs ---
  getReportedAccounts: (): ReportedAccount[] => {
    const list = getStorageItem<ReportedAccount[]>('acadsphere_reports', []);

    supabase.from('reports').select('*').then(({ data }) => {
      if (data) {
        const mapped = data.map(item => ({
          id: item.id,
          fullName: item.full_name,
          email: item.email,
          reason: item.reason,
          reportedDate: new Date(item.reported_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: item.status
        }));
        setStorageItem('acadsphere_reports', mapped);
      }
    });

    return list;
  },

  saveReportStatus: (id: string, status: 'Flagged' | 'Banned' | 'Resolved'): void => {
    const list = getStorageItem<ReportedAccount[]>('acadsphere_reports', []);
    const idx = list.findIndex(r => r.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      setStorageItem('acadsphere_reports', list);
      
      // Sync status to Supabase reports
      supabase.from('reports').update({ status }).eq('id', id).then();

      // Manage banned_users table entry
      if (status === 'Banned') {
        const email = list[idx].email.toLowerCase();
        supabase.from('banned_users').insert({ email, reason: list[idx].reason }).then();
      } else {
        const email = list[idx].email.toLowerCase();
        supabase.from('banned_users').delete().eq('email', email).then();
      }
    }
  },

  banUserEmailDirectly: (email: string, reason?: string): void => {
    const banned = getStorageItem<string[]>('acadsphere_banned_users', []);
    if (!banned.includes(email.toLowerCase())) {
      banned.push(email.toLowerCase());
      setStorageItem('acadsphere_banned_users', banned);
    }

    supabase.from('banned_users').insert({ email: email.toLowerCase(), reason: reason || 'Suspended by admin' }).then();
  },

  unbanUserEmailDirectly: (email: string): void => {
    const banned = getStorageItem<string[]>('acadsphere_banned_users', []);
    setStorageItem('acadsphere_banned_users', banned.filter(e => e !== email.toLowerCase()));

    supabase.from('banned_users').delete().eq('email', email.toLowerCase()).then();
  },

  // --- Holidays CRUD ---
  getHolidays: async (): Promise<HolidayEntry[]> => {
    const { data, error } = await supabase.from('holidays').select('*').order('date', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapHoliday);
  },

  saveHoliday: async (entry: Omit<HolidayEntry, 'id'> & { id?: string }): Promise<HolidayEntry> => {
    const { data, error } = await supabase.from('holidays').upsert({
      ...(entry.id ? { id: entry.id } : {}), title: entry.title, description: entry.description ?? null,
      date: entry.date, type: entry.type, color: entry.color ?? "violet"
    }).select().single();
    if (error) throw error;
    return mapHoliday(data);
  },

  deleteHoliday: async (id: string): Promise<void> => {
    const { error } = await supabase.from('holidays').delete().eq('id', id);
    if (error) throw error;
  }
};
