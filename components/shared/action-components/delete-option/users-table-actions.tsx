'use client'

import React from 'react'
import { useActionComponentStore } from '../store/action-components-store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import Link from 'next/link';

const UsersTableActions = ({ user }: { user: { id: string; name: string }; }) => {
  const { setDeleting, setConfirmDelete } = useActionComponentStore();
  const handleDeleteUser = () => {
    setConfirmDelete(true)
    setDeleting(user.id, [user.name])
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem>
            <Link href={`/admin/users/${user.id}`}>Edit user</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeleteUser()} className='text-destructive'>
            Delete user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default UsersTableActions;