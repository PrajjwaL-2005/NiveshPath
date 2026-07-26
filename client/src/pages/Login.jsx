import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, TrendingUp, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center items-center bg-gradient-to-br from-brand-50 via-slate-50 to-violet-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-card w-full max-w-sm space-y-5 animate-fade-in"
      >
        <div className="flex flex-col items-center gap-2 mb-1">
          <span className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-brand">
            <TrendingUp size={22} />
          </span>
          <h2 className="text-xl font-bold text-slate-800">Welcome back</h2>
          <p className="text-sm text-slate-400">Log in to continue trading</p>
        </div>

        {error && (
          <p className="text-rose-600 text-sm text-center bg-rose-50 border border-rose-100 rounded-lg py-2 px-3">
            {error}
          </p>
        )}

        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Email"
            type="email"
            className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Password"
            type="password"
            className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-violet-600 text-white font-semibold p-2.5 rounded-xl shadow-soft transition-all duration-200 hover:shadow-brand hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-slate-500">
          No account?{" "}
          <Link to="/signup" className="text-brand-600 font-medium hover:text-brand-700">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
