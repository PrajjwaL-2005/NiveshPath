import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { getOrders, cancelOrder } from "../../services/orderService";

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-100",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-100",
  FILLED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
  EXPIRED: "bg-slate-100 text-slate-500 border-slate-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-100",
};

const PendingOrders = ({ refreshToken }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders({ status: "PENDING", limit: 20 });
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshToken]);

  const handleCancel = async (orderId) => {
    try {
      setCancellingId(orderId);
      await cancelOrder(orderId);
      toast.success("Order cancelled");
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  if (!loading && orders.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-soft p-5 space-y-3">
      <p className="text-sm font-semibold text-slate-700">Pending Orders</p>
      <div className="space-y-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between border border-slate-100 rounded-xl px-3 py-2 text-sm"
          >
            <div>
              <span className="font-semibold text-slate-800">{order.symbol}</span>{" "}
              <span className="text-slate-500">
                {order.side} {order.quantity} · {order.orderType === "LIMIT" ? "Limit" : "Stop-Loss"}{" "}
                @ ₹{order.triggerPrice}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.status]}`}
              >
                {order.status}
              </span>
              <button
                onClick={() => handleCancel(order.id)}
                disabled={cancellingId === order.id}
                className="text-slate-400 hover:text-rose-600 transition-colors disabled:opacity-40"
                title="Cancel order"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingOrders;
