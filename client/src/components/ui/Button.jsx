import clsx from "clsx";

export default function Button({ children, className, ...props }) {
  return (
    <button
      className={clsx(
        "px-5 py-2.5 bg-gradient-to-r from-brand-600 to-violet-600 text-white rounded-xl font-semibold cursor-pointer outline-none border-none shadow-soft transition-all duration-200 ease-out hover:shadow-brand hover:-translate-y-0.5 active:translate-y-0 active:shadow-soft focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
