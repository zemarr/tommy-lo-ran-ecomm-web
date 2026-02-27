'use client'

import { Button } from '@/components/ui/button';
import { formUrlQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
}

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParms = useSearchParams();

  const handleClick = (type: string) => {
    const pageValue = type === 'next' ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      params: searchParms.toString(),
      key: urlParamName || 'page',
      value: String(pageValue),
    })

    router.push(newUrl);
  }

  return (
    <div className='flex items-center justify-end gap-2'>
      <Button
        size={
          'lg'
        }
        variant={'outline'}
        className='w-28'
        disabled={Number(page) <= 1}
        onClick={() => handleClick('prev')}
      >
        Previous
      </Button>
      <span className='mx-3 text-sm'>{page}</span>
      <Button
        size={
          'lg'
        }
        variant={'outline'}
        className='w-28'
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick('next')}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination