export interface Test {
  id: string;
  name: string;
  category: string;
  unit: string;
  normalmin: number;
  normalmax: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface UOM {
  id: string;
  name: string;
  description: string;
}
