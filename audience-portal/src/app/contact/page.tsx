import Link from "next/link";
import { ArrowLeft, MessageSquare, Mail, ExternalLink } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)] transition-colors hover:text-[var(--accent-hover)]">
          <ArrowLeft className="h-4 w-4" /> Back to AcadSphere
        </Link>

        <article className="glass-card mt-6 overflow-hidden rounded-2xl">
          <header className="border-b border-[var(--outline-dim)] bg-[linear-gradient(135deg,var(--accent-20),transparent_65%)] p-6 sm:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-20)] text-[var(--accent-hover)]">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Support & Contact</h1>
            <p className="mt-2 text-sm font-medium text-[var(--muted)]">Get in touch with the AcadSphere team.</p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              Whether you have a question, found a bug, or want to collaborate, we'd love to hear from you. 
              Our community team is always active on our official channels.
            </p>
          </header>

          <div className="p-6 sm:p-9 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a 
                href="mailto:support@acadsphere.com"
                className="flex items-start gap-4 p-5 rounded-xl border border-[var(--outline-dim)] bg-[var(--surface-low)] hover:border-[var(--accent)]/50 transition-colors"
              >
                <Mail className="w-5 h-5 mt-0.5 text-[var(--accent-hover)]" />
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Email Support</h3>
                  <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">Reach out directly via email for technical issues.</p>
                </div>
              </a>

              <a 
                href="https://www.instagram.com/acadsphere?stkn=MWpmM2F2OGNoem51Yg=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-xl border border-[var(--outline-dim)] bg-[var(--surface-low)] hover:border-pink-500/50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mt-0.5 text-pink-500 shrink-0">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">Instagram</h3>
                  <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">Follow us for ecosystem updates and announcements.</p>
                </div>
              </a>

              <a 
                href="https://www.linkedin.com/company/acadsphere-in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-xl border border-[var(--outline-dim)] bg-[var(--surface-low)] hover:border-blue-500/50 transition-colors sm:col-span-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mt-0.5 text-blue-500 shrink-0">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)]">LinkedIn</h3>
                  <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">Connect with the development team and view our professional network.</p>
                </div>
              </a>
            </div>

            <div className="mt-8 p-5 rounded-xl border border-[var(--outline-dim)] bg-[var(--accent-20)]">
              <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-[var(--accent-hover)]" /> Internal Dashboard Support
              </h3>
              <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
                If you are already a registered student, please log in and use the internal Support module inside the dashboard to file direct bug reports and view documentation.
              </p>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
