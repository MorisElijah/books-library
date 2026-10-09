import Link from 'next/link';
import React from 'react'
import BookSearch from './bookSearch';

const Header = () => {
  return (
    <div>
    <div className="flex items-center justify-between w-full bg-zinc-500 dark:bg-black p-4">
        <div>
            <Link href="/">
      <h1 className="text-xl font-bold">BOOKSHELF</h1>
      </Link>
    </div>
    <div>
        <Link href="/login">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </Link>
    </div>
    </div>
    
</div>

    
  )
}

export default Header
