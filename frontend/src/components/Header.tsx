import React from 'react';
import MoonIcon from './icons/MoonIcon';
import SunIcon from './icons/SunIcon';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            VOI Hotels - Dashboard Allarmi
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;