import Link from 'next/link';
import React from 'react'

const LoginPage = () => {
  return (
    <div>
      <div>
        this is the login page
      </div>
      <div>
        <Link href="/signup">
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
