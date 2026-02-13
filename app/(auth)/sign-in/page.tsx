import { auth } from '@/auth'
import SignInForm from '@/components/auth/signin-form'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}
// This is the main entry point for the sign-in page
const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string
  }>
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    // If the user is already signed in, redirect them to the home page
    return redirect(callbackUrl || '/');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="h-max w-full flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}

export default SignInPage;
