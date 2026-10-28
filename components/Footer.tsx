"use client";

import Logo from "./Logo";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border bg-bg-soft/30 pt-16 pb-32 sm:pt-20">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)] md:gap-16">
          <div className="max-w-xs">
            <Link href="/" aria-label="beystech ana sayfa" className="inline-flex">
              <Logo markSize={32} />
            </Link>
            <p className="mt-5 text-sm leading-7 text-muted">{t.footer.tagline}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            <FooterCol title={t.footer.services.title} links={t.footer.services.links.map((label, i) => ({ label, href: `/hizmetler#${["web", "mobil", "yapay-zeka", "tasarim"][i]}` }))} />
            <FooterCol title={t.footer.company.title} links={t.footer.company.links.map((label, i) => ({ label, href: ["/", "/isler", "/ekip", "/iletisim"][i] }))} />
            <div>
              <h2 className="mb-5 text-sm font-semibold text-text">{t.footer.contact.title}</h2>
              <ul className="space-y-3 text-sm leading-relaxed text-muted">
                <li><a href="mailto:info@beystech.com" className="break-all transition-colors hover:text-accent-2 focus-visible:text-accent-2">info@beystech.com</a></li>
                <li><a href="tel:+905539580005" className="transition-colors hover:text-accent-2 focus-visible:text-accent-2">+90 553 958 00 05</a></li>
                <li>{t.footer.contact.links[1]}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-7 text-sm text-muted">
          <span>© {new Date().getFullYear()} Beystech. {t.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="mb-5 text-sm font-semibold text-text">{title}</h2>
      <ul className="space-y-3">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link href={href} className="text-sm text-muted transition-colors hover:text-accent-2 focus-visible:text-accent-2">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
