export const menu = [
  {
    title: 'Home',
    path: '/home',
  },
  {
    title: 'About',
    path: '/about',
  },
  {
    title: 'Terms & Conditions',
    path: '/terms-conditions',
  },
  {
    title: 'Shipping & return policy',
    path: '/shipping-return-policy',
  },
  {
    title: 'Privacy Policy',
    path: '/privacy-policy',
  },
  {
    title: 'FAQs',
    path: '/faqs',
  }
]
export const DEFAULT_OPTION = 'Default Title';
export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Relevance',
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: 'Trending', slug: 'trending-desc', sortKey: 'BEST_SELLING', reverse: false }, // asc
  { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'CREATED_AT', reverse: true },
  { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'PRICE', reverse: false }, // asc
  { title: 'Price: High to low', slug: 'price-desc', sortKey: 'PRICE', reverse: true }
];

export const TAGS = {
  categories: 'categories',
  products: 'products',
  cart: 'cart'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-aevum-hidden';

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Bart Store";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Bart Store is a Next.js 13.4+ app directory starter template with TypeScript, Tailwind CSS, and Radix UI components.";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const APP_URL = "https://bart.store";
export const APP_TWITTER_HANDLE = "@bartstore";
export const APP_GITHUB_URL = "";
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const DEFAULT_SIGNIN_VALUES = {
  email: "",
  password: "",
};
export const DEFAULT_SIGNUP_VALUES = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
export const NAIRA_SIGN = `&#8358;`
export const DOLLAR_SIGN = `$`
export const shippingAddressDefaultValues = {
  fullname: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  // lng: "",
  // lat: "7"
};
export const PROTECTED_ROUTES = [
  /\/checkout/,
  /\/payment-method/,
  /\/place-order/,
  /\/profile/,
  /\/user\/(.*)/,
  /\/order\/(.*)/,
  /\/admin/,
];
export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(', ') : ["Paystack", "Paypal", "PayOnDelivery"]
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || "Paystack"
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;
export const PRODUCT_DEFAULT_VALUES = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: '0',
  stock: 0,
  rating: '0',
  numReviews: '0',
  isFeatured: false,
  banner: null,
}
export const USER_ROLES = process.env.USER_ROLES ? process.env.USER_ROLES.split(', ') : ["admin", "user"]
export const REVIEW_FORM_DEFAULT_VALUES = {
  title: "",
  comment: "",
  rating: 0,
}
export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";

