export interface CreateAdInput {
  title: string;
  price: number;
  imageBase64?: string;
}

export interface AdRecord {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  createdAt: string;
}
