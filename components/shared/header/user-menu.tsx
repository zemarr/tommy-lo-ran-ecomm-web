
import React from 'react'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react'
import { signOutUser } from '@/lib/server/actions/user.actions';
import { auth } from '@/auth';

export default async function UserMenu() {
  const session = await auth();
  const user = session?.user;
  const userName = user?.name || user?.email || 'User';
  const firstInitial = userName.charAt(0).toUpperCase();
  const lastInitial = userName.charAt(1).toUpperCase();
  const initials = `${firstInitial}${lastInitial && lastInitial}`;
  // const userImage = user?.image || `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff`;

  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button variant={"ghost"} className='relative w-8 h-8 rounded-sm ml-2 flex items-center justify-center bg-transparent border border-espresso p-4'>
              <span className="text-sm font-bold text-gray-700">{initials}</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-sm shadow-sm" align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none text-foreground">{userName}</div>
              <div className="text-xs text-muted-foreground tracking-wide">{user?.email}</div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link href="/user/profile" className="w-full text-foreground/80">
              User Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/user/orders" className="w-full text-foreground/80">
              Order history
            </Link>
          </DropdownMenuItem>
          {session?.user?.role === "admin" && (
            <DropdownMenuItem>
              <Link href="/admin/overview" className="w-full text-foreground/80">
                Admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className='cursor-pointer p-0 mb-1'>
            <Button
              className="w-full py-4 px-2 h-4 justify-start rounded-md"
              variant="ghost"
              onClick={signOutUser}
            >
              Sign out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}