import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

import Button from "../ui/Button";
import OutlineButton from "../ui/OutlineButton";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/trade", label: "Trade" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/watchlist", label: "Watchlist" },
  { to: "/news", label: "News" },
];

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
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">NiveshPath</h1>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              <OutlineButton className="px-3 py-2">{link.label}</OutlineButton>
            </Link>
          ))}

          <Button onClick={handleLogout} className="px-4 py-2">
            Logout
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t px-6 py-4 flex flex-col gap-3">
          {links.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}>
              <OutlineButton className="w-full px-3 py-2">{link.label}</OutlineButton>
            </Link>
          ))}

          <Button onClick={handleLogout} className="w-full px-4 py-2">
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
