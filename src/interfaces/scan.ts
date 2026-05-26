export type ScanAnalysis = {
  meal_name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

export type Scan = {
  id: string;
  image_urls: string[];
  analysis: ScanAnalysis;
  created_at: string;
};
