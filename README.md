# Tómmy ló ràn - Modern African Menswear

Tómmy ló ràn is a contemporary menswear brand rooted in African culture and tailored for the modern man. This platform provides a seamless shopping experience for high-quality, intentionally crafted apparel.

## 🚀 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Neon](https://neon.tech/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Payments**: [Paystack](https://paystack.com/)
- **File Uploads**: [UploadThing](https://uploadthing.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [Sonner](https://sonner.stevenbernhard.me/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation

## ✨ Features

### User Features
- **Product Browsing**: Explore collections with advanced filtering and search.
- **Shopping Cart**: Persistent cart with real-time updates.
- **Secure Checkout**: Streamlined checkout process integrated with Paystack.
- **User Accounts**: Order history, profile management, and secure authentication.
- **Responsive Design**: Optimized for all devices, from mobile to desktop.
- **Bespoke Consultations**: Integrated Calendly for custom tailoring appointments.

### Admin Features
- **Dashboard**: Overview of sales, orders, and products.
- **Product Management**: Create, edit, and delete products and variants.
- **Order Management**: Track and manage customer orders and delivery status.
- **Media Management**: Effortless image uploads via UploadThing.

## 🛠️ Getting Started

### Prerequisites
- Node.js (Latest LTS)
- pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=
   AUTH_SECRET=
   NEXTAUTH_URL=
   UPLOADTHING_SECRET=
   UPLOADTHING_APP_ID=
   PAYSTACK_PUBLIC_KEY=
   PAYSTACK_SECRET_KEY=
   ```

4. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

## 📜 License

This project is licensed under the MIT License.
