"use client";

import { motion } from "motion/react";
import { FormEvent, useState } from "react";
import Reveal from "./Reveal";
import { useLang } from "@/lib/i18n";

export default function Contact({ hideHeader = false }: { hideHeader?: boolean }) {
  const { t } = useLang();
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Not: Form gönderimi henüz bir servise bağlı değil.
    // Buraya kendi e-posta/CRM entegrasyonunuzu ekleyebilirsiniz.
    setSent(true);
  }

  return (
    <section id="iletisim" className="relative overflow-hidden py-28">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)", opacity: 0.25 }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="container-x relative z-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-surface/50 p-8 backdrop-blur-xl sm:p-12">
          {!hideHeader && (
            <div className="mb-8 text-center">
              <Reveal>
                <span className="text-sm font-medium text-accent-2">{t.contact.eyebrow}</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {t.contact.title}
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mx-auto mt-4 max-w-md text-muted">{t.contact.desc}</p>
              </Reveal>
            </div>
          )}

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-accent-2/40 bg-accent-2/5 p-10 text-center"
            >
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-accent-2/20 text-2xl">
                ✓
              </div>
              <h3 className="text-xl font-medium">{t.contact.sentTitle}</h3>
              <p className="mt-2 text-muted">{t.contact.sentDesc}</p>
            </motion.div>
          ) : (
            <Reveal delay={0.15}>
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t.contact.name} name="name" placeholder={t.contact.namePh} />
                  <Field label={t.contact.email} name="email" type="email" placeholder="ornek@mail.com" />
                </div>
                <Field label={t.contact.company} name="company" placeholder={t.contact.companyPh} required={false} />
                <div>
                  <label className="mb-2 block text-sm text-muted">{t.contact.project}</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder={t.contact.projectPh}
                    className="w-full resize-none rounded-xl border border-border bg-bg-soft px-4 py-3 text-text outline-none transition-colors placeholder:text-faint focus:border-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="group relative mt-2 overflow-hidden rounded-xl bg-text px-7 py-3.5 font-medium text-black"
                >
                  <span className="relative z-10">{t.contact.submit}</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-accent-3 via-accent to-accent-2 transition-transform duration-500 group-hover:translate-x-0" />
                </button>
              </form>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-muted">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-bg-soft px-4 py-3 text-text outline-none transition-colors placeholder:text-faint focus:border-accent"
      />
    </div>
  );
}
