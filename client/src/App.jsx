import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Trading from "./pages/Trading";
import Portfolio from "./pages/Portfolio";
import News from "./pages/News";
import StockDetail from "./pages/StockDetail";
import ProtectedRoute from "./components/common/ProtectedRoute";


// inside <Routes>


function App() {
  return (
    <BrowserRouter>
      {/* NAVBAR ALWAYS ON TOP */}
      <Navbar />

      {/* MAIN PAGE CONTAINER */}
      <div className="min-h-screen bg-gray-100">
        <Routes>
          
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/trade"
            element={
              <ProtectedRoute>
                <Trading />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/stocks/:symbol" element={<StockDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

