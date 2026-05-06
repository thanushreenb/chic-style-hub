import { useProducts } from "./store";

export { type Product } from "./store";

const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?w=600&h=800&fit=crop&auto=format`;

type Seed = { name: string; brand: string; price: number; mrp: number; photo: string };

const build = (
  prefix: string,
  category: Product["category"],
  groups: Record<string, Seed[]>
): Product[] => {
  const out: Product[] = [];
  let i = 1;
  for (const [subcategory, items] of Object.entries(groups)) {
    for (const s of items) {
      out.push({
        id: `${prefix}${i++}`,
        name: s.name,
        brand: s.brand,
        price: s.price,
        mrp: s.mrp,
        image: img(s.photo),
        category,
        subcategory,
        fastDelivery: i % 2 === 0,
      });
    }
  }
  return out;
};

const MEN = build("m", "men", {
  Shirts: [
    { name: "Slim Fit Casual Shirt", brand: "Roadster", price: 799, mrp: 1999, photo: "photo-1602810318383-e386cc2a3ccf" },
    { name: "Linen Blend Shirt", brand: "H&M", price: 1299, mrp: 2499, photo: "photo-1564584217132-2271feaeb3c5" },
    { name: "Checked Cotton Shirt", brand: "Levis", price: 1499, mrp: 2999, photo: "photo-1603252109303-2751441dd157" },
    { name: "Oxford Button-Down", brand: "Arrow", price: 1399, mrp: 2799, photo: "photo-1596755094514-f87e34085b2c" },
    { name: "Printed Resort Shirt", brand: "Zara", price: 1599, mrp: 3199, photo: "photo-1618354691373-d851c5c3a990" },
    { name: "Mandarin Collar Shirt", brand: "Peter England", price: 999, mrp: 1999, photo: "photo-1620012253295-c15cc3e65df4" },
    { name: "White Formal Shirt", brand: "Van Heusen", price: 1199, mrp: 2399, photo: "photo-1598961942613-ba897716405b" },
    { name: "Denim Western Shirt", brand: "Wrangler", price: 1699, mrp: 3299, photo: "photo-1589310243389-96a5483213a8" },
  ],
  "T-Shirts": [
    { name: "Graphic Print T-Shirt", brand: "HRX", price: 499, mrp: 999, photo: "photo-1581655353564-df123a1eb820" },
    { name: "Solid Round Neck Tee", brand: "Puma", price: 699, mrp: 1499, photo: "photo-1521572163474-6864f9cf17ab" },
    { name: "Striped Polo T-Shirt", brand: "U.S. Polo", price: 999, mrp: 1999, photo: "photo-1583743814966-8936f5b7be1a" },
    { name: "Oversized Drop Shoulder Tee", brand: "Bewakoof", price: 599, mrp: 1299, photo: "photo-1576566588028-4147f3842f27" },
    { name: "V-Neck Cotton Tee", brand: "Jockey", price: 449, mrp: 899, photo: "photo-1503341504253-dff4815485f1" },
    { name: "Henley Long Sleeve", brand: "H&M", price: 899, mrp: 1799, photo: "photo-1554568218-0f1715e72254" },
    { name: "Marvel Print Tee", brand: "Kook N Keech", price: 799, mrp: 1599, photo: "photo-1622445275576-721325763afe" },
    { name: "Sports Active Tee", brand: "Nike", price: 1299, mrp: 2499, photo: "photo-1571945153237-4929e783af4a" },
  ],
  Jeans: [
    { name: "Slim Fit Blue Jeans", brand: "Levis", price: 1799, mrp: 3499, photo: "photo-1542272604-787c3835535d" },
    { name: "Distressed Skinny Jeans", brand: "Pepe", price: 1599, mrp: 2999, photo: "photo-1604176354204-9268737828e4" },
    { name: "Black Tapered Jeans", brand: "Wrangler", price: 1399, mrp: 2799, photo: "photo-1582552938357-32b906df40cb" },
    { name: "Straight Fit Indigo", brand: "Spykar", price: 1499, mrp: 2999, photo: "photo-1473966968600-fa801b869a1a" },
    { name: "Relaxed Boot Cut", brand: "Lee", price: 1899, mrp: 3699, photo: "photo-1555689502-c4b22d76c56f" },
    { name: "Light Wash Mom Jeans", brand: "Zara", price: 1999, mrp: 3999, photo: "photo-1541099649105-f69ad21f3246" },
    { name: "Stretch Fit Grey", brand: "Mufti", price: 1699, mrp: 3299, photo: "photo-1475178626620-a4d074967452" },
  ],
  Jackets: [
    { name: "Bomber Jacket", brand: "Tommy Hilfiger", price: 2499, mrp: 4999, photo: "photo-1591047139829-d91aecb6caea" },
    { name: "Denim Jacket", brand: "Levis", price: 2199, mrp: 4399, photo: "photo-1551537482-f2075a1d41f2" },
    { name: "Hooded Puffer Jacket", brand: "Adidas", price: 2999, mrp: 5999, photo: "photo-1544022613-e87ca75a784a" },
    { name: "Leather Biker Jacket", brand: "Allen Solly", price: 4999, mrp: 9999, photo: "photo-1520975954732-35dd22299614" },
    { name: "Quilted Vest", brand: "U.S. Polo", price: 1999, mrp: 3999, photo: "photo-1591047139756-eaff75e63955" },
    { name: "Wool Overcoat", brand: "Raymond", price: 5999, mrp: 11999, photo: "photo-1539533113208-f6df8cc8b543" },
  ],
  Footwear: [
    { name: "Running Sneakers", brand: "Nike", price: 3499, mrp: 6999, photo: "photo-1542291026-7eec264c27ff" },
    { name: "Casual Loafers", brand: "Clarks", price: 2799, mrp: 5499, photo: "photo-1533867617858-e7b97e060509" },
    { name: "Leather Formal Shoes", brand: "Hush Puppies", price: 2999, mrp: 5999, photo: "photo-1614252369475-531eba835eb1" },
    { name: "Canvas Sneakers", brand: "Converse", price: 2499, mrp: 4499, photo: "photo-1525966222134-fcfa99b8ae77" },
    { name: "Sports Trainers", brand: "Adidas", price: 3299, mrp: 6499, photo: "photo-1606107557195-0e29a4b5b4aa" },
    { name: "Slip-On Mules", brand: "Puma", price: 1999, mrp: 3999, photo: "photo-1560769629-975ec94e6a86" },
    { name: "Hiking Boots", brand: "Woodland", price: 4499, mrp: 7999, photo: "photo-1606744824163-985d376605aa" },
  ],
  Accessories: [
    { name: "Leather Wallet", brand: "Wildhorn", price: 599, mrp: 1499, photo: "photo-1627123424574-724758594e93" },
    { name: "Aviator Sunglasses", brand: "Ray-Ban", price: 3999, mrp: 7999, photo: "photo-1572635196237-14b3f281503f" },
    { name: "Analog Watch", brand: "Fossil", price: 4999, mrp: 9999, photo: "photo-1524592094714-0f0654e20314" },
    { name: "Leather Belt", brand: "Tommy Hilfiger", price: 1299, mrp: 2599, photo: "photo-1624222247344-550fb60583dc" },
    { name: "Woolen Cap", brand: "Roadster", price: 499, mrp: 999, photo: "photo-1576871337622-98d48d1cf531" },
    { name: "Travel Backpack", brand: "Skybags", price: 1999, mrp: 3999, photo: "photo-1553062407-98eeb64c6a62" },
    { name: "Silk Tie", brand: "Park Avenue", price: 799, mrp: 1599, photo: "photo-1589756823695-278bc923f962" },
  ],
});

const WOMEN = build("w", "women", {
  Dresses: [
    { name: "Floral Maxi Dress", brand: "Zara", price: 1899, mrp: 3499, photo: "photo-1572804013309-59a88b7e92f1" },
    { name: "Bodycon Party Dress", brand: "Vero Moda", price: 1499, mrp: 2999, photo: "photo-1595777457583-95e059d581b8" },
    { name: "A-Line Summer Dress", brand: "H&M", price: 1199, mrp: 2299, photo: "photo-1490481651871-ab68de25d43d" },
    { name: "Wrap Midi Dress", brand: "Mango", price: 1799, mrp: 3599, photo: "photo-1539008835657-9e8e9680c956" },
    { name: "Off-Shoulder Maxi", brand: "Forever 21", price: 1599, mrp: 3199, photo: "photo-1496217590455-aa63a8350eea" },
    { name: "Polka Dot Dress", brand: "Sangria", price: 1399, mrp: 2799, photo: "photo-1502716119720-b23a93e5fe1b" },
    { name: "Sequin Cocktail Dress", brand: "AND", price: 2999, mrp: 5999, photo: "photo-1566174053879-31528523f8ae" },
    { name: "Lace Evening Gown", brand: "Chemistry", price: 3499, mrp: 6999, photo: "photo-1585487000160-6ebcfceb0d03" },
  ],
  Tops: [
    { name: "Crop Top Blouse", brand: "Forever 21", price: 699, mrp: 1499, photo: "photo-1564257631407-4deb1f99d992" },
    { name: "Off-Shoulder Top", brand: "Mango", price: 899, mrp: 1799, photo: "photo-1551048632-24e444b48a3e" },
    { name: "Ribbed Knit Top", brand: "Zara", price: 1099, mrp: 2199, photo: "photo-1485518882345-15568b007407" },
    { name: "Tie-Front Blouse", brand: "H&M", price: 999, mrp: 1999, photo: "photo-1503342217505-b0a15ec3261c" },
    { name: "Puff Sleeve Top", brand: "Vero Moda", price: 1199, mrp: 2399, photo: "photo-1554568218-0f1715e72254" },
    { name: "Sheer Mesh Top", brand: "Only", price: 899, mrp: 1799, photo: "photo-1583496661160-fb5886a13d75" },
    { name: "Cami Silk Top", brand: "AND", price: 1299, mrp: 2599, photo: "photo-1517423568366-8b83523034fd" },
  ],
  Sarees: [
    { name: "Banarasi Silk Saree", brand: "Sangria", price: 2499, mrp: 4999, photo: "photo-1610030469983-98e550d6193c" },
    { name: "Georgette Printed Saree", brand: "Mitera", price: 1799, mrp: 3499, photo: "photo-1583391733956-6c78276477e2" },
    { name: "Embroidered Party Saree", brand: "Inddus", price: 2999, mrp: 5999, photo: "photo-1610189025357-ad29df537ed9" },
    { name: "Chiffon Floral Saree", brand: "Saree Mall", price: 1599, mrp: 3199, photo: "photo-1591193686104-fddba4d0c4a5" },
    { name: "Cotton Handloom Saree", brand: "Fabindia", price: 1999, mrp: 3999, photo: "photo-1610189019594-c20ed8da2a4f" },
    { name: "Designer Lehenga Saree", brand: "Inddus", price: 4999, mrp: 9999, photo: "photo-1610030181087-540017dc9d61" },
  ],
  Kurtas: [
    { name: "Anarkali Kurta Set", brand: "Biba", price: 1999, mrp: 3999, photo: "photo-1610189019857-1a7b09d76d24" },
    { name: "Straight Fit Cotton Kurta", brand: "W", price: 999, mrp: 1999, photo: "photo-1583391733956-6c78276477e2" },
    { name: "Printed Kurti & Palazzo", brand: "Aurelia", price: 1499, mrp: 2999, photo: "photo-1610189025357-ad29df537ed9" },
    { name: "Embroidered A-line Kurta", brand: "Sangria", price: 1799, mrp: 3599, photo: "photo-1610030469983-98e550d6193c" },
    { name: "Festive Kurta Pant Dupatta", brand: "Libas", price: 2499, mrp: 4999, photo: "photo-1610189019594-c20ed8da2a4f" },
    { name: "Sharara Suit Set", brand: "Inddus", price: 3499, mrp: 6999, photo: "photo-1610030181087-540017dc9d61" },
  ],
  Footwear: [
    { name: "Block Heel Sandals", brand: "Catwalk", price: 1499, mrp: 2999, photo: "photo-1543163521-1bf539c55dd2" },
    { name: "Ballerina Flats", brand: "Mochi", price: 1199, mrp: 2399, photo: "photo-1581101767113-d4f8b4b68f44" },
    { name: "White Sneakers", brand: "Adidas", price: 2999, mrp: 5999, photo: "photo-1595950653106-6c9ebd614d3a" },
    { name: "Stiletto Heels", brand: "Steve Madden", price: 3499, mrp: 6999, photo: "photo-1518049362265-d5b2a6467637" },
    { name: "Wedge Sandals", brand: "Bata", price: 1799, mrp: 3499, photo: "photo-1539109136881-3be0616acf4b" },
    { name: "Embellished Mojaris", brand: "Fabindia", price: 1599, mrp: 3199, photo: "photo-1597248374161-426f3d6cda84" },
  ],
  Accessories: [
    { name: "Leather Handbag", brand: "Lavie", price: 2499, mrp: 4999, photo: "photo-1584917865442-de89df76afd3" },
    { name: "Statement Earrings", brand: "Accessorize", price: 599, mrp: 1199, photo: "photo-1535632787350-4e68ef0ac584" },
    { name: "Cat-Eye Sunglasses", brand: "Vogue", price: 2999, mrp: 5999, photo: "photo-1572635196237-14b3f281503f" },
    { name: "Silk Scarf", brand: "Zara", price: 899, mrp: 1799, photo: "photo-1584030373081-f37b7bb4fa8e" },
    { name: "Pearl Necklace", brand: "Tanishq", price: 4999, mrp: 9999, photo: "photo-1611652022419-a9419f74343d" },
    { name: "Tote Bag", brand: "H&M", price: 1499, mrp: 2999, photo: "photo-1591561954557-26941169b49e" },
  ],
});

const KIDS = build("k", "kids", {
  Toys: [
    { name: "Wooden Building Blocks", brand: "Funskool", price: 799, mrp: 1499, photo: "photo-1558877385-81a1c7e67d72" },
    { name: "Plush Teddy Bear", brand: "Hamleys", price: 999, mrp: 1999, photo: "photo-1584473457493-17c4c24290c5" },
    { name: "Remote Control Car", brand: "Maisto", price: 1499, mrp: 2999, photo: "photo-1545558014-8692077e9b5c" },
    { name: "Lego Building Set", brand: "Lego", price: 1999, mrp: 3499, photo: "photo-1587654780291-39c9404d746b" },
    { name: "Doll House Playset", brand: "Barbie", price: 2499, mrp: 4999, photo: "photo-1558877385-8c1f1be21abb" },
    { name: "Puzzle Game Board", brand: "Funskool", price: 599, mrp: 1199, photo: "photo-1611604548018-d56bbd85d681" },
    { name: "Soft Building Blocks", brand: "Fisher-Price", price: 899, mrp: 1799, photo: "photo-1596461404969-9ae70f2830c1" },
    { name: "Musical Keyboard Toy", brand: "Chicco", price: 1799, mrp: 3499, photo: "photo-1587825140708-dfaf72ae4b04" },
  ],
  Clothing: [
    { name: "Cotton T-Shirt & Shorts Set", brand: "Mothercare", price: 699, mrp: 1399, photo: "photo-1622290291468-a28f7a7dc6a8" },
    { name: "Printed Frock Dress", brand: "Carter's", price: 899, mrp: 1799, photo: "photo-1518831959646-742c3a14ebf7" },
    { name: "Hooded Sweatshirt", brand: "H&M Kids", price: 999, mrp: 1899, photo: "photo-1519278409-1f56fdda7fe5" },
    { name: "Party Wear Dress", brand: "Carter's", price: 1299, mrp: 2599, photo: "photo-1471286174890-9c112ffca5b4" },
    { name: "Denim Overalls", brand: "Mothercare", price: 1099, mrp: 2199, photo: "photo-1503944583220-79d8926ad5e2" },
    { name: "Winter Sweater", brand: "Gap Kids", price: 899, mrp: 1799, photo: "photo-1545194445-dddb8f4487c6" },
    { name: "Cotton Pyjama Set", brand: "Babyhug", price: 599, mrp: 1199, photo: "photo-1620812097820-f63c33b1bc99" },
    { name: "Ethnic Kurta Pyjama", brand: "Fabindia", price: 1499, mrp: 2999, photo: "photo-1622290291468-a28f7a7dc6a8" },
    { name: "Rainbow Leggings", brand: "Cherry Crumble", price: 499, mrp: 999, photo: "photo-1503944583220-79d8926ad5e2" },
  ],
  Footwear: [
    { name: "Velcro Sneakers", brand: "Nike Kids", price: 1499, mrp: 2999, photo: "photo-1514989940723-e8e51635b782" },
    { name: "Rainbow Sandals", brand: "Crocs", price: 999, mrp: 1799, photo: "photo-1551107696-a4b0c5a0d9a2" },
    { name: "Light-Up School Shoes", brand: "Bata", price: 1199, mrp: 2299, photo: "photo-1576672843344-f01907a9d40c" },
    { name: "Cartoon Slip-Ons", brand: "Disney", price: 799, mrp: 1599, photo: "photo-1560769629-975ec94e6a86" },
    { name: "Sports Trainers", brand: "Puma Kids", price: 1799, mrp: 3499, photo: "photo-1606107557195-0e29a4b5b4aa" },
    { name: "Rain Boots", brand: "Crocs", price: 1299, mrp: 2599, photo: "photo-1606744824163-985d376605aa" },
  ],
  Accessories: [
    { name: "Cartoon Backpack", brand: "Skybags", price: 899, mrp: 1799, photo: "photo-1553062407-98eeb64c6a62" },
    { name: "Kids Sunglasses", brand: "Babyhug", price: 399, mrp: 799, photo: "photo-1577803645773-f96470509666" },
    { name: "Animal Cap", brand: "H&M Kids", price: 499, mrp: 999, photo: "photo-1519415943484-9fa1873496d4" },
    { name: "Character Water Bottle", brand: "Hamleys", price: 599, mrp: 1199, photo: "photo-1602143407151-7111542de6e8" },
    { name: "Hair Clip Set", brand: "Accessorize", price: 299, mrp: 599, photo: "photo-1535632787350-4e68ef0ac584" },
    { name: "Lunch Box Combo", brand: "Milton", price: 799, mrp: 1599, photo: "photo-1604335399105-a0c585fd81a1" },
  ],
  Sportswear: [
    { name: "Football Jersey", brand: "Nike Kids", price: 1299, mrp: 2599, photo: "photo-1571945153237-4929e783af4a" },
    { name: "Track Pants", brand: "Adidas Kids", price: 999, mrp: 1999, photo: "photo-1556906781-9a412961c28c" },
    { name: "Swim Trunks", brand: "Speedo", price: 799, mrp: 1599, photo: "photo-1581101767113-d4f8b4b68f44" },
    { name: "Cycling Shorts", brand: "Puma Kids", price: 699, mrp: 1399, photo: "photo-1556906781-9a412961c28c" },
    { name: "Athletic Tee", brand: "Reebok Kids", price: 599, mrp: 1199, photo: "photo-1571945153237-4929e783af4a" },
    { name: "Yoga Set for Kids", brand: "Decathlon", price: 1199, mrp: 2399, photo: "photo-1518611012118-696072aa579a" },
  ],
});

export const PRODUCTS: Product[] = [...MEN, ...WOMEN, ...KIDS];

export const CATEGORIES = {
  men: { label: "Men", subcategories: ["Shirts", "T-Shirts", "Jeans", "Jackets", "Footwear", "Accessories"] },
  women: { label: "Women", subcategories: ["Dresses", "Tops", "Sarees", "Kurtas", "Footwear", "Accessories"] },
  kids: { label: "Kids", subcategories: ["Toys", "Clothing", "Footwear", "Accessories", "Sportswear"] },
} as const;

// Hook to get all products including custom ones
export function useAllProducts() {
  const { customProducts } = useProducts();
  return [...PRODUCTS, ...customProducts];
}
