import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import Button from "../ui/Button";
import OutlineButton from "../ui/OutlineButton";

const Navbar = () => {
  const { logout } = useContext(AuthContext);   
  const navigate = useNavigate();              
  const handleLogout = () => {
    logout();         
    navigate("/login"); 
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-black">
          NiveshPath
        </h1>

        <div className="flex items-center gap-6">

          <Link to="/">
            <OutlineButton className="px-3 py-2">Dashboard</OutlineButton>
          </Link>

          <Link to="/trade">
            <OutlineButton className="px-3 py-2">Trade</OutlineButton>
          </Link>

          <Link to="/portfolio">
            <OutlineButton className="px-3 py-2">Portfolio</OutlineButton>
          </Link>

          <Link to="/news">
            <OutlineButton className="px-3 py-2">News</OutlineButton>
          </Link>

          {/* Logout */}
          <Button onClick={handleLogout} className="px-4 py-2">
            Logout
          </Button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;