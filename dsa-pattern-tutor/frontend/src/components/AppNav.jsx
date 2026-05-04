import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

const AppNav = ({ title = 'DSA Pattern Tutor' }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="code" size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-text-primary">
              {title}
            </span>
          </Link>

          {/* Right side - Settings/Profile */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Mobile menu button */}
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="lg:hidden p-2 rounded-lg hover:bg-lightBlue transition-colors"
                >
                  <Icon name={showMenu ? 'close' : 'menu'} size={20} />
                </button>

                {/* Desktop - Profile icon */}
                <div className="hidden lg:flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="p-2 rounded-lg hover:bg-lightBlue transition-colors"
                    title="Profile"
                  >
                    <Icon name="user" size={20} />
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="p-2 rounded-lg hover:bg-lightBlue transition-colors"
                      title="Admin"
                    >
                      <Icon name="settings" size={20} />
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg hover:bg-lightBlue transition-colors"
                    title="Logout"
                  >
                    <Icon name="logout" size={20} />
                  </button>
                </div>

                {/* Mobile menu */}
                {showMenu && (
                  <div className="absolute top-16 right-4 lg:hidden bg-white border border-border rounded-lg shadow-lg py-2 min-w-[160px]">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-lightBlue transition-colors"
                      onClick={() => setShowMenu(false)}
                    >
                      <Icon name="user" size={18} />
                      <span>Profile</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-lightBlue transition-colors"
                        onClick={() => setShowMenu(false)}
                      >
                        <Icon name="settings" size={18} />
                        <span>Admin</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-lightBlue transition-colors w-full text-left"
                    >
                      <Icon name="logout" size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              !isAuthPage && (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="btn-secondary text-sm py-2 px-4"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-sm py-2 px-4"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNav;