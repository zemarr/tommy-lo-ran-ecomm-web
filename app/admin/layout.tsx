import { AdminHeader } from "@/components/admin-header";


export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex flex-col">
        <AdminHeader />

        <div className="flex-1 space-y-4 max-w-10xl px-6 lg:px-14">
          {children}
        </div>
      </div>
    </>
  )
}