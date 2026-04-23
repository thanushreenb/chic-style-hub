export type Product = {
  id: string;
  name: string;
  price: number;
  mrp: number;
  brand: string;
  image: string;
  category: "men" | "women" | "kids";
  subcategory: string;
};

const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?w=600&h=800&fit=crop&auto=format`;

export const PRODUCTS: Product[] = [
  // MEN - Shirts
  { id: "m1", name: "Slim Fit Casual Shirt", brand: "Roadster", price: 799, mrp: 1999, image: img("photo-1602810318383-e386cc2a3ccf"), category: "men", subcategory: "Shirts" },
  { id: "m2", name: "Linen Blend Shirt", brand: "H&M", price: 1299, mrp: 2499, image: img("photo-1564584217132-2271feaeb3c5"), category: "men", subcategory: "Shirts" },
  { id: "m3", name: "Checked Cotton Shirt", brand: "Levis", price: 1499, mrp: 2999, image: img("photo-1603252109303-2751441dd157"), category: "men", subcategory: "Shirts" },
  // MEN - T-Shirts
  { id: "m4", name: "Graphic Print T-Shirt", brand: "HRX", price: 499, mrp: 999, image: img("photo-1581655353564-df123a1eb820"), category: "men", subcategory: "T-Shirts" },
  { id: "m5", name: "Solid Round Neck Tee", brand: "Puma", price: 699, mrp: 1499, image: img("photo-1521572163474-6864f9cf17ab"), category: "men", subcategory: "T-Shirts" },
  { id: "m6", name: "Striped Polo T-Shirt", brand: "U.S. Polo", price: 999, mrp: 1999, image: img("photo-1583743814966-8936f5b7be1a"), category: "men", subcategory: "T-Shirts" },
  // MEN - Jeans
  { id: "m7", name: "Slim Fit Blue Jeans", brand: "Levis", price: 1799, mrp: 3499, image: img("photo-1542272604-787c3835535d"), category: "men", subcategory: "Jeans" },
  { id: "m8", name: "Distressed Skinny Jeans", brand: "Pepe", price: 1599, mrp: 2999, image: img("photo-1604176354204-9268737828e4"), category: "men", subcategory: "Jeans" },
  { id: "m9", name: "Black Tapered Jeans", brand: "Wrangler", price: 1399, mrp: 2799, image: img("photo-1582552938357-32b906df40cb"), category: "men", subcategory: "Jeans" },

  // WOMEN - Dresses
  { id: "w1", name: "Floral Maxi Dress", brand: "Zara", price: 1899, mrp: 3499, image: img("photo-1572804013309-59a88b7e92f1"), category: "women", subcategory: "Dresses" },
  { id: "w2", name: "Bodycon Party Dress", brand: "Vero Moda", price: 1499, mrp: 2999, image: img("photo-1595777457583-95e059d581b8"), category: "women", subcategory: "Dresses" },
  { id: "w3", name: "A-Line Summer Dress", brand: "H&M", price: 1199, mrp: 2299, image: img("photo-1490481651871-ab68de25d43d"), category: "women", subcategory: "Dresses" },
  // WOMEN - Tops
  { id: "w4", name: "Crop Top Blouse", brand: "Forever 21", price: 699, mrp: 1499, image: img("photo-1564257631407-4deb1f99d992"), category: "women", subcategory: "Tops" },
  { id: "w5", name: "Off-Shoulder Top", brand: "Mango", price: 899, mrp: 1799, image: img("photo-1551048632-24e444b48a3e"), category: "women", subcategory: "Tops" },
  { id: "w6", name: "Ribbed Knit Top", brand: "Zara", price: 1099, mrp: 2199, image: img("photo-1485518882345-15568b007407"), category: "women", subcategory: "Tops" },
  // WOMEN - Sarees
  { id: "w7", name: "Banarasi Silk Saree", brand: "Sangria", price: 2499, mrp: 4999, image: img("photo-1610030469983-98e550d6193c"), category: "women", subcategory: "Sarees" },
  { id: "w8", name: "Georgette Printed Saree", brand: "Mitera", price: 1799, mrp: 3499, image: img("photo-1583391733956-6c78276477e2"), category: "women", subcategory: "Sarees" },
  { id: "w9", name: "Embroidered Party Saree", brand: "Inddus", price: 2999, mrp: 5999, image: img("photo-1610189025357-ad29df537ed9"), category: "women", subcategory: "Sarees" },

  // KIDS - Toys
  { id: "k1", name: "Wooden Building Blocks", brand: "Funskool", price: 799, mrp: 1499, image: img("photo-1558877385-81a1c7e67d72"), category: "kids", subcategory: "Toys" },
  { id: "k2", name: "Plush Teddy Bear", brand: "Hamleys", price: 999, mrp: 1999, image: img("photo-1584473457493-17c4c24290c5"), category: "kids", subcategory: "Toys" },
  { id: "k3", name: "Remote Control Car", brand: "Maisto", price: 1499, mrp: 2999, image: img("photo-1545558014-8692077e9b5c"), category: "kids", subcategory: "Toys" },
  // KIDS - Clothing
  { id: "k4", name: "Cotton T-Shirt & Shorts Set", brand: "Mothercare", price: 699, mrp: 1399, image: img("photo-1622290291468-a28f7a7dc6a8"), category: "kids", subcategory: "Clothing" },
  { id: "k5", name: "Printed Frock Dress", brand: "Carter's", price: 899, mrp: 1799, image: img("photo-1518831959646-742c3a14ebf7"), category: "kids", subcategory: "Clothing" },
  { id: "k6", name: "Hooded Sweatshirt", brand: "H&M Kids", price: 999, mrp: 1899, image: img("photo-1519278409-1f56fdda7fe5"), category: "kids", subcategory: "Clothing" },
  // KIDS - Footwear
  { id: "k7", name: "Velcro Sneakers", brand: "Nike Kids", price: 1499, mrp: 2999, image: img("photo-1514989940723-e8e51635b782"), category: "kids", subcategory: "Footwear" },
  { id: "k8", name: "Rainbow Sandals", brand: "Crocs", price: 999, mrp: 1799, image: img("photo-1551107696-a4b0c5a0d9a2"), category: "kids", subcategory: "Footwear" },
  { id: "k9", name: "Light-Up School Shoes", brand: "Bata", price: 1199, mrp: 2299, image: img("photo-1576672843344-f01907a9d40c"), category: "kids", subcategory: "Footwear" },
];

export const CATEGORIES = {
  men: { label: "Men", subcategories: ["Shirts", "T-Shirts", "Jeans"] },
  women: { label: "Women", subcategories: ["Dresses", "Tops", "Sarees"] },
  kids: { label: "Kids", subcategories: ["Toys", "Clothing", "Footwear"] },
} as const;
