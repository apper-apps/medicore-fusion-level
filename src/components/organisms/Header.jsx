import { useState, useContext } from "react";
import { useSelector } from 'react-redux';
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";

const UserProfile = () => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const userInitials = user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.emailAddress ? user.emailAddress[0].toUpperCase() : 'U';

  const userName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.emailAddress || 'User';

  return (
    <div className="relative">
      <div 
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">{user.emailAddress}</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
          <span className="text-white font-medium text-sm">{userInitials}</span>
        </div>
      </div>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            <div className="font-medium">{userName}</div>
            <div className="text-gray-500">{user.emailAddress}</div>
          </div>
          <button
            onClick={() => {
              setShowDropdown(false);
              logout();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <ApperIcon name="LogOut" className="inline h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
const Header = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Implement global search functionality here
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 lg:pl-64">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <div className="hidden sm:block w-80">
            <SearchBar
              placeholder="Search patients, staff, departments..."
              onSearch={handleSearch}
            />
          </div>
        </div>
        
<div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <ApperIcon name="Bell" className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;