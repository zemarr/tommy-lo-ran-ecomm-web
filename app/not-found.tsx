'use client'

import { Button } from '@/components/ui/button'
// import { APP_NAME } from '@/lib/constants'
import React from 'react'

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-3'>
      {/* <Image src={'/images/aevum-flattened-logo.svg'} width={48} height={48} alt={`${APP_NAME} logo`} priority /> */}
      <div className='p-6 md:max-w-1/2 w-full rounded-lg text-center flex flex-col items-center justify-center gap-3'>
        <span className="block text-sm text-center font-medium tracking-widest">404</span>
        <h1 className="lg:text-7xl md:text-5xl text-3xl font-medium mb-4">Page not found</h1>
        <p className=''>We couldn&apos;t find the page you were looking for. You can return to our home page if you can&apos;t find what you&apos;re looking for.</p>
        <Button onClick={() => window.location.href = '/'} variant='outline' className='mt-4 ml-2'>Go back to safety</Button>
      </div>
    </div>
  )
}

export default NotFound;