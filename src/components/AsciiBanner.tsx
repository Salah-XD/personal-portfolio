const banner = String.raw`
███████╗ █████╗ ██╗      █████╗ ██╗  ██╗
██╔════╝██╔══██╗██║     ██╔══██╗██║  ██║
███████╗███████║██║     ███████║███████║
╚════██║██╔══██║██║     ██╔══██║██╔══██║
███████║██║  ██║███████╗██║  ██║██║  ██║
╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝`;

export default function AsciiBanner() {
  return (
    <pre
      data-anim="hero-banner"
      aria-hidden="true"
      className="hidden sm:block font-mono leading-[1.05] text-[10px] md:text-xs lg:text-sm text-slate-700 dark:text-emerald-400 select-none mb-6 overflow-hidden"
    >
      {banner}
    </pre>
  );
}
