import { useState } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex items-center bg-white rounded-full w-fit shadow-md px-4 py-2 my-8">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search devices"
        className="w-full lg:min-w-lg outline-none bg-transparent text-gray-700"
      />
    </div>
  );
};

export default SearchInput;
