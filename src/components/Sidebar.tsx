import { Link, useLocation } from "@tanstack/react-router";
import { Activity, Ambulance, BarChart3, LayoutDashboard, MapPin, Siren, Truck } from "lucide-react";

const NAV = [
  { to: "/", label: "Command", icon: LayoutDashboard },
  { to: "/request", label: "Request", icon: Siren },
  { to: "/admin", label: "Dispatch", icon: Activity },
  { to: "/tracking", label: "Tracking", icon: MapPin },
  { to: "/driver", label: "Responder", icon: Truck },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function Sidebar() {
  const location = useLocation();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur">
      <div className="px-6 py-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-emergency glow-primary">
            <Ambulance className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">RescueAI</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
              v1.0 · Live
            </div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-success blink" />
          SYSTEM ONLINE
        </div>
      </div>
    </aside>
  );
}
