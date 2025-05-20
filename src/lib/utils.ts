import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ConversationMessage } from "./openai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const sanitizeInput = (text: string) => text.replace(/<[^>]*>?/gm, "");
export const formatHistory = (history: ConversationMessage[]) =>
  history
    .map(
      (msg) =>
        `${msg.role === "assistant" ? "Interviewer" : "Candidate"}: ${
          msg.content
        }`
    )
    .join("\n");

export function handleGenerationError(error: any): void {
  console.error("API Error:", error);

  if (error?.status === 401) {
    throw new Error("Invalid API credentials");
  }
  if (error?.status === 429) {
    throw new Error("API rate limit exceeded. Please wait before retrying.");
  }
  if (error?.status >= 500) {
    throw new Error("Service temporarily unavailable");
  }
}
