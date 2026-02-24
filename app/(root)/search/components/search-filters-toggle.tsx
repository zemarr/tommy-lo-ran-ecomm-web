'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type FilterLink = {
  label: string;
  href: string;
  active?: boolean;
};

interface SearchFiltersToggleProps {
  categoryLinks: FilterLink[];
  priceLinks: FilterLink[];
  ratingLinks: FilterLink[];
}

export function SearchFiltersToggle({
  categoryLinks,
  priceLinks,
  ratingLinks,
}: SearchFiltersToggleProps) {
  const [ open, setOpen ] = useState(false);

  return (
    <div className="filter-links md:mb-8 mb-0">
      <button
        type="button"
        className="mb-4 text-sm font-medium py-2 px-3 bg-accent-foreground text-cream"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? 'Hide filters' : 'Show filters'}
      </button>

      {open && (
        <>
          <p className={"md:text-lg text-sm font-medium uppercase!"}>Sort by:</p>

          <p className="text-base mb-2 mt-5 font-medium">Category:</p>
          <div>
            <ul className="space-y-1 md:text-base text-sm">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={link.active ? 'font-bold underline!' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-base mb-2 mt-8 font-medium">Price:</p>
          <div>
            <ul className="space-y-1 md:text-base text-sm">
              {priceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={link.active ? 'font-bold underline!' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* <p className="text-base mb-2 mt-8 font-medium">Product ratings:</p>
          <div>
            <ul className="space-y-1 md:text-base text-sm">
              {ratingLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={link.active ? 'font-bold underline!' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
        </>
      )}
    </div>
  );
}

