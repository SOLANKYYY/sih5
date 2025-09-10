
import React from 'react';
import { CalendarIcon, LogoutIcon } from './icons/Icons';

interface HeaderProps {
  userEmail: string;
  onLogout: () => void;
  role: string;
}

const Header: React.FC<HeaderProps> = ({ userEmail, onLogout, role }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">TimeTable AI</h1>
              <p className="text-sm text-gray-500">{role} Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden md:block">{userEmail}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-600 transition duration-200"
            >
              <LogoutIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
