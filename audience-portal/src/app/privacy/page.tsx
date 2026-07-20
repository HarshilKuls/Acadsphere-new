import Link from "next/link";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "1. Information We Collect",
    body: "AcadSphere collects only the minimum information required to provide its services.",
    collect: ["Your name", "Your college or university name"],
    exclude: ["Email addresses", "Phone numbers", "Passwords", "Academic records or grades", "Attendance data", "Financial information", "Device contacts", "Photos or media files", "Location data", "Any other personally identifiable information unless explicitly requested in the future with your consent"],
  },
  {
    title: "2. How We Use Your Information",
    body: "The information we collect is used solely to:",
    items: ["Personalize your experience within AcadSphere.", "Display your name where appropriate within the platform.", "Associate your profile with your selected college or university.", "Improve the overall user experience."],
    note: "Your information is never sold, rented, shared, or used for advertising purposes.",
  },
  { title: "3. Data Security", body: "We take reasonable technical and organizational measures to protect your information from unauthorized access, disclosure, alteration, or destruction. All communication between your device and our servers is encrypted using secure HTTPS/TLS protocols." },
  { title: "4. Data Retention", body: "We retain only the information necessary to maintain your AcadSphere account. If you delete your account or request data removal, your stored personal information will be permanently deleted within a reasonable period, unless retention is required by applicable law." },
  { title: "5. Third-Party Services", body: "AcadSphere does not use third-party advertising networks or analytics services that collect your personal information. We do not share your data with external organizations, advertisers, or marketing platforms." },
  { title: "6. Your Rights", body: "You have the right to:", items: ["Access the personal information associated with your account.", "Request corrections if your information is inaccurate.", "Request deletion of your personal data.", "Stop using AcadSphere at any time."], note: "If you have questions regarding your privacy or wish to exercise your rights, please contact us through our official support page or email." },
  { title: "7. Children’s Privacy", body: "AcadSphere is intended for college and university students. We do not knowingly collect personal information from children under the age required by applicable laws. If such information is discovered, it will be removed promptly." },
  { title: "8. Changes to This Privacy Policy", body: "We may update this Privacy Policy from time to time. Any updates will be posted on this page along with the revised Last Updated date. Continued use of AcadSphere after changes become effective constitutes acceptance of the updated policy." },
  { title: "9. Contact Us", body: "If you have any questions or concerns regarding this Privacy Policy or your personal information, please contact the AcadSphere support team through our official website or support email." },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[var(--muted)] transition-colors hover:text-[var(--accent-hover)]">
          <ArrowLeft className="h-4 w-4" /> Back to AcadSphere
        </Link>

        <article className="glass-card mt-6 overflow-hidden rounded-2xl">
          <header className="border-b border-[var(--outline-dim)] bg-[linear-gradient(135deg,var(--accent-20),transparent_65%)] p-6 sm:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-20)] text-[var(--accent-hover)]">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Privacy Policy</h1>
            <p className="mt-2 text-sm font-medium text-[var(--muted)]">Last updated: July 12, 2026</p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">At AcadSphere, we value your privacy and are committed to protecting your personal information. This policy explains what information we collect, how we use it, and the choices you have regarding your data.</p>
          </header>

          <div className="space-y-8 p-6 sm:p-9">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-base font-extrabold text-[var(--foreground)]">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{section.body}</p>
                {section.collect && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">{section.collect.map((item) => <li key={item}>{item}</li>)}</ul>}
                {section.exclude && <><p className="mt-4 text-sm font-bold text-[var(--foreground)]">We do not collect or store:</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">{section.exclude.map((item) => <li key={item}>{item}</li>)}</ul></>}
                {section.items && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
                {section.note && <p className="mt-4 text-sm font-semibold leading-relaxed text-[var(--foreground)]">{section.note}</p>}
              </section>
            ))}
          </div>

          <footer className="flex items-center gap-3 border-t border-[var(--outline-dim)] bg-[var(--surface-low)] p-6 text-xs leading-relaxed text-[var(--muted)] sm:px-9">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--accent-hover)]" /> Your privacy is part of the AcadSphere experience.
          </footer>
        </article>
      </div>
    </main>
  );
}
