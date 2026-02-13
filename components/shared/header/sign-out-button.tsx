'use client'

import { Button } from '@/components/ui/button'
import { signOutUser } from '@/lib/server/actions/user.actions'
import { useRouter } from 'next/navigation'

const SignOutButton = () => {
  const router = useRouter()
  return (
    <Button
      className="w-full py-4 px-2 h-4 justify-start rounded-md"
      variant="ghost"
      onClick={() => {
        signOutUser()
        router.replace('/');
      }}
    >
      Sign out
    </Button>
  )
}

export default SignOutButton