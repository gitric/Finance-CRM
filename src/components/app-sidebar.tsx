"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  Award,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/entities", label: "Entities", icon: Building2 },
  { href: "/managers", label: "Managers", icon: Users },
  { href: "/training", label: "Training", icon: GraduationCap },
  { href: "/certifications", label: "Certifications", icon: Award },
  { href: "/audits", label: "Audits", icon: ClipboardCheck },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-sidebar h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight">AuditCRM</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">
          Financial Auditor Portal
        </p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <p className="text-xs text-sidebar-foreground/50">
          v1.0.0
        </p>
      </div>
    </div>
  );
}