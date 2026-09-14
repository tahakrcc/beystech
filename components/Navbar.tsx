"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { useLang } from "@/lib/i18n";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const { t, lang, toggle } = useLang();

  const links = [
    { href: "/hizmetler", label: t.nav.services },
    { href: "/isler", label: t.nav.work },
    { href: "/ekip", label: t.nav.team },
    { href: "/iletisim", label: t.nav.contact },
  ];

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full border px-5 py-3 transition-all duration-500 ${
          scrolled
            ? "border-border bg-bg-soft/80 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <Link href="/" aria-label="beystech ana sayfa">
          <Logo markSize={26} />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative rounded-full px-4 py-2 text-sm transition-colors hover:text-text ${
                    active ? "text-text" : "text-muted"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-white/8"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={toggle}
            aria-label="Change language"
            className="flex items-center gap-1 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted transition-colors hover:text-text"
          >
            <GlobeIcon />
            {lang.toUpperCase()}
          </button>
          <Link
            href="/iletisim"
            className="rounded-full bg-text px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-105"
          >
            {t.nav.cta}
          </Link>
        </div>

        <button
          aria-label="Menü"
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-text transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-text transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-text transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-4 top-20 rounded-2xl border border-border bg-bg-soft/95 p-4 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-4 py-3 hover:bg-white/5 hover:text-text ${
                    pathname === "/" ? "text-text" : "text-muted"
                  }`}
                >
                  {t.nav.home}
                </Link>
              </li>
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-4 py-3 hover:bg-white/5 hover:text-text ${
                      pathname === l.href ? "text-text" : "text-muted"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/iletisim"
                  onClick={() => setOpen(false)}
                  className="mt-1 block rounded-lg bg-text px-4 py-3 text-center font-medium text-black"
                >
                  {t.nav.cta}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    toggle();
                    setOpen(false);
                  }}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm text-muted hover:text-text"
                >
                  <GlobeIcon />
                  {lang === "tr" ? "English" : "Türkçe"}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
