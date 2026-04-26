import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { Ambulance } from "lucide-react";

const MOBILE_NAV = [
  { to: "/", label: "Home" },
  { to: "/request", label: "SOS" },
  { to: "/admin", label: "Dispatch" },
  { to: "/tracking", label: "Track" },
  { to: "/driver", label: "Driver" },
  { to: "/analytics", label: "Stats" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between border-b border-border px-4 py-3 bg-surface/80 backdrop-blur sticky top-0 z-40">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-emergency">
              <Ambulance className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">RescueAI</span>
          </Link>
          <span className="text-xs font-mono text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success blink mr-1.5 align-middle" />
            LIVE
          </span>
        </header>
        <main className="flex-1 min-w-0">{children}</main>
        <nav className="lg:hidden sticky bottom-0 z-40 grid grid-cols-6 border-t border-border bg-surface/95 backdrop-blur">
          {MOBILE_NAV.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`text-center py-2.5 text-[10px] font-medium uppercase tracking-wider ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
