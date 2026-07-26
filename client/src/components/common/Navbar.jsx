import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Menu, X, TrendingUp } from "lucide-react";
import clsx from "clsx";
import { AuthContext } from "../../context/AuthContext";

import Button from "../ui/Button";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/trade", label: "Trade" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/watchlist", label: "Watchlist" },
  { to: "/news", label: "News" },
];

const navLinkClass = ({ isActive }) =>
  clsx(
    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-slate-600 hover:text-brand-700 hover:bg-slate-100"
  );

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-brand transition-transform duration-200 group-hover:scale-105">
            <TrendingUp size={18} />
          </span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-brand-700 to-violet-700 bg-clip-text text-transparent">
            NiveshPath
          </h1>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1.5">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}

          <Button onClick={handleLogout} className="ml-3 px-4 py-2 text-sm">
            Logout
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-100 transition"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={clsx(
          "md:hidden overflow-hidden transition-all duration-300 ease-out border-t border-slate-200 bg-white",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-t-0"
        )}
      >
        <div className="px-6 py-4 flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={navLinkClass}
            >
              {link.label}
            </NavLink>
          ))}

          <Button onClick={handleLogout} className="w-full mt-1">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
