import clsx from "clsx";

export default function OutlineButton({ children, className, ...props }) {
  return (
    <button
      className={clsx(
        "px-5 py-2.5 bg-white text-slate-600 rounded-xl font-semibold cursor-pointer outline-none border border-slate-200 transition-all duration-200 ease-out hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
