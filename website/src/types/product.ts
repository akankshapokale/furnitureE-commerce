export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  description?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Luna 3-Seater Sofa",
    category: "Sofas",
    price: 24999,
    oldPrice: 29999,
    discount: 17,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    description:
      "A comfortable modern 3-seater sofa designed for contemporary living spaces.",
  },
  {
    id: 2,
    name: "Milo Lounge Chair",
    category: "Chairs",
    price: 8499,
    oldPrice: 10999,
    discount: 23,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
    description:
      "A stylish lounge chair with a comfortable design for relaxing spaces.",
  },
  {
    id: 3,
    name: "Oakline Coffee Table",
    category: "Tables",
    price: 6999,
    oldPrice: 8499,
    discount: 18,
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc",
    description:
      "A premium wooden coffee table with a clean and minimal design.",
  },
  {
    id: 4,
    name: "Nordic King Bed",
    category: "Beds",
    price: 32999,
    oldPrice: 39999,
    discount: 18,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    description:
      "A modern king-size bed designed for comfort and elegant bedrooms.",
  },
  {
    id: 5,
    name: "Aurelia Dining Table",
    category: "Tables",
    price: 18999,
    oldPrice: 22999,
    discount: 17,
    image: "https://images.unsplash.com/photo-1617098900591-3f90928e8c54",
    description:
      "A premium dining table crafted for modern dining spaces.",
  },
  {
    id: 6,
    name: "Madera Wardrobe",
    category: "Wardrobes",
    price: 28999,
    oldPrice: 34999,
    discount: 17,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2",
    description:
      "A spacious wardrobe with a modern wooden finish and elegant styling.",
  },
  {
    id: 7,
    name: "Arlo Accent Chair",
    category: "Chairs",
    price: 9499,
    oldPrice: 11999,
    discount: 21,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91",
    description:
      "A contemporary accent chair that adds character to any room.",
  },
  {
    id: 8,
    name: "Elara Queen Bed",
    category: "Beds",
    price: 27999,
    oldPrice: 32999,
    discount: 15,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    description:
      "A refined queen-size bed with a comfortable and timeless design.",
  },
];