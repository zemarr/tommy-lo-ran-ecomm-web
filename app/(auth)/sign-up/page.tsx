import SignUp from '@/components/auth/signup-form'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="h-max w-full flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <SignUp />
        </div>
      </div>
    </div>
  )
}
