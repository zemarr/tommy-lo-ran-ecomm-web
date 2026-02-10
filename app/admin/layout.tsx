import { AdminHeader } from "@/components/admin-header";


export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex flex-col">
        <AdminHeader />

        <div className="flex-1 space-y-4 p-8 container mx-auto">
          {children}
        </div>
      </div>
    </>
  )
}