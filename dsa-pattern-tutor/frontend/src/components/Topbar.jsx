import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

const Topbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 right-0 md:left-64 left-0 h-16 border-b bg-card z-30">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left - Breadcrumb or page title could go here */}
        <div className="flex-1" />

        {/* Right - Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent/5 transition-colors"
            title="Toggle theme"
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
          </button>

          {/* Settings */}
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent/5 transition-colors">
            <Icon name="settings" size={18} />
          </button>

          {/* Logout */}
          {user && (
            <button
              onClick={logout}
              className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent/5 transition-colors"
              title="Logout"
            >
              <Icon name="logout" size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
