"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Medical Tests", href: "/medicaltests" },
    { name: "Categories", href: "/testcategories" },
    { name: "Units (UOM)", href: "/uom" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="font-bold text-slate-800 tracking-tighter">
          MED<span className="text-blue-500">LAB</span>
        </div>
        <div className="flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-1.5 text-sm font-medium transition-all ${
                pathname === item.href
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
