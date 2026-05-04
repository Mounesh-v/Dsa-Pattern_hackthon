import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

const Topbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 right-0 md:left-64 left-0 h-16 border-b bg-card dark:bg-dark-card z-30 dark:border-dark-border">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left - Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors"
          title="Toggle menu"
        >
          <Icon name="menu" size={20} />
        </button>

        {/* Center spacer */}
        <div className="flex-1 md:hidden" />

        {/* Right - Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent/5 transition-colors dark:border-dark-border"
            title="Toggle theme"
          >
            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
          </button>

          {/* Settings */}
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent/5 transition-colors dark:border-dark-border">
            <Icon name="settings" size={18} />
          </button>

          {/* Logout */}
          {user && (
            <button
              onClick={logout}
              className="flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-accent/5 transition-colors dark:border-dark-border"
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
