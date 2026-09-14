"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "tr" | "en";

const tr = {
  nav: {
    home: "Ana Sayfa",
    services: "Hizmetler",
    work: "İşler",
    team: "Ekip",
    contact: "İletişim",
    cta: "Teklif al",
  },
  hero: {
    badge: "Yeni projeler için müsaitiz",
    line1: "Biz sadece kod yazmıyoruz,",
    we: "biz",
    rotating: ["ürün kuruyoruz", "marka büyütüyoruz", "gelecek inşa ediyoruz", "değer üretiyoruz"],
    desc: "Beystech; web, mobil ve yapay zeka destekli ürünler tasarlayıp geliştiren bir yazılım stüdyosu. Fikirden canlıya, uçtan uca.",
    primary: "Projeni konuşalım",
    secondary: "İşlerimize bak",
  },
  marquee: {
    title: "Kullandığımız teknolojiler",
    items: [
      "Next.js", "React Native", "TypeScript", "Node.js", "Python", "PostgreSQL",
      "AWS", "Yapay Zeka / LLM", "Figma", "Flutter", "Go", "Kubernetes",
    ],
  },
  services: {
    eyebrow: "Ne yapıyoruz",
    title: "Uçtan uca dijital ürün geliştirme",
    desc: "Tek bir hizmet değil, ürününüzün her katmanını üstlenen bir ekip. İhtiyacınıza göre esneriz.",
    items: [
      { title: "Web Platformları", desc: "Yüksek performanslı web uygulamaları, kurumsal siteler ve SaaS ürünleri. Next.js ile SEO'ya ve hıza odaklı.", tags: ["Next.js", "SaaS", "E-ticaret"] },
      { title: "Mobil Uygulama", desc: "iOS ve Android için tek kod tabanından native deneyim. Mağaza sürecinden bakım hizmetine kadar yanınızdayız.", tags: ["React Native", "Flutter", "iOS · Android"] },
      { title: "Yapay Zeka Çözümleri", desc: "LLM entegrasyonları, sohbet asistanları ve otomasyon. Ürününüze akıllı katman ekliyoruz.", tags: ["LLM", "RAG", "Otomasyon"] },
      { title: "Ürün & UI/UX Tasarım", desc: "Kullanıcı araştırmasından tasarım sistemine kadar. Sadece güzel değil, dönüşüm getiren arayüzler.", tags: ["Figma", "Design System", "Prototip"] },
      { title: "Backend & Altyapı", desc: "Ölçeklenebilir API'ler, bulut mimarisi ve DevOps. Trafik arttıkça büyüyen sistemler.", tags: ["Node.js", "AWS", "PostgreSQL"] },
      { title: "Danışmanlık & Bakım", desc: "Teknik strateji, kod denetimi ve sürekli destek. Ekibinizin uzatması gibi çalışırız.", tags: ["Audit", "SLA", "Destek"] },
    ],
  },
  work: {
    eyebrow: "Seçili işler",
    title: "Yayına aldığımız ürünler",
    items: [
      { title: "Fintech Mobil Cüzdan", cat: "Mobil · Fintech", desc: "Anlık para transferi ve yatırım özellikli, 100K+ kullanıcılı mobil uygulama." },
      { title: "B2B SaaS Panel", cat: "Web · SaaS", desc: "Kurumsal analitik platformu; gerçek zamanlı veri ve rol tabanlı yetkilendirme." },
      { title: "AI Destek Asistanı", cat: "Yapay Zeka", desc: "Bilgi tabanına bağlı, çok dilli müşteri destek asistanı. %60 daha hızlı yanıt." },
      { title: "E-ticaret Yeniden Tasarım", cat: "Web · E-ticaret", desc: "Dönüşüm odaklı yeniden tasarım; sayfa hızı 3x, satışlar %40 arttı." },
    ],
  },
  stats: [
    { v: "30+", l: "Teslim edilen proje" },
    { v: "2", l: "Yıllık deneyim" },
    { v: "%98", l: "Müşteri memnuniyeti" },
    { v: "12", l: "Uzman ekip üyesi" },
  ],
  process: {
    eyebrow: "Nasıl çalışıyoruz",
    title: "Öngörülebilir, şeffaf bir süreç",
    steps: [
      { title: "Keşif & Strateji", desc: "İş hedeflerinizi, kullanıcılarınızı ve teknik kısıtları anlıyoruz. Yol haritasını birlikte çiziyoruz." },
      { title: "Tasarım & Prototip", desc: "Tıklanabilir prototiplerle fikri erkenden test ediyoruz. Kod yazmadan önce doğru olduğundan emin oluyoruz." },
      { title: "Geliştirme", desc: "Haftalık teslimlerle şeffaf ilerliyoruz. Her sprint sonunda çalışan, görülebilir bir sürüm." },
      { title: "Yayın & Büyüme", desc: "Canlıya alıyor, ölçüyor ve optimize ediyoruz. İlk günden sonra da yanınızdayız." },
    ],
  },
  team: {
    eyebrow: "Ekip",
    title: "Arkasında gerçek insanlar var",
    desc: "Küçük ama uçtan uca yetkin bir ekip. Projenizle doğrudan geliştiricilerle çalışırsınız, aracı katman yok.",
    memberName: "Ekip Üyesi",
    roles: ["Kurucu · Yazılım Mimarı", "Ürün & Tasarım Lideri", "Mobil Geliştirici", "Yapay Zeka Mühendisi"],
  },
  contact: {
    eyebrow: "İletişim",
    title: "Bir fikriniz mi var?",
    desc: "Projenizi anlatın, 24 saat içinde dönüş yapalım. İlk görüşme her zaman ücretsiz.",
    name: "Ad Soyad",
    namePh: "Adınız",
    email: "E-posta",
    company: "Şirket (opsiyonel)",
    companyPh: "Şirket adı",
    project: "Projeniz",
    projectPh: "Ne yapmak istediğinizi kısaca anlatın…",
    submit: "Mesajı gönder",
    sentTitle: "Teşekkürler!",
    sentDesc: "Mesajınızı aldık, en kısa sürede size dönüş yapacağız.",
  },
  cta: {
    desc: "Fikrinizi anlatın, 24 saat içinde dönüş yapalım. İlk görüşme ücretsiz.",
    button: "Projeni konuşalım →",
    titles: {
      default: "Bir sonraki projeyi birlikte yapalım",
      work: "Sıradaki projeniz burada olsun",
      team: "Ekibimizle tanışmak ister misiniz?",
    },
  },
  footer: {
    tagline: "Fikirden ölçeklenen ürüne kadar dijital ürün geliştiren yazılım stüdyosu.",
    services: { title: "Hizmetler", links: ["Web Platformları", "Mobil Uygulama", "Yapay Zeka", "Tasarım"] },
    company: { title: "Şirket", links: ["Hakkımızda", "İşler", "Ekip", "İletişim"] },
    contact: { title: "İletişim", links: ["merhaba@beystech.com", "İstanbul, Türkiye"] },
    rights: "Tüm hakları saklıdır.",
    privacy: "Gizlilik",
    terms: "Şartlar",
  },
  dock: { call: "Ara", message: "Mesaj gönder", mail: "E-posta gönder" },
  pages: {
    services: { eyebrow: "Hizmetler", title: "Uçtan uca dijital ürün geliştirme", desc: "Tek bir hizmet değil, ürününüzün her katmanını üstlenen bir ekip. İhtiyacınıza göre esneriz." },
    work: { eyebrow: "Seçili işler", title: "Yayına aldığımız ürünler", desc: "Fikirden canlıya taşıdığımız projelerden bir seçki. Her biri gerçek kullanıcılarla test edilmiş, ölçeklenen ürünler." },
    team: { eyebrow: "Ekip & Kültür", title: "Arkasında gerçek insanlar var", desc: "Küçük ama uçtan uca yetkin bir ekip. Projenizle doğrudan geliştiricilerle çalışırsınız, aracı katman yok." },
    contact: { eyebrow: "İletişim", title: "Bir fikriniz mi var?", desc: "Projenizi anlatın, 24 saat içinde dönüş yapalım. İlk görüşme her zaman ücretsiz." },
  },
};

