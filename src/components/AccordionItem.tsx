'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const AccordionItem = ({
  title,
  children,
  defaultOpen = false
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const scrollY = window.scrollY;
    setIsOpen(!isOpen);

    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  return (
    <div className="group relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-2xl mb-4 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <button
        onClick={handleToggle}
        type="button"
        className="w-full px-6 sm:px-8 py-5 flex items-center justify-between bg-gradient-to-r from-transparent to-blue-50/30 dark:to-blue-950/20 hover:to-blue-100/40 dark:hover:to-blue-900/30 transition-all duration-300"
      >
        <span className="font-semibold text-left text-gray-900 dark:text-gray-100 text-base sm:text-lg">{title}</span>
        <ChevronDown className={`w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      {isOpen && (
        <div className="px-6 sm:px-8 py-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
          {children}
        </div>
      )}
    </div>
  );
};
