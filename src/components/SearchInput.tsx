import React from 'react';

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex">
      <input
        type="text"
        placeholder="...Search cards"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-4 py-1 my-2 md:ml-6 w-80 border rounded-md  text-left text-black dark:bg-gray-800 dark:text-white dark:border-gray-700"
      />
    </div>
  );
};

export default SearchInput;
