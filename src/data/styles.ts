export type TryOnStyle = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  prompt: string;
  price: number;
  productName: string;
  availableColors: string[];
};

export const STYLES: TryOnStyle[] = [
  {
    id: "long-straight",
    name: "Long Straight",
    category: "style",
    description: "Sleek, smooth, and timeless. Perfect length for a polished everyday look.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop",
    prompt: "Transform the person's hair into long, straight, sleek hair that falls smoothly past the shoulders. Keep the exact same face, skin tone, and identity. Professional studio lighting, realistic hair texture, high quality portrait photography, natural look.",
    price: 12999,
    productName: "LustraHair Signature Straight",
    availableColors: ["Black", "Dark Brown", "Chestnut", "Blonde"],
  },
  {
    id: "beach-waves",
    name: "Beach Waves",
    category: "style",
    description: "Effortless, textured waves with a natural sun-kissed finish.",
    image: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&h=600&fit=crop",
    prompt: "Transform the person's hair into loose, natural beach waves with soft texture and movement. Keep the exact same face, skin tone, and identity. Slightly windswept, natural volume, professional portrait, realistic hair strands, high quality.",
    price: 14999,
    productName: "LustraHair Ocean Waves",
    availableColors: ["Honey Blonde", "Caramel", "Brunette", "Black"],
  },
  {
    id: "curly",
    name: "Voluminous Curls",
    category: "style",
    description: "Bouncy, defined curls that add volume and personality.",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=600&fit=crop",
    prompt: "Transform the person's hair into voluminous, defined curly hair with natural curl pattern and bounce. Keep the exact same face, skin tone, and identity. Defined curls, healthy hair shine, professional portrait, realistic texture, high quality.",
    price: 15999,
    productName: "LustraHair Curl Collection",
    availableColors: ["Natural Black", "Chestnut", "Auburn", "Honey"],
  },
  {
    id: "bob",
    name: "Classic Bob",
    category: "style",
    description: "Sharp, chic, and modern. A timeless bob that frames the face beautifully.",
    image: "https://images.unsplash.com/photo-1608877607386-8698047d65a9?w=600&h=600&fit=crop",
    prompt: "Transform the person's hair into a classic, sharp bob cut that ends around the jawline. Keep the exact same face, skin tone, and identity. Clean lines, smooth finish, professional portrait, realistic hair texture, high quality.",
    price: 11999,
    productName: "LustraHair Precision Bob",
    availableColors: ["Jet Black", "Dark Brown", "Platinum Blonde", "Copper"],
  },
  {
    id: "layered",
    name: "Long Layers",
    category: "style",
    description: "Soft layers that add movement, dimension, and easy styling.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=600&fit=crop",
    prompt: "Transform the person's hair into long hair with soft, natural layers that add movement and dimension. Keep the exact same face, skin tone, and identity. Layered ends, natural volume, professional portrait, realistic hair strands, high quality.",
    price: 13999,
    productName: "LustraHair Layer Luxe",
    availableColors: ["Natural Brown", "Ash Blonde", "Black", "Chestnut"],
  },
  {
    id: "pixie",
    name: "Textured Pixie",
    category: "style",
    description: "Short, textured, and effortlessly stylish for a bold new look.",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=600&fit=crop",
    prompt: "Transform the person's hair into a short, textured pixie cut with piecey, modern styling. Keep the exact same face, skin tone, and identity. Textured top, tapered sides, professional portrait, realistic hair texture, high quality.",
    price: 9999,
    productName: "LustraHair Pixie Play",
    availableColors: ["Silver Grey", "Platinum", "Black", "Copper"],
  },
  {
    id: "black",
    name: "Jet Black",
    category: "color",
    description: "Rich, deep black with natural shine and incredible depth.",
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&h=600&fit=crop",
    prompt: "Change the person's hair color to rich, deep jet black while keeping the same hairstyle, face, skin tone, and identity. Deep black color, natural shine, professional portrait, realistic hair color, high quality.",
    price: 8999,
    productName: "LustraHair Noir Collection",
    availableColors: ["Jet Black", "Soft Black", "Espresso"],
  },
  {
    id: "brunette",
    name: "Warm Brunette",
    category: "color",
    description: "Luscious warm brown tones with natural dimension and richness.",
    image: "https://images.unsplash.com/photo-1554519515-242161756769?w=600&h=600&fit=crop",
    prompt: "Change the person's hair color to warm, luscious brunette brown tones while keeping the same hairstyle, face, skin tone, and identity. Warm brown color, natural dimension, highlights, professional portrait, realistic hair color, high quality.",
    price: 9999,
    productName: "LustraHair Mocha Glow",
    availableColors: ["Light Brown", "Medium Brown", "Dark Brown", "Caramel"],
  },
  {
    id: "blonde",
    name: "Golden Blonde",
    category: "color",
    description: "Sun-kissed blonde with soft highlights and a luminous finish.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop",
    prompt: "Change the person's hair color to beautiful golden blonde with soft, natural highlights while keeping the same hairstyle, face, skin tone, and identity. Golden blonde color, sun-kissed highlights, luminous finish, professional portrait, realistic hair color, high quality.",
    price: 10999,
    productName: "LustraHair Golden Hour",
    availableColors: ["Platinum Blonde", "Honey Blonde", "Dirty Blonde", "Ash Blonde"],
  },
];

export const PRODUCTS = [
  {
    id: "signature-waves",
    name: "LustraHair Signature Waves",
    price: 12999,
    description: "Premium Human Hair Collection with natural wave pattern. Made from 100% ethically sourced human hair with invisible hand-tied knots for the most natural look.",
    availableColors: ["Black", "Dark Brown", "Chestnut", "Blonde"],
    rating: 4.8,
    reviews: 342,
  },
  {
    id: "straight-luxe",
    name: "LustraHair Straight Luxe",
    price: 11999,
    description: "Silky smooth straight hair extensions with a natural shine. Premium quality human hair that blends seamlessly with your own.",
    availableColors: ["Jet Black", "Dark Brown", "Medium Brown", "Blonde"],
    rating: 4.7,
    reviews: 256,
  },
  {
    id: "curl-creations",
    name: "LustraHair Curl Creations",
    price: 14999,
    description: "Bouncy, defined curls made from premium virgin human hair. Perfect for adding volume and texture to your look.",
    availableColors: ["Natural Black", "Chestnut", "Auburn", "Honey Blonde"],
    rating: 4.9,
    reviews: 189,
  },
  {
    id: "bob-basics",
    name: "LustraHair Bob Basics",
    price: 9999,
    description: "Chic bob wig with a natural hairline. Lightweight and comfortable for all-day wear with a realistic scalp appearance.",
    availableColors: ["Jet Black", "Dark Brown", "Platinum Blonde", "Copper"],
    rating: 4.6,
    reviews: 178,
  },
];

export function getStyleById(id: string): TryOnStyle | undefined {
  return STYLES.find((s) => s.id === id);
}
