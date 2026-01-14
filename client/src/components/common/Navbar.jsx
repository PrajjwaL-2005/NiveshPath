import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <h1 className="text-2xl font-bold text-blue-600">
          StockPilot
        </h1>

        {/* LINKS */}
        <div className="flex gap-8 text-gray-700 font-medium">
          <Link className="hover:text-blue-600" to="/">Dashboard</Link>
          <Link className="hover:text-blue-600" to="/trade">Trade</Link>
          <Link className="hover:text-blue-600" to="/portfolio">Portfolio</Link>
          <Link className="hover:text-blue-600" to="/news">News</Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
