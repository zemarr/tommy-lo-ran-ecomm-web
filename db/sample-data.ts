import { Collections } from "@/lib/products";
import { hashSync } from "bcrypt-ts-edge";


const sampleData = {
  users: [
    {
      name: 'John Doe',
      email: 'admin@example.com',
      password: hashSync('Fakepassword@123', 10),
      role: 'admin',
    },
    {
      name: 'Jane Smith',
      email: 'user@example.com',
      password: hashSync('Fakepassword@123', 10),
      role: 'user',
    },
  ],
  products: [
    {
      id: "16e30809-fac2-496b-bb85-b1a98ad07757",
      name: "TLR Classic Linen Two-Piece Set",
      slug: "tlr-classic-linen-two-piece-set",
      category: "RTW Smart Casual",
      price: 90000,
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=1600&fit=crop",
        "https://images.unsplash.com/photo-1593030103066-0093718e3d49?w=1200&h=1600&fit=crop",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=1600&fit=crop",
      ],
      description: "Classic three-piece elegance",
      longDescription: "The TLR Classic Linen Two-Piece Set is designed for the modern man who values comfort and effortless style.Ideal for casual meetings, brunch outings, vacations, and semi- formal events.",
      features: [
        "Regular fit",
        "Breathable and lightweight",
        "Tailored modern fit",
        "Comfortable for all-day wear",
      ],
      materials: [
        "Premium linen blend",
        "Soft inner lining",
      ],
      fit: "Regular fit",
      care: "Hand wash or dry clean",
      deliveryFee: {
        lag: 5000,
        nationwide: 10000
      },
      deliveryTime: "2-5 working days (Within Lagos) | 5-7 working days (Other States Nationwide)",
      popularity: 95,
      rating: 4.8,
      numReviews: 0,
      stock: 10,
    },
    {
      id: "3be518a8-a92f-4ba3-a73c-d20d43e331f3",
      name: "TLR Urban Polo Shirt With Adire Design",
      slug: "tlr-urban-polo-shirt-with-adire-design",
      category: "RTW Smart Casual",
      price: 35000,
      images: [
        "https://images.unsplash.com/photo-1593030103066-0093718e3d49?w=1200&h=1600&fit=crop",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&h=1600&fit=crop",
        "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1200&h=1600&fit=crop",
      ],
      description: "Refined casual sophistication",
      longDescription: "The TLR Urban Polo Shirt with Adire design is a versatile essential designed for everyday wear. It pairs perfectly with trousers, jeans, or shorts for a clean and stylish look.",
      features: [
        "Breathable cotton fabric",
        "Soft on the skin",
        "Durable stitching",
        "Adire fabric",
      ],
      materials: [
        "100% premium cotton",
      ],
      fit: "Slim fit",
      care: "Machine wash(cold)",
      deliveryFee: {
        lag: 3000,
        nationwide: 5000
      },
      deliveryTime: "2-5 working days (Within Lagos) | 5-7 working days (Other States Nationwide)",
      popularity: 88,
      rating: 4.8,
      numReviews: 0,
      stock: 10,
    },
    {
      id: "44543d45-6e62-4b13-84cd-f437a07aa4e5",
      name: "TLR Royal Senator Set",
      slug: "tlr-royal-senator-set",
      category: "RTW Native",
      price: 110000,
      images: [
        "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1200&h=1600&fit=crop",
        "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&h=1600&fit=crop",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&h=1600&fit=crop",
      ],
      description: "Timeless winter luxury",
      longDescription: "The TLR Royal Senator Set is a premium native outfit crafted for weddings, traditional ceremonies, and special occasions.Designed to give a regal and confident look.",
      features: [
        "Hand-finished embroidery",
        "Rich cultural detailing",
        "Comfortable classic cut",
      ],
      materials: [
        "High-quality senator fabric",
        "Heavy silk twill lining",
        "Silk thread embroidery",
      ],
      fit: "Classic African fit",
      care: "Dry clean only",
      deliveryFee: {
        lag: 5000,
        nationwide: 10000
      },
      deliveryTime: "2-5 working days (Within Lagos) | 5-7 working days (Other States Nationwide)",
      popularity: 75,
      rating: 4.8,
      numReviews: 0,
      stock: 10,
    },
    {
      id: "5390595e-9bb2-4f16-bb85-b66d72c37eb5",
      name: "TLR Signature Agbada (Mini Agbada)",
      slug: "tlr-signature-agbada-mini-gbada",
      category: "RTW Native",
      price: 170000,
      images: [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&h=1600&fit=crop",
        "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1200&h=1600&fit=crop",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&h=1600&fit=crop",
      ],
      description: "Impeccable detail",
      longDescription: "The TLR Signature Agbada is a modern mini agbada designed for men who want a bold and luxurious traditional look without excess volume.",
      features: [
        "Intricate embroidery",
        "Premium finishing",
        "Breathable design",
        "Includes top & trousers",
      ],
      materials: [
        "Aso-Oke",
        "High-Quality Brocade fabric",
      ],
      fit: "Free fit",
      care: "Dry clean only",
      deliveryFee: {
        lag: 8000,
        nationwide: 8000
      },
      deliveryTime: "2-5 working days (Within Lagos) | 5-7 working days (Other States Nationwide)",
      popularity: 82,
      rating: 4.8,
      numReviews: 0,
      stock: 10,
    },
    {
      id: "6b9b1e2b-7484-4fd7-8892-c2352ecb87f1",
      name: "TLR Signature Silk Scarf",
      slug: "tlr-signature-silk-scarf",
      category: "Accessories",
      price: 25000,
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
      care: "Dry clean only",
      deliveryFee: {
        lag: 8000,
        nationwide: 8000
      },
      deliveryTime: "2-5 working days (Within Lagos) | 5-7 working days (Other States Nationwide)",
      popularity: 79,
      rating: 4.8,
      numReviews: 0,
      stock: 10,
    },
  ],
  shippingAddressDefaultValues: [
    {
      fullName: "Alice Johnson",
      streetAddress: "42 Elm Street",
      city: "Springfield",
      postalCode: "12345",
      country: "USA",
      lng: "-93.2923",
      lat: "44.9537",
    },
    {
      fullName: "Mohammed Al-Fulan",
      streetAddress: "12 Palm Grove Avenue",
      city: "Lagos",
      postalCode: "101001",
      country: "Nigeria",
      lng: "3.3792",
      lat: "6.5244",
    },
    {
      fullName: "Emma Zhang",
      streetAddress: "88 Blossom Road",
      city: "Shanghai",
      postalCode: "200000",
      country: "China",
      lng: "121.4737",
      lat: "31.2304",
    },
    {
      fullName: "Lucas Müller",
      streetAddress: "9 Berliner Strasse",
      city: "Berlin",
      postalCode: "10115",
      country: "Germany",
      lng: "13.4050",
      lat: "52.5200",
    },
  ],

};

export default sampleData;
