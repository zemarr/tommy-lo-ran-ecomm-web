import SignIn from '@/components/auth/signin-form'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="h-max w-full flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <SignIn />
        </div>
      </div>
    </div>
  )
}
