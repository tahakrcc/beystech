"use client";

import { useEffect, useState } from "react";
import { Content, defaultContent } from "./content-data";

/**
 * /api/content'ten canlı içeriği çeker. İlk render'da varsayılan (tohum) içerik
 * gösterilir, sonra admin panelinden yapılan güncellemeler yüklenir.
 */
export function useContent(): Content {
  const [content, setContent] = useState<Content>(defaultContent);

  useEffect(() => {
    let alive = true;
    fetch("/api/content")
      .then((r) => r.json())
      .then((c: Content) => {
        if (alive && c && Array.isArray(c.works) && Array.isArray(c.team)) {
          setContent(c);
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return content;
}
