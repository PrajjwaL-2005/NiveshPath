import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <h1 className="text-xl font-bold text-blue-600">
        NiveshPath
      </h1>

      {user && (
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:text-blue-600">Dashboard</Link>
          <Link to="/trade" className="hover:text-blue-600">Trade</Link>
          <Link to="/portfolio" className="hover:text-blue-600">Portfolio</Link>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
