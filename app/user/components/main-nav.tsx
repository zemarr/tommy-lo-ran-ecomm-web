'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavLink {
  href: string;
  title: string;
}

interface MainNavProps extends React.HTMLAttributes<HTMLDivElement> {
  links: NavLink[];
}

const MainNav = ({ className, links, ...props }: MainNavProps) => {
  const pathname = usePathname();
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      {
        links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(`text-sm font-medium transition-colors hover:text-primary`, pathname.includes(link.href) ? '' : 'text-muted-foreground')}
          >
            {link.title}
          </Link>
        ))
      }
    </nav>
  )
}

export default MainNav