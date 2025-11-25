export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  commissionRate: number; // e.g., 0.2 for 20%
}

export interface Task {
  id: number;
  title: string;
  subtitle: string;
  minPrice: number;
  maxPrice: number;
  products: Product[];
  coverImage: string;
  isSpecial?: boolean; // New property for Special Tasks
}

export interface CalculationResult {
  price: number;
  commission: number;
  total: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
}