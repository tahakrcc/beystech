"use client";

import Logo from "./Logo";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border pt-14 pb-28">
      <div className="container-x">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo markSize={28} />
            <p className="mt-4 text-sm leading-relaxed text-muted">{t.footer.tagline}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol title={t.footer.services.title} links={t.footer.services.links} />
            <FooterCol title={t.footer.company.title} links={t.footer.company.links} />
            <FooterCol title={t.footer.contact.title} links={t.footer.contact.links} />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-faint sm:flex-row">
          <span>© {new Date().getFullYear()} Beystech. {t.footer.rights}</span>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-text">
              {t.footer.privacy}
            </a>
            <a href="#" className="transition-colors hover:text-text">
              {t.footer.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="mb-4 text-sm font-medium">{title}</div>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-muted transition-colors hover:text-text">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
