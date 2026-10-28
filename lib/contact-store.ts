import "server-only";
import { Redis } from "@upstash/redis";
import type { ContactRequest, ContactReply } from "./contact-data";

function redisClient() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Contact storage is not configured");
  return new Redis({ url, token });
}

const itemKey = (id: string) => `beystech:contact:${id}`;
const INDEX = "beystech:contact:index";

export async function saveRequest(item: ContactRequest) {
  const redis = redisClient();
  const tx = redis.multi();
  tx.set(itemKey(item.id), { ...item, replies: undefined });
  tx.zadd(INDEX, { score: Date.now(), member: item.id });
  await tx.exec();
}

export async function listRequests(): Promise<ContactRequest[]> {
  const redis = redisClient();
  const ids = await redis.zrange<string[]>(INDEX, 0, 99, { rev: true });
  if (!ids.length) return [];
  const items = await redis.mget<(ContactRequest | null)[]>(...ids.map(itemKey));
  return Promise.all(items.filter((item): item is ContactRequest => item !== null).map(async (item) => ({
    ...item,
    replies: await redis.lrange<ContactReply>(`beystech:contact:replies:${item.id}`, 0, -1),
  })));
}

export async function getRequest(id: string) {
  return redisClient().get<ContactRequest>(itemKey(id));
}

export async function setDeliveryStatus(id: string, field: "acknowledgement" | "notification", status: "sent" | "failed") {
  const redis = redisClient();
  const script = `local v=redis.call('GET',KEYS[1]); if not v then return 0 end; local o=cjson.decode(v); o[ARGV[1]]=ARGV[2]; redis.call('SET',KEYS[1],cjson.encode(o)); return 1`;
  await redis.eval(script, [itemKey(id)], [field, status]);
}

export async function appendReply(id: string, reply: ContactReply) {
  const redis = redisClient();
  return redis.rpush(`beystech:contact:replies:${id}`, JSON.stringify(reply));
}

export async function setReplyStatus(id: string, replyId: string, status: "sent" | "failed") {
  const script = `local a=redis.call('LRANGE',KEYS[1],0,-1); for i,v in ipairs(a) do local r=cjson.decode(v); if r.id==ARGV[1] then r.status=ARGV[2]; redis.call('LSET',KEYS[1],i-1,cjson.encode(r)); return 1 end end; return 0`;
  return redisClient().eval(script, [`beystech:contact:replies:${id}`], [replyId, status]);
}
