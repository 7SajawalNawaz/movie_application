import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer className='text-gray-400 text-center p-4 mt-8'>
            <p>Copyright © Movie Trello By SJ {new Date().getFullYear()} </p>
        </footer>
    </div>
  )
}

export default Footer