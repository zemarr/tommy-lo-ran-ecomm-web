export interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  priceValue: number;
  image: string;
  images: string[];
  description: string;
  longDescription: string;
  options?: string[];
  features: string[];
  materials: string[];
  deliveryTime: string;
  popularity?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  priceValue: number;
  image: string;
  images: string[];
  description: string;
  longDescription: string;
  options?: string[];
  features: string[];
  materials: string[];
  deliveryTime: string;
  popularity?: number;
}

export const services: Service[] = [
  {
    id: "two-three-piece-outfits",
    name: "Two & Three Piece Outfits",
    category: "BESPOKE NATIVE WEAR",
    price: "From NGN80,000 - NGN250,000",
    priceValue: 80000,
    image: "https://otunbastore.com/cdn/shop/products/il_fullxfull.5309513943_fflz.jpg?v=1698360162",
    images: [
      "https://otunbastore.com/cdn/shop/products/il_fullxfull.5309513943_fflz.jpg?v=1698360162",
      "https://i.etsystatic.com/46223954/r/il/defc7e/7502727542/il_fullxfull.7502727542_mxu0.jpg",
      "https://d13k5xkmdqbhs.cloudfront.net/products/ECVDWU7/52HIIEHY-large.jpg",
      "https://browninspiredluxury.com/wp-content/uploads/2023/04/8344C198-6E53-4F8B-9811-044796B46A66.jpeg",
    ],
    description: "Bespoke Two & Three Piece Outfits",
    longDescription: "Bespoke Two & Three Piece Outfits by Tómmy ló ràn consists of a creatively crafted two-piece attire or a three-piece attire.",
    options: [
      "Two-piece outfit",
      "Three-piece outfit"
    ],
    features: [
      "Full canvas construction",
      "Hand-finished buttonholes",
      "Surgeon's cuffs with working buttons",
      "Pick-stitched lapels and edges",
      "Interior monogram available",
      "Professional embroidery designs",
    ],
    materials: [
      "Super 150s Merino wool from Loro Piana",
      "Bemberg silk lining",
      "Mother-of-pearl buttons",
      "Real horn buttons optional",
    ],
    deliveryTime: "8-10 weeks",
    popularity: 95,
  },
  {
    id: "ready-to-wear",
    name: "Two-piece Outfits",
    category: "READY-TO-WEAR",
    price: "From NGN45,000 - NGN120,000",
    priceValue: 45000,
    image: "/assets/images/two-piece.png",
    images: [
      "/assets/images/two-piece.png",
    ],
    description: "Refined casual sophistication",
    longDescription: "Our ready-to-wear outfits are carefully crafted with our primary goal in mind. Varieties are available for purchase.",
    features: [
      "Careful and neat stiches",
      "Soft shoulder construction",
      "Sewn to fit",
      "Creative Embroidery designs",
      "Complimentary first alteration",
    ],
    materials: [
      "Senator material",
      "Cupro lining for breathability",
      "Corozo nut buttons",
      "Melton undercollar",
    ],
    deliveryTime: "6-8 weeks",
    popularity: 88,
  },
  {
    id: "special-occasion-outfits",
    name: "Special Occasion Outfits",
    category: "WEDDING/EVENT PACKAGES",
    price: "From NGN300,000 - NGN1,000,000+",
    priceValue: 4200,
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&h=1600&fit=crop",
    ],
    description: "Timeless winter luxury",
    longDescription: "The Savile Overcoat is the definitive statement piece for colder months, crafted in the tradition of the finest British outerwear. Cut generously to layer over suits while maintaining an elegant silhouette, this coat features a fly front for clean lines and deep welt pockets for practicality. The peak lapels add a touch of formality befitting its heritage.",
    features: [
      "Full-length fly front closure",
      "Deep welt pockets with flaps",
      "Interior security pocket",
      "Chain hanger loop",
      "Center back vent",
      "Hand-stitched pick stitching",
    ],
    materials: [
      "100% cashmere from Colombo",
      "Heavy silk twill lining",
      "Horn buttons",
      "Real melton undercollar",
    ],
    deliveryTime: "10-12 weeks",
    popularity: 75,
  },
  {
    id: "caps-scarves-addons",
    name: "Caps, Scarves, Add-ons",
    category: "ACCESSORIES",
    price: "From NGN20,000 - NGN60,000",
    priceValue: 450,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&h=1600&fit=crop",
    ],
    description: "Impeccable detail",
    longDescription: "The Kensington Shirt exemplifies the art of luxury shirtmaking with precision sizing ensuring a perfect fit. Each shirt features single-needle stitching throughout, hand-sewn buttonholes, and elegant collar styling. The shirts are cut from the finest two-fold cotton fabrics, offering both comfort and longevity.",
    features: [
      "Single-needle construction",
      "Hand-sewn buttonholes",
      "Mother-of-pearl buttons",
      "Removable collar stays",
      "Split back yoke",
      "Gussetted side seams",
    ],
    materials: [
      "Thomas Mason two-fold poplin",
      "Sea Island cotton available",
      "Swiss cotton options",
      "Aluminium collar stays",
    ],
    deliveryTime: "3-4 weeks",
    popularity: 82,
  },
];

