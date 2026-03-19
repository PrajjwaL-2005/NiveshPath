import clsx from "clsx";

export default function OutlineButton({ children, className, ...props }) {
  return (
    <button
      className={clsx(
        "px-5 py-4 bg-transparent text-black rounded-[7px] font-semibold cursor-pointer outline-none border border-transparent transition-all duration-200 ease-out hover:border-black hover:-translate-y-[3px]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}