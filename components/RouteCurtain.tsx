"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark } from "./Logo";

/**
 * Sayfa değiştiğinde ekranı koyu bir perdeyle kaplayıp, ortada akan gradyanlı
 * Beystech logosunu gösterip yukarı süzülerek yeni sayfayı ortaya çıkarır.
 * pointer-events: none olduğundan tıklamayı engellemez.
 */
const EASE = [0.83, 0, 0.17, 1] as const;

export default function RouteCurtain() {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);
  const first = useFirstRender();

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  if (first) return null;

  return (
    <AnimatePresence mode="wait">
      <div key={key} className="pointer-events-none fixed inset-0 z-[100]">
        {/* Koyu perde — aşağıdan yukarı toplanır */}
        <motion.div
          className="absolute inset-0 origin-top"
          style={{ background: "var(--bg-soft)" }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        />
        {/* İnce gradyan çizgi — perdenin alt kenarı */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[3px] origin-top"
          style={{ background: "linear-gradient(90deg, var(--accent-3), var(--accent), var(--accent-2))" }}
          initial={{ scaleY: 1, opacity: 1 }}
          animate={{ scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        />
        {/* Ortada logo — belirir sonra kaybolur */}
        <motion.div
          className="absolute inset-0 grid place-items-center"
          initial={{ opacity: 0, scale: 0.7, filter: "blur(6px)" }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.7, 1, 1, 1.12], filter: "blur(0px)" }}
          transition={{ duration: 0.95, ease: "easeOut", times: [0, 0.3, 0.6, 1] }}
        >
          <LogoMark size={72} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function useFirstRender() {
  const [first, setFirst] = useState(true);
  useEffect(() => setFirst(false), []);
  return first;
}
