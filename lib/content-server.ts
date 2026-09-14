import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { Content, defaultContent } from "./content-data";

const KEY = "beystech:content";
const FILE = path.join(process.cwd(), "data", "content.json");

/**
 * İçerik deposu:
 * - Vercel/Upstash env değişkenleri varsa → Redis (prod, kalıcı).
 * - Yoksa → yerel data/content.json dosyası (lokal geliştirme).
 */
function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

function isValid(c: unknown): c is Content {
  const v = c as Content;
  return !!v && Array.isArray(v.works) && Array.isArray(v.team);
}

function readFile(): Content {
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (isValid(parsed)) return parsed;
  } catch {
    // yok/bozuk → varsayılan
  }
  return defaultContent;
}

export async function readContent(): Promise<Content> {
  const redis = getRedis();
  if (redis) {
    try {
      const data = await redis.get<Content>(KEY);
      if (isValid(data)) return data;
      // İlk çalıştırma: tohum içeriği yaz
      await redis.set(KEY, defaultContent);
      return defaultContent;
    } catch {
      return readFile();
    }
  }
  return readFile();
}

export async function writeContent(content: Content): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(KEY, content);
    return;
  }
  const dir = path.dirname(FILE);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(content, null, 2), "utf8");
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "beystech2025";
}
