# E-Commerce Interface Documentation

## Overview
Tómmy ló ràn's e-commerce interface is built with a seamless, intuitive shopping experience using Zustand for client-side state management and Headless UI components for the cart sidebar.

## Components & Features

### 1. Cart Store (`/lib/cart-store.ts`)
**Zustand-based state management for shopping cart**

```typescript
interface CartItem {
  product: Product;
  quantity: number;
  id: string;
}
```

**Key Methods:**
- `addItem(product, quantity)` - Add item to cart or increase quantity
- `updateQuantity(productId, quantity)` - Modify item quantity
- `removeItem(productId)` - Remove item from cart
- `getTotalPrice()` - Calculate cart subtotal
- `getTotalItems()` - Get total number of items

**Features:**
- Real-time synchronization across components
- Automatic duplicate item detection
- Quantity management
- Price calculations

### 2. Enhanced Add to Cart Button (`/components/add-to-cart-button.tsx`)
**Smart button that transforms based on cart state**

**Behavior:**
1. **Initial State:** Displays "Add to Cart" button
2. **After Adding:** Transforms into quantity controls (-, quantity, +)
3. **On Decrease to Zero:** Reverts back to "Add to Cart" button

**Features:**
- Real-time quantity updates
- Minus/Plus controls with border styling
- Smooth transitions
- Accessible aria-labels

### 3. Header Integration (`/components/header.tsx`)
**Navigation with cart functionality**

**Cart Icon Behavior:**
- Located in desktop and mobile navigation
- Shows item count badge when cart has items
- Click opens CartSidebar
- Real-time updates using Zustand store

**Features:**
- Client-side hydration handling with `mounted` state
- Responsive design for desktop and mobile
- Smooth sidebar open/close animations

### 4. Cart Sidebar (`/components/cart-sidebar.tsx`)
**Full-featured shopping cart panel**

**Structure:**
```
├── Header (with close button)
├── Items Container
│   ├── Empty State (when no items)
│   └── Item Cards (when items present)
│       ├── Product Image & Info
│       ├── Quantity Controls
│       └── Remove Button
└── Footer (checkout section)
```

**Features:**
- Slides in from right with smooth animation
- Backdrop blur effect
- Item management (quantity +/-, remove)
- Subtotal calculation
- Proceed to Checkout button
- Continue Shopping button
- Empty state message

**Styling:**
- Uses Tailwind CSS for responsive design
- Transition animations (300ms duration)
- Museum-quality image rendering
- Editorial layout principles

### 5. Product Details Enhancement (`/components/product-details.tsx`)
**Product page with dual purchase options**

**CTA Buttons:**
1. **Add to Cart** (Charcoal/Cream)
   - Adds item without opening sidebar
   - Shows quantity controls after adding
   - Can adjust quantity before checkout

2. **Purchase Now** (Gold)
   - Adds item to cart
   - Immediately opens CartSidebar
   - Streamlined checkout flow

**Features:**
- CartSidebar accessible from product page
- Product details preserved while shopping
- Smooth transitions between states

## User Flows

### Flow 1: Browse & Add to Cart (Shop Page)
```
1. User clicks "Add to Cart" on product card
2. Button transforms to quantity controls (-, qty, +)
3. User adjusts quantity if needed
4. Checkout later via cart icon in header
```

### Flow 2: Quick Purchase (Product Page)
```
1. User views product details
2. Clicks "Purchase Now" button
3. Item added to cart
4. CartSidebar opens automatically
5. Shows checkout button for streamlined flow
```

### Flow 3: Cart Management
```
1. Click cart icon in header
2. CartSidebar opens showing all items
3. Adjust quantities using +/- buttons
4. Remove items with trash icon
5. View subtotal
6. Click "Proceed to Checkout"
```

## State Management

### Cart Store Values
- **items[]** - Array of CartItem objects
- **quantity** - Per-item quantity tracking
- **Automatic calculations** - Total price and item count

### Component State
- **Header:** `isCartOpen`, `mounted` (for hydration)
- **ProductDetails:** `isCartOpen` (sidebar state)
- **AddToCartButton:** Reads from store (no local state)

## Design Implementation

### Color Usage
- **Charcoal (#1C1C1C):** Primary buttons, cart item backgrounds
- **Gold (#C2A35A):** Purchase Now button, accent elements
- **Cream (#E6D8C3):** Button text, backgrounds

### Typography
- **Font Heading (Playfair Display):** Product names, quantities
- **Font Sans (Inter):** Body text, labels, buttons

### Responsive Breakpoints
- **Mobile:** Full-width sidebar, stacked layouts
- **Tablet (md):** 2-column grids, adjusted spacing
- **Desktop (lg):** Full sidebar (max-w-md), centered navigation

## Accessibility Features

1. **ARIA Labels:**
   - `aria-label="Shopping bag"` - Cart icon
   - `aria-label="Increase/Decrease quantity"` - Buttons
   - `aria-label="Remove from cart"` - Delete button
   - `aria-label="Close cart"` - Close button

2. **Keyboard Navigation:**
   - Tab through all interactive elements
   - Enter/Space to activate buttons
   - Esc to close sidebars

3. **Screen Readers:**
   - Semantic HTML structure
   - Descriptive button labels
   - Item count announced

## Performance Considerations

1. **Client-Side Only:** Cart state exists only on client (no server sync needed)
2. **Zustand Benefits:**
   - Minimal re-renders via selector hooks
   - No prop drilling
   - Direct store subscriptions

3. **Component Optimization:**
   - `useMemo` for cart item lookup
   - Lazy loading of images
   - Smooth 300ms transitions (not jarring)

## Future Enhancements

- Persist cart to localStorage/IndexedDB
- Server-side cart synchronization
- Analytics tracking for add-to-cart events
- Product recommendations based on cart
- Discount code application
- Saved favorites/wishlist
