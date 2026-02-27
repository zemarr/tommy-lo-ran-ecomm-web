import UpdateProfileForm from '../components/update-profile-form'
import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Customer profile'
}

const UserProfilePage = async () => {
  const session = await auth();

  if (!session) redirect('/sign-in');

  const user = session?.user;

  if (!user) redirect('/');

  return (
    <div className='max-w-md mx-auto space-y-4 mt-30 my-auto'>
      <h2 className="mb-2 font-semibold text-xl uppercase!">User Profile</h2>
      {user?.name && <h3 className="mb-8 text-base">
        <span className={"text-charcoal"}>Review and update your account details below.</span>
      </h3>}
      <UpdateProfileForm user={user} />
    </div>
  )
}

export default UserProfilePage