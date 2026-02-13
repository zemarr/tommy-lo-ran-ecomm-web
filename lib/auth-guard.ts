import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();

  // Type guard to check if user has a 'role' property
  function isAdminUser(user: unknown): user is { role: string } {
    return typeof user === 'object' && user !== null && 'role' in user && typeof (user as any).role === 'string';
  }

  if (!isAdminUser(session?.user) || session.user.role !== 'admin') {
    redirect('/');
  }

  return session;
}