import { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  onCancel,
  showButtons = false,
  className = "" 
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch && !showButtons) {
      onSearch(value);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleCancelClick = () => {
    setQuery("");
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="pl-10 pr-4 py-2 w-full"
        />
      </form>
      
      {showButtons && (
        <>
          <Button
            onClick={handleSearchClick}
            className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            <ApperIcon name="Search" className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button
            onClick={handleCancelClick}
            variant="outline"
            className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ApperIcon name="X" className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </>
      )}
    </div>
  );
};

export default SearchBar;