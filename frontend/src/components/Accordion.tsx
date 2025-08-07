import React, { useState } from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-800/50 rounded-lg shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-700/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-medium text-zinc-800 dark:text-zinc-100 bg-zinc-50/50 dark:bg-zinc-700/20 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 focus:outline-none"
      >
        <span>{title}</span>
        <ChevronDownIcon
          className={`w-6 h-6 transition-transform duration-300 text-zinc-500 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        style={{ display: 'grid' }}
      >
        <div className="overflow-hidden">
          <div className="p-4 bg-white dark:bg-zinc-800">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;