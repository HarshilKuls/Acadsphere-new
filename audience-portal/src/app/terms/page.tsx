import Link from "next/link";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing and using AcadSphere, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.",
  },
  {
    title: "2. Description of Service",
    body: "AcadSphere provides students with a centralized platform for academic updates, notifications, and events. We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice."
  },
  {
    title: "3. User Conduct",
    body: "You agree to use AcadSphere only for lawful purposes. You are prohibited from:",
    items: [
      "Using the service to distribute malicious content or spam.",
      "Attempting to gain unauthorized access to other users' accounts or system infrastructure.",
      "Impersonating any person or entity.",
      "Interfering with or disrupting the integrity or performance of the service."
    ]
  },
  {
    title: "4. Intellectual Property",
    body: "All content, features, and functionality provided on AcadSphere (including but not limited to text, graphics, logos, and software) are the exclusive property of AcadSphere and are protected by international copyright and intellectual property laws."
  },
  {
    title: "5. Termination",
    body: "We reserve the right to terminate or suspend your account and access to AcadSphere immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms of Service."
  },
  {
    title: "6. Limitation of Liability",
    body: "In no event shall AcadSphere, its directors, employees, partners, or agents, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service."
  },
  {
    title: "7. Changes to Terms",
    body: "We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our service after any revisions become effective, you agree to be bound by the revised terms."
  },
  {
    title: "8. Contact Information",
    body: "If you have any questions about these Terms, please contact us through our official support channels."
  }
];

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)] transition-colors hover:text-[var(--accent-hover)]">
          <ArrowLeft className="h-4 w-4" /> Back to AcadSphere
        </Link>

        <article className="glass-card mt-6 overflow-hidden rounded-2xl">
          <header className="border-b border-[var(--outline-dim)] bg-[linear-gradient(135deg,var(--accent-20),transparent_65%)] p-6 sm:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-20)] text-[var(--accent-hover)]">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Terms of Service</h1>
            <p className="mt-2 text-sm font-medium text-[var(--muted)]">Last updated: August 2, 2026</p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">Please read these Terms of Service carefully before using AcadSphere. These terms outline the rules and regulations for the use of our platform.</p>
          </header>

          <div className="space-y-8 p-6 sm:p-9">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-base font-extrabold text-[var(--foreground)]">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{section.body}</p>
                {section.items && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <footer className="flex items-center gap-3 border-t border-[var(--outline-dim)] bg-[var(--surface-low)] p-6 text-xs leading-relaxed text-[var(--muted)] sm:px-9">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--accent-hover)]" /> By using AcadSphere, you agree to these terms.
          </footer>
        </article>
      </div>
    </main>
  );
}
