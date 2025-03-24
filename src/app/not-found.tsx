import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className='bg-white h-screen flex items-center justify-center flex-col'>
      <p className='text-black'>Oops!</p>
      <p className='text-black'>Page Not Found</p>
      <p className='text-black'>Navigate to <Link className='text-purple-700 underline' href={'/'}>Home</Link></p>
    </div>
  )
}

export default NotFound