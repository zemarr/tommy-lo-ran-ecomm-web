'use client';

import BackgroundPlayer from 'next-video/background-player';

export default function HeroVideo() {
  return <BackgroundPlayer
    src="https://9f0567cfj6.ufs.sh/f/XHGN3lvVNzO7N17VABwXKmOgtliQehLPkSJqX28RuynxYob6"
    // poster="https://9f0567cfj6.ufs.sh/f/XHGN3lvVNzO7FBazII5is1LYfXzQwVjyF48AZCWa3o7cD069"
    // blurDataURL="https://9f0567cfj6.ufs.sh/f/XHGN3lvVNzO7FBazII5is1LYfXzQwVjyF48AZCWa3o7cD069"
    className="inset-0 w-full h-full [&>video]:h-full [&>video]:w-full [&>video]:object-cover"
  />;
}