export type Dict = typeof tr;

const en: Dict = {
  nav: {
    home: "Home",
    services: "Services",
    work: "Work",
    team: "Team",
    contact: "Contact",
    cta: "Get a quote",
  },
  hero: {
    badge: "Available for new projects",
    line1: "We don't just write code,",
    we: "we",
    rotating: ["build products", "grow brands", "engineer the future", "create value"],
    desc: "Beystech is a software studio that designs and builds web, mobile and AI-powered products. From idea to launch, end to end.",
    primary: "Let's talk",
    secondary: "See our work",
  },
  marquee: {
    title: "Technologies we use",
    items: [
      "Next.js", "React Native", "TypeScript", "Node.js", "Python", "PostgreSQL",
      "AWS", "AI / LLM", "Figma", "Flutter", "Go", "Kubernetes",
    ],
  },
  services: {
    eyebrow: "What we do",
    title: "End-to-end digital product development",
    desc: "Not a single service — a team that owns every layer of your product. We flex to your needs.",
    items: [
      { title: "Web Platforms", desc: "High-performance web apps, corporate sites and SaaS products. Built with Next.js, focused on SEO and speed.", tags: ["Next.js", "SaaS", "E-commerce"] },
      { title: "Mobile Apps", desc: "A native experience for iOS and Android from a single codebase. We're with you from store submission to maintenance.", tags: ["React Native", "Flutter", "iOS · Android"] },
      { title: "AI Solutions", desc: "LLM integrations, chat assistants and automation. We add an intelligent layer to your product.", tags: ["LLM", "RAG", "Automation"] },
      { title: "Product & UI/UX Design", desc: "From user research to design systems. Interfaces that aren't just beautiful, they convert.", tags: ["Figma", "Design System", "Prototype"] },
      { title: "Backend & Infrastructure", desc: "Scalable APIs, cloud architecture and DevOps. Systems that grow as your traffic grows.", tags: ["Node.js", "AWS", "PostgreSQL"] },
      { title: "Consulting & Maintenance", desc: "Technical strategy, code audits and ongoing support. We work as an extension of your team.", tags: ["Audit", "SLA", "Support"] },
    ],
  },
  work: {
    eyebrow: "Selected work",
    title: "Products we've shipped",
    items: [
      { title: "Fintech Mobile Wallet", cat: "Mobile · Fintech", desc: "A mobile app with instant transfers and investing, 100K+ users." },
      { title: "B2B SaaS Dashboard", cat: "Web · SaaS", desc: "Enterprise analytics platform; real-time data and role-based access." },
      { title: "AI Support Assistant", cat: "AI", desc: "Knowledge-base connected, multilingual customer support assistant. 60% faster responses." },
      { title: "E-commerce Redesign", cat: "Web · E-commerce", desc: "Conversion-focused redesign; 3x page speed, 40% more sales." },
    ],
  },
  stats: [
    { v: "30+", l: "Delivered projects" },
    { v: "2", l: "Years of experience" },
    { v: "98%", l: "Client satisfaction" },
    { v: "12", l: "Expert team members" },
  ],
  process: {
    eyebrow: "How we work",
    title: "A predictable, transparent process",
    steps: [
      { title: "Discovery & Strategy", desc: "We understand your business goals, users and technical constraints. We draw the roadmap together." },
      { title: "Design & Prototype", desc: "We test the idea early with clickable prototypes. We make sure it's right before writing code." },
      { title: "Development", desc: "We move transparently with weekly deliveries. A working, visible build at the end of every sprint." },
      { title: "Launch & Growth", desc: "We launch, measure and optimize. We stay with you well after day one." },
    ],
  },
  team: {
    eyebrow: "Team",
    title: "Real people behind it",
    desc: "A small but fully capable team. You work directly with developers, no middle layer.",
    memberName: "Team Member",
    roles: ["Founder · Software Architect", "Product & Design Lead", "Mobile Developer", "AI Engineer"],
  },
  contact: {
    eyebrow: "Contact",
    title: "Got an idea?",
    desc: "Tell us about your project, we'll reply within 24 hours. The first call is always free.",
    name: "Full name",
    namePh: "Your name",
    email: "Email",
    company: "Company (optional)",
    companyPh: "Company name",
    project: "Your project",
    projectPh: "Briefly tell us what you'd like to build…",
    submit: "Send message",
    sentTitle: "Thank you!",
    sentDesc: "We got your message and will get back to you as soon as possible.",
  },
  cta: {
    desc: "Tell us your idea, we'll reply within 24 hours. The first call is free.",
    button: "Let's talk →",
    titles: {
      default: "Let's build your next project together",
      work: "Your next project belongs here",
      team: "Want to meet our team?",
    },
  },
  footer: {
    tagline: "A software studio building digital products from idea to scale.",
    services: { title: "Services", links: ["Web Platforms", "Mobile Apps", "AI", "Design"] },
    company: { title: "Company", links: ["About", "Work", "Team", "Contact"] },
    contact: { title: "Contact", links: ["merhaba@beystech.com", "Istanbul, Türkiye"] },
    rights: "All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
  },
  dock: { call: "Call", message: "Send message", mail: "Send email" },
  pages: {
    services: { eyebrow: "Services", title: "End-to-end digital product development", desc: "Not a single service — a team that owns every layer of your product. We flex to your needs." },
    work: { eyebrow: "Selected work", title: "Products we've shipped", desc: "A selection of projects we've taken from idea to launch. Each one tested with real users and built to scale." },
    team: { eyebrow: "Team & Culture", title: "Real people behind it", desc: "A small but fully capable team. You work directly with developers, no middle layer." },
    contact: { eyebrow: "Contact", title: "Got an idea?", desc: "Tell us about your project, we'll reply within 24 hours. The first call is always free." },
  },
};

const dictionaries: Record<Lang, Dict> = { tr, en };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void; t: Dict };
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("beystech-lang") as Lang | null;
      if (saved === "tr" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("beystech-lang", l);
    } catch {}
    document.documentElement.lang = l;
  }, []);

  const toggle = useCallback(() => setLang(lang === "tr" ? "en" : "tr"), [lang, setLang]);

  const value = useMemo<Ctx>(
    () => ({ lang, setLang, toggle, t: dictionaries[lang] }),
    [lang, setLang, toggle]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang, LanguageProvider içinde kullanılmalı");
  return ctx;
}
