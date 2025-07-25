export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  modelType: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptFilters {
  category?: string;
  modelType?: string;
  searchQuery?: string;
}

export const CATEGORIES = [
  "نوشتن",
  "طراحی", 
  "کدنویسی",
  "تبلیغات",
  "آموزش",
  "تحلیل",
  "خلاقیت",
  "کسب و کار"
] as const;

export const MODEL_TYPES = [
  "ChatGPT",
  "Midjourney", 
  "Claude",
  "Gemini",
  "DALL-E",
  "Stable Diffusion",
  "سایر"
] as const;