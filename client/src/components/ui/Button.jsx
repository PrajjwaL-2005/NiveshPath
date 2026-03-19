import clsx from "clsx";

export default function Button({ children, className, ...props }) {
  return (
    <button
      className={clsx(
        "px-5 py-4 bg-[#151515] text-[#eee] rounded-[7px] font-semibold cursor-pointer outline-none border-none transition-all duration-200 ease-out hover:-translate-y-[3px]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}