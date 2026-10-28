export type ContactReply = { id: string; message: string; sentAt: string; status: "pending" | "sent" | "failed" };
export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  message: string;
  language: "tr" | "en";
  createdAt: string;
  acknowledgement: "sent" | "failed" | "pending";
  notification: "sent" | "failed" | "pending";
  replies: ContactReply[];
};
