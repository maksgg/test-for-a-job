export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Review {
  rating: number; // На практиці тут зазвичай літерал 1 | 2 | 3 | 4 | 5
  comment: string;
  date: string; // ISO Date string
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  barcode: string;
  qrCode: string; // URL string
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: "In Stock" | "Low Stock" | "Out of Stock" | string; // Можна звузити до літералів, якщо статусів обмежена кількість
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  images: string[]; // Масив URL-адрес
  thumbnail: string; // URL-адреса
}

// Якщо ти отримуєш масив (як у твоєму JSON)
export type ProductList = Product[];