export const products: Product[] = [
  {
    id: "windsor-suit",
    name: "The Windsor Suit",
    category: "Traditional Attires",
    price: "From NGN3,800",
    priceValue: 3800,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1593030103066-0093718e3d49?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=1600&fit=crop",
    ],
    description: "Classic three-piece elegance",
    longDescription: "The Windsor Suit represents the pinnacle of traditional British tailoring, reimagined for the modern gentleman. Each suit is meticulously handcrafted over 80+ hours by our master tailors, featuring a full canvas construction that moulds to your body over time. The three-piece design includes a single-breasted jacket with notch lapels, a matching waistcoat, and expertly pleated trousers.",
    features: [
      "Full canvas construction",
      "Hand-finished buttonholes",
      "Surgeon's cuffs with working buttons",
      "Pick-stitched lapels and edges",
      "Interior monogram available",
      "Lifetime alterations included",
    ],
    materials: [
      "Super 150s Merino wool from Loro Piana",
      "Bemberg silk lining",
      "Mother-of-pearl buttons",
      "Real horn buttons optional",
    ],
    deliveryTime: "8-10 weeks",
    popularity: 95,
  },
  {
    id: "mayfair-blazer",
    name: "The Mayfair Blazer",
    category: "Tailored Suits",
    price: "From NGN1,950",
    priceValue: 1950,
    image: "https://images.unsplash.com/photo-1593030103066-0093718e3d49?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593030103066-0093718e3d49?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1200&h=1600&fit=crop",
    ],
    description: "Refined casual sophistication",
    longDescription: "The Mayfair Blazer bridges the gap between formal and casual with effortless sophistication. This versatile piece features a half-canvas construction for comfort and structure, making it ideal for both business meetings and weekend gatherings. The slightly softened shoulder and patch pockets lend a relaxed elegance while maintaining impeccable lines.",
    features: [
      "Half-canvas construction",
      "Soft shoulder construction",
      "Patch pockets with flaps",
      "Double vents for movement",
      "Interior card pockets",
      "Complimentary first alteration",
    ],
    materials: [
      "Super 120s wool-cashmere blend",
      "Cupro lining for breathability",
      "Corozo nut buttons",
      "Melton undercollar",
    ],
    deliveryTime: "6-8 weeks",
    popularity: 88,
  },
  {
    id: "savile-overcoat",
    name: "The Savile Overcoat",
    category: "Traditional Attires",
    price: "From NGN4,200",
    priceValue: 4200,
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&h=1600&fit=crop",
    ],
    description: "Timeless winter luxury",
    longDescription: "The Savile Overcoat is the definitive statement piece for colder months, crafted in the tradition of the finest British outerwear. Cut generously to layer over suits while maintaining an elegant silhouette, this coat features a fly front for clean lines and deep welt pockets for practicality. The peak lapels add a touch of formality befitting its heritage.",
    features: [
      "Full-length fly front closure",
      "Deep welt pockets with flaps",
      "Interior security pocket",
      "Chain hanger loop",
      "Center back vent",
      "Hand-stitched pick stitching",
    ],
    materials: [
      "100% cashmere from Colombo",
      "Heavy silk twill lining",
      "Horn buttons",
      "Real melton undercollar",
    ],
    deliveryTime: "10-12 weeks",
    popularity: 75,
  },
  {
    id: "kensington-shirt",
    name: "The Kensington Shirt",
    category: "Traditional Attires",
    price: "From NGN450",
    priceValue: 450,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&h=1600&fit=crop",
    ],
    description: "Impeccable detail",
    longDescription: "The Kensington Shirt exemplifies the art of luxury shirtmaking with precision sizing ensuring a perfect fit. Each shirt features single-needle stitching throughout, hand-sewn buttonholes, and elegant collar styling. The shirts are cut from the finest two-fold cotton fabrics, offering both comfort and longevity.",
    features: [
      "Single-needle construction",
      "Hand-sewn buttonholes",
      "Mother-of-pearl buttons",
      "Removable collar stays",
      "Split back yoke",
      "Gussetted side seams",
    ],
    materials: [
      "Thomas Mason two-fold poplin",
      "Sea Island cotton available",
      "Swiss cotton options",
      "Aluminium collar stays",
    ],
    deliveryTime: "3-4 weeks",
    popularity: 82,
  },
  {
    id: "chelsea-trousers",
    name: "The Chelsea Trousers",
    category: "Traditional Attires",
    price: "From NGN680",
    priceValue: 680,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=1600&fit=crop",
    ],
    description: "Perfect fit, perfect form",
    longDescription: "The Chelsea Trousers represent the foundation of a well-dressed gentleman's wardrobe. Cut with a medium rise and gentle taper, these trousers drape beautifully while allowing freedom of movement. Features include a traditional extended waistband with side adjusters, eliminating the need for a belt, and a French fly closure for a clean front.",
    features: [
      "Extended waistband closure",
      "Side adjusters for fit",
      "French bearer fly",
      "Slant front pockets",
      "Double-jetted back pockets",
      "Curtained waistband",
    ],
    materials: [
      "Super 130s worsted wool",
      "Cotton twill pocketing",
      "Corozo buttons",
      "Real horn buttons optional",
    ],
    deliveryTime: "4-5 weeks",
    popularity: 79,
  },
  {
    id: "belgravia-tuxedo",
    name: "The Belgravia Tuxedo",
    category: "Tailored Suits",
    price: "From NGN5,200",
    priceValue: 5200,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=1600&fit=crop",
      "https://images.unsplash.com/photo-1593030103066-0093718e3d49?w=1200&h=1600&fit=crop",
    ],
    description: "Black tie excellence",
    longDescription: "The Belgravia Tuxedo is the ultimate expression of evening elegance, designed for those moments that demand nothing less than perfection. Featuring a shawl collar faced in silk grosgrain, single button closure, and satin-striped trousers, this tuxedo adheres to the most traditional standards while incorporating modern comfort. Each detail, from the silk-covered buttons to the jetted pockets with silk piping, speaks to our commitment to excellence.",
    features: [
      "Full canvas construction",
      "Silk grosgrain shawl collar",
      "Silk-covered buttons",
      "Jetted pockets with silk piping",
      "Satin stripe on trousers",
      "Black tie bow tie included",
    ],
    materials: [
      "Super 180s midnight blue wool",
      "100% silk facing",
      "Heavy satin lining",
      "Genuine silk braiding",
    ],
    deliveryTime: "10-12 weeks",
    popularity: 91,
  },
];

export function getServiceBySlug(slug: string): Product | undefined {
  return services.find((service) => service.id === slug);
}

export function getAllServiceSlugs(): string[] {
  return services.map((service) => service.id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.id === slug);
}

export function getAllProductSlugs(): string[] {
  return products.map((product) => product.id);
}
