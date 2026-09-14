// İstemci ve sunucu tarafında paylaşılan içerik tipleri + varsayılan (tohum) içerik.
// Burada fs YOK — istemci bileşenleri de güvenle import edebilir.

export type Localized = { tr: string; en: string };

export type WorkItem = {
  id: string;
  year: string;
  grad: string; // tailwind gradient sınıfları
  title: Localized;
  cat: Localized;
  desc: Localized;
  url?: string; // proje/site linki (girilirse kart tıklanabilir + otomatik önizleme)
  image?: string; // görsel URL (girilirse önizleme yerine bu kullanılır)
};

/**
 * Proje kartı için önizleme görseli:
 * - image varsa onu,
 * - yoksa url varsa siteden otomatik ekran görüntüsü (WordPress mShots, ücretsiz),
 * - ikisi de yoksa null (gradyan gösterilir).
 */
export function workPreview(w: { image?: string; url?: string }): string | null {
  if (w.image && w.image.trim()) return w.image.trim();
  if (w.url && w.url.trim()) {
    return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(w.url.trim())}?w=1200`;
  }
  return null;
}

export function domainOf(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

export type TeamMember = {
  id: string;
  grad: string;
  name: Localized;
  role: Localized;
};

export type Content = {
  works: WorkItem[];
  team: TeamMember[];
};

// Admin panelinde seçilebilecek gradyan ön ayarları
export const GRADIENT_PRESETS: string[] = [
  "from-violet-500 via-fuchsia-500 to-indigo-500",
  "from-cyan-400 via-sky-500 to-blue-600",
  "from-emerald-400 via-teal-500 to-cyan-600",
  "from-orange-400 via-pink-500 to-rose-500",
  "from-fuchsia-500 via-pink-500 to-rose-500",
  "from-indigo-500 via-blue-600 to-violet-600",
  "from-violet-500 to-indigo-500",
  "from-cyan-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-fuchsia-500 to-pink-500",
  "from-orange-400 to-rose-500",
  "from-sky-400 to-indigo-500",
];

export const defaultContent: Content = {
  works: [
    {
      id: "w1",
      year: "2025",
      grad: "from-violet-500 via-fuchsia-500 to-indigo-500",
      title: { tr: "Fintech Mobil Cüzdan", en: "Fintech Mobile Wallet" },
      cat: { tr: "Mobil · Fintech", en: "Mobile · Fintech" },
      desc: {
        tr: "Anlık para transferi ve yatırım özellikli, 100K+ kullanıcılı mobil uygulama.",
        en: "A mobile app with instant transfers and investing, 100K+ users.",
      },
    },
    {
      id: "w2",
      year: "2025",
      grad: "from-cyan-400 via-sky-500 to-blue-600",
      title: { tr: "B2B SaaS Panel", en: "B2B SaaS Dashboard" },
      cat: { tr: "Web · SaaS", en: "Web · SaaS" },
      desc: {
        tr: "Kurumsal analitik platformu; gerçek zamanlı veri ve rol tabanlı yetkilendirme.",
        en: "Enterprise analytics platform; real-time data and role-based access.",
      },
    },
    {
      id: "w3",
      year: "2024",
      grad: "from-emerald-400 via-teal-500 to-cyan-600",
      title: { tr: "AI Destek Asistanı", en: "AI Support Assistant" },
      cat: { tr: "Yapay Zeka", en: "AI" },
      desc: {
        tr: "Bilgi tabanına bağlı, çok dilli müşteri destek asistanı. %60 daha hızlı yanıt.",
        en: "Knowledge-base connected, multilingual customer support assistant. 60% faster responses.",
      },
    },
    {
      id: "w4",
      year: "2024",
      grad: "from-orange-400 via-pink-500 to-rose-500",
      title: { tr: "E-ticaret Yeniden Tasarım", en: "E-commerce Redesign" },
      cat: { tr: "Web · E-ticaret", en: "Web · E-commerce" },
      desc: {
        tr: "Dönüşüm odaklı yeniden tasarım; sayfa hızı 3x, satışlar %40 arttı.",
        en: "Conversion-focused redesign; 3x page speed, 40% more sales.",
      },
    },
  ],
  team: [
    {
      id: "m1",
      grad: "from-violet-500 to-indigo-500",
      name: { tr: "Ekip Üyesi", en: "Team Member" },
      role: { tr: "Kurucu · Yazılım Mimarı", en: "Founder · Software Architect" },
    },
    {
      id: "m2",
      grad: "from-cyan-400 to-blue-500",
      name: { tr: "Ekip Üyesi", en: "Team Member" },
      role: { tr: "Ürün & Tasarım Lideri", en: "Product & Design Lead" },
    },
    {
      id: "m3",
      grad: "from-emerald-400 to-teal-500",
      name: { tr: "Ekip Üyesi", en: "Team Member" },
      role: { tr: "Mobil Geliştirici", en: "Mobile Developer" },
    },
    {
      id: "m4",
      grad: "from-fuchsia-500 to-pink-500",
      name: { tr: "Ekip Üyesi", en: "Team Member" },
      role: { tr: "Yapay Zeka Mühendisi", en: "AI Engineer" },
    },
  ],
};
