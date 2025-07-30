export interface PromptVersion {
  id: string;
  title: string;
  content: string;
  category: string;
  model_types: string[];
  tags: string[];
  timestamp: Date;
  changeNote?: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  model_types: string[];
  tags: string[];
  is_favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  versions?: PromptVersion[];
}

export interface PromptFilters {
  category?: string;
  model_types?: string[];
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