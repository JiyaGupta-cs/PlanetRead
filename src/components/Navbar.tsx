"use client";
import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, UserRound } from 'lucide-react';
import SignOut from './SignOutButton';

const Navbar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 bg-white text-black sticky top-0 z-10 shadow-md">
      <div className="text-lg font-bold py-1">PlanetRead</div>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="bg-white hover:bg-gray-200 text-black px-4 py-3 flex gap-2 items-center"
        >
            <div className='bg-purple-700 rounded-full p-1'>
            <UserRound color='white'/>
            </div>
            
            {showDropdown ?  <ChevronUp  size={20} /> :  <ChevronDown size={20} />} 
         
        </button>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white text-black"
          >
            <div className="py-1">
              <SignOut/>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
