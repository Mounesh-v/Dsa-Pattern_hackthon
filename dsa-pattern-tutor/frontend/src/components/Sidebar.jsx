import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const { user } = useAuth();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "home" },
    { to: "/patterns", label: "Patterns", icon: "grid" },
    { to: "/practice", label: "Practice", icon: "target" },
    { to: "/session-practice", label: "Session Practice", icon: "clock" },
    { to: "/weakness", label: "Weakness Report", icon: "chart" },
    { to: "/progress", label: "Progress", icon: "trendingUp" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-64 border-r z-40 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${theme === "dark" ? "bg-dark-card border-dark-border" : "bg-card border-border"}`}
    >
      <div className="flex h-full flex-col">
        {/* Close button for mobile */}
        <div className="flex md:hidden justify-end p-4">
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${theme === "dark" ? "hover:bg-dark-accent/10" : "hover:bg-accent/10"}`}
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-6 py-6 border-b ${
            theme === "dark" ? "border-dark-border" : "border-border"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <Icon name="code" size={20} className="text-white" />
          </div>
          <div>
            <h1
              className={`font-display font-bold text-lg ${
                theme === "dark"
                  ? "text-dark-text-primary"
                  : "text-text-primary"
              }`}
            >
              DSA Pattern Tutor
            </h1>
            <p
              className={`text-xs ${
                theme === "dark"
                  ? "text-dark-text-secondary"
                  : "text-text-secondary"
              }`}
            >
              Master patterns, not problems
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(item.to)
                      ? "bg-accent/10 text-accent"
                      : theme === "dark"
                        ? "text-dark-text-secondary hover:bg-dark-accent/10 hover:text-dark-text-primary"
                        : "text-text-secondary hover:bg-accent/5 hover:text-text-primary"
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        {user && (
          <div
            className={`border-t px-4 py-4 ${
              theme === "dark" ? "border-dark-border" : "border-border"
            }`}
          >
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent font-semibold flex-shrink-0">
                {user.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    theme === "dark"
                      ? "text-dark-text-primary"
                      : "text-text-primary"
                  }`}
                >
                  {user.name}
                </p>
                <p
                  className={`text-xs truncate ${
                    theme === "dark"
                      ? "text-dark-text-secondary"
                      : "text-text-secondary"
                  }`}
                >
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
