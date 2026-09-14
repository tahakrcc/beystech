"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Content,
  GRADIENT_PRESETS,
  TeamMember,
  WorkItem,
  workPreview,
  domainOf,
} from "@/lib/content-data";
import { LogoMark } from "@/components/Logo";

const TOKEN_KEY = "beystech-admin-token";

export default function AdminPage() {
  const [token, setToken] = useState<string>("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [content, setContent] = useState<Content | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const loadContent = useCallback(async () => {
    const res = await fetch("/api/content");
    const data = (await res.json()) as Content;
    setContent(data);
  }, []);

  // Kayıtlı token varsa doğrula
  useEffect(() => {
    const saved = (() => {
      try {
        return localStorage.getItem(TOKEN_KEY) || "";
      } catch {
        return "";
      }
    })();
    if (!saved) {
      setChecking(false);
      return;
    }
    fetch("/api/content/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: saved }),
    })
      .then((r) => {
        if (r.ok) {
          setToken(saved);
          setAuthed(true);
          return loadContent();
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [loadContent]);

  async function handleLogin(pw: string) {
    setMsg(null);
    const res = await fetch("/api/content/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: pw }),
    });
    if (res.ok) {
      try {
        localStorage.setItem(TOKEN_KEY, pw);
      } catch {}
      setToken(pw);
      setAuthed(true);
      await loadContent();
    } else {
      setMsg({ type: "err", text: "Parola hatalı." });
    }
  }

  function logout() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    setToken("");
    setAuthed(false);
    setContent(null);
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setMsg({ type: "ok", text: "Kaydedildi. Değişiklikler sitede canlı." });
      } else if (res.status === 401) {
        setMsg({ type: "err", text: "Oturum geçersiz, tekrar giriş yapın." });
        logout();
      } else {
        setMsg({ type: "err", text: "Kaydedilemedi." });
      }
    } catch {
      setMsg({ type: "err", text: "Sunucuya ulaşılamadı." });
    } finally {
      setSaving(false);
    }
  }

  if (checking) {
    return (
      <Screen>
        <div className="text-muted">Yükleniyor…</div>
      </Screen>
    );
  }

  if (!authed) {
    return <Login onLogin={handleLogin} msg={msg} />;
  }

  return (
    <Screen>
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark size={30} animated={false} />
            <div>
              <div className="text-lg font-semibold">Beystech Admin</div>
              <div className="text-xs text-faint">İçerik yönetimi</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="rounded-lg border border-border px-3 py-2 text-sm text-muted hover:text-text"
            >
              Siteyi gör ↗
            </Link>
            <button
              onClick={logout}
              className="rounded-lg border border-border px-3 py-2 text-sm text-muted hover:text-text"
            >
              Çıkış
            </button>
          </div>
        </header>

        {content && (
          <>
            <WorksEditor content={content} setContent={setContent} />
            <TeamEditor content={content} setContent={setContent} />

            <div className="sticky bottom-0 -mx-6 mt-10 flex items-center justify-between gap-4 border-t border-border bg-bg/90 px-6 py-4 backdrop-blur">
              {msg ? (
                <span className={msg.type === "ok" ? "text-emerald-400" : "text-rose-400"}>
                  {msg.text}
                </span>
              ) : (
                <span className="text-sm text-faint">Değişiklikleri kaydetmeyi unutma.</span>
              )}
              <button
                onClick={save}
                disabled={saving}
                className="rounded-xl bg-text px-6 py-2.5 font-medium text-black transition-opacity disabled:opacity-50"
              >
                {saving ? "Kaydediliyor…" : "Kaydet"}
              </button>
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}

/* ---------------- Works ---------------- */

function WorksEditor({
  content,
  setContent,
}: {
  content: Content;
  setContent: (c: Content) => void;
}) {
  function update(id: string, patch: Partial<WorkItem>) {
    setContent({
      ...content,
      works: content.works.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    });
  }
  function updateLoc(id: string, field: "title" | "cat" | "desc", lang: "tr" | "en", value: string) {
    const w = content.works.find((x) => x.id === id);
    if (!w) return;
    update(id, { [field]: { ...w[field], [lang]: value } } as Partial<WorkItem>);
  }
  function add() {
    const nw: WorkItem = {
      id: "w" + Date.now(),
      year: new Date().getFullYear().toString(),
      grad: GRADIENT_PRESETS[0],
      title: { tr: "Yeni Proje", en: "New Project" },
      cat: { tr: "Web", en: "Web" },
      desc: { tr: "", en: "" },
    };
    setContent({ ...content, works: [...content.works, nw] });
  }
  function remove(id: string) {
    setContent({ ...content, works: content.works.filter((w) => w.id !== id) });
  }
  function move(id: string, dir: -1 | 1) {
    const i = content.works.findIndex((w) => w.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= content.works.length) return;
    const arr = [...content.works];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setContent({ ...content, works: arr });
  }

  return (
    <section className="mb-12">
      <SectionHead
        title="İşler"
        sub={`${content.works.length} proje`}
        onAdd={add}
        addLabel="+ Proje ekle"
      />
      <div className="space-y-4">
        {content.works.map((w, i) => (
          <div key={w.id} className="rounded-2xl border border-border bg-surface/40 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded-md bg-gradient-to-br ${w.grad}`} />
                <span className="font-medium">{w.title.tr || "İsimsiz"}</span>
              </div>
              <RowControls
                onUp={() => move(w.id, -1)}
                onDown={() => move(w.id, 1)}
                onRemove={() => remove(w.id)}
                disableUp={i === 0}
                disableDown={i === content.works.length - 1}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Başlık (TR)" value={w.title.tr} onChange={(v) => updateLoc(w.id, "title", "tr", v)} />
              <Field label="Başlık (EN)" value={w.title.en} onChange={(v) => updateLoc(w.id, "title", "en", v)} />
              <Field label="Kategori (TR)" value={w.cat.tr} onChange={(v) => updateLoc(w.id, "cat", "tr", v)} />
              <Field label="Kategori (EN)" value={w.cat.en} onChange={(v) => updateLoc(w.id, "cat", "en", v)} />
              <TextArea label="Açıklama (TR)" value={w.desc.tr} onChange={(v) => updateLoc(w.id, "desc", "tr", v)} />
              <TextArea label="Açıklama (EN)" value={w.desc.en} onChange={(v) => updateLoc(w.id, "desc", "en", v)} />
              <Field label="Yıl" value={w.year} onChange={(v) => update(w.id, { year: v })} />
              <GradientPicker value={w.grad} onChange={(g) => update(w.id, { grad: g })} />
              <Field
                label="Site linki (opsiyonel — girilirse kart tıklanabilir + otomatik önizleme)"
                value={w.url || ""}
                onChange={(v) => update(w.id, { url: v })}
              />
              <Field
                label="Görsel URL (opsiyonel — girilirse önizleme yerine bu kullanılır)"
                value={w.image || ""}
                onChange={(v) => update(w.id, { image: v })}
              />
              <div className="md:col-span-2">
                <PreviewBox work={w} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Team ---------------- */

function TeamEditor({
  content,
  setContent,
}: {
  content: Content;
  setContent: (c: Content) => void;
}) {
  function update(id: string, patch: Partial<TeamMember>) {
    setContent({
      ...content,
      team: content.team.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    });
  }
  function updateLoc(id: string, field: "name" | "role", lang: "tr" | "en", value: string) {
    const m = content.team.find((x) => x.id === id);
    if (!m) return;
    update(id, { [field]: { ...m[field], [lang]: value } } as Partial<TeamMember>);
  }
  function add() {
    const nm: TeamMember = {
      id: "m" + Date.now(),
      grad: GRADIENT_PRESETS[6],
      name: { tr: "Ekip Üyesi", en: "Team Member" },
      role: { tr: "Rol", en: "Role" },
    };
    setContent({ ...content, team: [...content.team, nm] });
  }
  function remove(id: string) {
    setContent({ ...content, team: content.team.filter((m) => m.id !== id) });
  }
  function move(id: string, dir: -1 | 1) {
    const i = content.team.findIndex((m) => m.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= content.team.length) return;
    const arr = [...content.team];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setContent({ ...content, team: arr });
  }

  return (
    <section className="mb-12">
      <SectionHead
        title="Ekip"
        sub={`${content.team.length} üye`}
        onAdd={add}
        addLabel="+ Üye ekle"
      />
      <div className="space-y-4">
        {content.team.map((m, i) => (
          <div key={m.id} className="rounded-2xl border border-border bg-surface/40 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded-md bg-gradient-to-br ${m.grad}`} />
                <span className="font-medium">{m.role.tr || "Rol"}</span>
              </div>
              <RowControls
                onUp={() => move(m.id, -1)}
                onDown={() => move(m.id, 1)}
                onRemove={() => remove(m.id)}
                disableUp={i === 0}
                disableDown={i === content.team.length - 1}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="İsim (TR)" value={m.name.tr} onChange={(v) => updateLoc(m.id, "name", "tr", v)} />
              <Field label="İsim (EN)" value={m.name.en} onChange={(v) => updateLoc(m.id, "name", "en", v)} />
              <Field label="Rol (TR)" value={m.role.tr} onChange={(v) => updateLoc(m.id, "role", "tr", v)} />
              <Field label="Rol (EN)" value={m.role.en} onChange={(v) => updateLoc(m.id, "role", "en", v)} />
              <div className="md:col-span-2">
                <GradientPicker value={m.grad} onChange={(g) => update(m.id, { grad: g })} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- UI parçaları ---------------- */

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg px-6 py-10 text-text">{children}</div>
  );
}

function SectionHead({
  title,
  sub,
  onAdd,
  addLabel,
}: {
  title: string;
  sub: string;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <span className="text-sm text-faint">{sub}</span>
      </div>
      <button
        onClick={onAdd}
        className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent-2 hover:bg-accent/20"
      >
        {addLabel}
      </button>
    </div>
  );
}

function RowControls({
  onUp,
  onDown,
  onRemove,
  disableUp,
  disableDown,
}: {
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
  disableUp: boolean;
  disableDown: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onUp} disabled={disableUp} className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted hover:text-text disabled:opacity-30" aria-label="Yukarı">↑</button>
      <button onClick={onDown} disabled={disableDown} className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted hover:text-text disabled:opacity-30" aria-label="Aşağı">↓</button>
      <button onClick={onRemove} className="grid h-8 w-8 place-items-center rounded-md border border-rose-500/40 text-rose-400 hover:bg-rose-500/10" aria-label="Sil">✕</button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm text-text outline-none focus:border-accent"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-muted">{label}</span>
      <textarea
        value={value}
        rows={2}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm text-text outline-none focus:border-accent"
      />
    </label>
  );
}

function GradientPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (g: string) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-xs text-muted">Renk (gradyan)</span>
      <div className="flex flex-wrap gap-2">
        {GRADIENT_PRESETS.map((g) => (
          <button
            key={g}
            onClick={() => onChange(g)}
            aria-label={g}
            className={`h-8 w-8 rounded-md bg-gradient-to-br ${g} ring-offset-2 ring-offset-surface transition ${
              value === g ? "ring-2 ring-text" : "ring-0 hover:scale-110"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function PreviewBox({ work }: { work: WorkItem }) {
  const src = workPreview(work);
  if (!src) {
    return (
      <div className="rounded-lg border border-dashed border-border p-4 text-xs text-faint">
        Site linki veya görsel URL girince burada önizleme görünür.
      </div>
    );
  }
  return (
    <div>
      <span className="mb-1.5 block text-xs text-muted">
        Önizleme{work.url && !work.image ? ` · ${domainOf(work.url)}` : ""}
      </span>
      <div className="aspect-[16/9] w-full max-w-xs overflow-hidden rounded-lg border border-border bg-bg-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="önizleme" className="h-full w-full object-cover" />
      </div>
      {work.url && !work.image && (
        <p className="mt-1.5 text-[11px] text-faint">
          Site ekran görüntüsü ilk seferde birkaç saniyede oluşur; görünmezse birazdan tekrar bak.
        </p>
      )}
    </div>
  );
}

function Login({
  onLogin,
  msg,
}: {
  onLogin: (pw: string) => void;
  msg: { type: "ok" | "err"; text: string } | null;
}) {
  const [pw, setPw] = useState("");
  return (
    <Screen>
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center">
        <div className="mb-6 flex items-center gap-3">
          <LogoMark size={34} />
          <span className="text-xl font-semibold">Beystech Admin</span>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(pw);
          }}
          className="rounded-2xl border border-border bg-surface/40 p-6"
        >
          <label className="mb-2 block text-sm text-muted">Parola</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-border bg-bg-soft px-4 py-3 text-text outline-none focus:border-accent"
            autoFocus
          />
          {msg?.type === "err" && <p className="mt-3 text-sm text-rose-400">{msg.text}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-text py-3 font-medium text-black"
          >
            Giriş yap
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-faint">
          Yetkisiz erişime kapalıdır.
        </p>
      </div>
    </Screen>
  );
}
