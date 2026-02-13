
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-center min-h-[calc(100vh-80px)] w-full">
      {children}
    </div>
  );
}