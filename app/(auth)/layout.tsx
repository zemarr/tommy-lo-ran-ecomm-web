
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-center min-h-[calc(100vh-80px)] mx-auto max-w-10xl px-6 lg:px-14">
      {children}
    </div>
  );
}