export type ScanStatus = 'pending' | 'completed' | 'failed';

export type ScanAnalysis = {
  meal_name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  grade: string;
  suggestions: string[];
};

export type Scan = {
  id: string;
  image_urls: string[];
  analysis: ScanAnalysis | null;
  status: ScanStatus;
  created_at: string;
};
