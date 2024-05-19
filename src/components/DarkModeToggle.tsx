import React, { useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'
const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      onClick={toggleDarkMode}
      className="flex justify-center items-center rounded-full dark:text-black bg-black dark:bg-white w-10 h-10 ml-5 transition-all duration-200 ease-out "
    >
      {isDarkMode ? <FaMoon /> : <FaSun />}
    </div>
  );
};

export default DarkModeToggle;


