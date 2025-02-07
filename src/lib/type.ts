export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  image: { asset: { url: string } };
  price: number;
  quantity: number;
  tags?: string[];
  description?: string;
  features?: string[];
  dimensions?: {
    height?: string;
    width?: string;
    depth?: string;
  };
  category?: { name: string };
}
