import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import SearchInput from './SearchInput';
import App from '../App';
import DarkModeToggle from './DarkModeToggle';

interface DecodedToken {
  isAdmin: boolean;
  isBusiness: boolean;
}
const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isBusiness, setIsBusiness] = useState<boolean>(false);
  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  const location = useLocation();

  const { logout } = useContext(AuthContext) || {};

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const parsedToken = jwtDecode<DecodedToken>(token);
      setIsAdmin(parsedToken.isAdmin);
      setIsBusiness(parsedToken.isBusiness);
      setisLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    logout && logout();
    
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <nav className='w-full flex flex-col bg-gray-500 dark:bg-gray-900 shadow-sm text-white'>
        <ul className='flex flex-row-reverse gap-5 items-center justify-center'>
            <DarkModeToggle />
            {isLoggedIn && (
          <Link to='/'>
            <li className='p-5 hover:bg-gray-600 transition-all duration-100 dark:hover:bg-gray-950'>Homepage</li>
          </Link>
            )}
          {!isLoggedIn && (
          <Link to='/login'>
            <li className='p-5 hover:bg-gray-600 transition-all duration-100 dark:hover:bg-gray-950'>Login</li>
          </Link>
          )}
          {!isLoggedIn && (
          <Link to='/register'>
            <li className='p-5 hover:bg-gray-600 transition-all duration-100 dark:hover:bg-gray-950'>Register</li>
          </Link>

          )}
          {isBusiness && (
              <Link to='/mycards'>
              <li className='p-5 hover:bg-gray-600 transition-all duration-100 dark:hover:bg-gray-950'>My Cards</li>
            </Link>
          )}
          {isBusiness && (
              <Link to='/newcard'>
              <li className='p-5 hover:bg-gray-600 transition-all duration-100 dark:hover:bg-gray-950'>Create Card</li>
            </Link>
          )}
          {isBusiness && (
              <Link to='/cards'>
              <li className='p-5 hover:bg-gray-600 transition-all duration-100 dark:hover:bg-gray-950'>Cards</li>
            </Link>
          )}
          {isLoggedIn && (
            <Link to='/favorites'>
              <li className='p-5 hover:bg-gray-600 transition-all duration-100 dark:hover:bg-gray-950'>Favorite Cards</li>
            </Link>
          )}
            {isAdmin && (
              <Link to='/admin'>
                <li className='p-5 hover:bg-gray-600 transition-all duration-100 dark:hover:bg-gray-950'>Admin</li>
              </Link>
            )}
          {isLoggedIn && (
              <Link to='/login' onClick={handleLogout}>
              <li className='p-5 hover:bg-gray-600 transition-all duration-100 dark:hover:bg-gray-950'>Logout</li>
            </Link>
          )}
          {(location.pathname === '/' || location.pathname === '/cards') && (
              <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            )}
        </ul>
      </nav>
      {location.pathname === '/' || location.pathname === '/cards' ? (
          <App searchQuery={searchQuery} />
        ) : null}
    </div>
  );
};

export default Header;
