import Link from "next/link";

function Icon({ name }) {
  const icons = {
    collapse: "K",
    dashboard: "⌂",
    product: "▦",
    transaction: "□",
    customers: "♙",
    report: "⌁",
    mail: "✉",
    bell: "⌁",
    plus: "+",
  };

  return <span className="grid size-5 place-items-center text-sm">{icons[name]}</span>;
}

export function DashboardShell({ active = "product", children }) {
  const navItems = [
    ["dashboard", "Dashboard", "/"],
    ["product", "Product (119)", "/product"],
    ["transaction", "Transaction (441)", "#"],
    ["customers", "Customers", "#"],
    ["report", "Sales Report", "#"],
  ];

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#24252d]">
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-[248px] border-r border-[#edf0f3] bg-white lg:block">
        <div className="flex h-20 items-center justify-end px-6">
          <button
            className="grid size-8 place-items-center rounded-md border border-transparent text-[#30323a]"
            aria-label="Collapse sidebar"
          >
            <Icon name="collapse" />
          </button>
        </div>

        <div className="mx-4 flex items-center gap-3 rounded-lg border border-[#d9dde3] px-3 py-3">
          <div className="grid size-9 place-items-center rounded-full bg-[#f25f62] text-xs font-bold text-white">
            NP
          </div>
          <div className="min-w-0">
            <p className="text-xs leading-4 text-[#8b9098]">Company</p>
            <p className="truncate text-sm font-semibold">Napworks</p>
          </div>
        </div>

        <nav className="mt-8 px-5">
          <p className="mb-4 text-xs font-semibold uppercase text-[#767b84]">General</p>
          <div className="flex flex-col gap-2">
            {navItems.map(([key, label, href]) => (
              <Link
                key={key}
                href={href}
                className={`flex h-9 items-center gap-3 rounded-lg px-3 text-sm ${
                  active === key
                    ? "bg-[#dcefff] font-semibold text-[#24252d]"
                    : "text-[#767b84] hover:bg-[#f4f7fb] hover:text-[#24252d]"
                }`}
              >
                <Icon name={key} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-10 flex h-[82px] items-center justify-between border-b border-[#dce1e7] bg-white px-4 sm:px-7">
          <Link href="/product" className="flex items-center gap-3 lg:hidden">
            <div className="grid size-9 place-items-center rounded-full bg-[#f25f62] text-xs font-bold text-white">
              NP
            </div>
            <span className="text-sm font-semibold">Napworks</span>
          </Link>

          <div className="hidden lg:block" />

          <div className="ml-auto flex items-center gap-3">
            <button className="relative grid size-8 place-items-center rounded-lg border border-[#e6e9ee] bg-white" aria-label="Messages">
              <Icon name="mail" />
              <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[#ff4747] text-[10px] font-bold text-white">
                2
              </span>
            </button>
            <button className="relative grid size-8 place-items-center rounded-lg border border-[#e6e9ee] bg-white" aria-label="Notifications">
              <Icon name="bell" />
              <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[#ff4747] text-[10px] font-bold text-white">
                8
              </span>
            </button>
            <div className="h-7 w-px bg-[#d8dde3]" />
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-9 rounded-lg bg-[linear-gradient(135deg,#f0b17c,#253043)]" />
                <span className="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-white bg-[#28c76f]" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold leading-4">Guy Hawkins</p>
                <p className="text-xs text-[#7e838b]">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-7 sm:px-7">{children}</main>
      </div>
    </div>
  );
}


export { Icon };
