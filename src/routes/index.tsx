import { Link, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MapView } from "@/components/MapView";
import { MOCK_REQUESTS, MOCK_VEHICLES } from "@/lib/mockData";
import { Activity, Ambulance, ArrowRight, Clock, Flame, Shield, Siren, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RescueAI — AI Emergency Dispatch" },
      {
        name: "description",
        content: "AI-powered emergency response system that allocates the nearest ambulance, fire, and police units in real time.",
      },
      { property: "og:title", content: "RescueAI — AI Emergency Dispatch" },
      { property: "og:description", content: "Smart resource allocation for emergency response with priority scoring and live tracking." },
    ],
  }),
  component: Index,
});

function Index() {
  const activeRequests = MOCK_REQUESTS.filter((r) => r.status !== "completed");
  const available = MOCK_VEHICLES.filter((v) => v.status === "available").length;
  const busy = MOCK_VEHICLES.filter((v) => v.status === "busy").length;

  return (
    <AppShell>
      <div className="px-4 sm:px-8 py-6 lg:py-10 space-y-10 max-w-7xl mx-auto">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-surface p-6 sm:p-10 lg:p-14">
          <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary blink" />
                Operational · 8 units · 3 active
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                Every second
                <br />
                <span className="text-primary">saves a life.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                AI-powered dispatch that finds the nearest available unit, scores severity, and routes around traffic — automatically.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/request"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-primary hover:opacity-90 transition"
                >
                  <Siren className="h-4 w-4" /> Send Emergency
                </Link>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-elevated px-6 py-3 text-sm font-semibold hover:border-primary/40 transition"
                >
                  Open Dispatch <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <MapView vehicles={MOCK_VEHICLES} requests={activeRequests} className="h-[420px]" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Active Units", value: available, icon: Zap, color: "text-success" },
            { label: "On Mission", value: busy, icon: Activity, color: "text-warning" },
            { label: "Open Requests", value: activeRequests.length, icon: Siren, color: "text-primary" },
            { label: "Avg Response", value: "6.2m", icon: Clock, color: "text-accent" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                  {s.label}
                </span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div className="mt-3 text-3xl font-bold font-mono">{s.value}</div>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Built for the worst day of someone's life</h2>
            <p className="text-muted-foreground mt-2">Three roles. One coordinated response.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Siren,
                title: "Citizens report",
                desc: "One tap sends GPS, type, and severity. No forms in a panic.",
                to: "/request" as const,
                cta: "Try the SOS form",
              },
              {
                icon: Activity,
                title: "AI dispatches",
                desc: "Priority score = severity × 50 + distance + traffic + availability.",
                to: "/admin" as const,
                cta: "Open dispatch",
              },
              {
                icon: Ambulance,
                title: "Responders arrive",
                desc: "Drivers receive the case + fastest route. Citizens watch live.",
                to: "/driver" as const,
                cta: "Driver view",
              },
            ].map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="group rounded-2xl border border-border bg-surface p-6 hover:border-primary/40 hover:bg-surface-elevated transition"
              >
                <c.icon className="h-6 w-6 text-primary mb-4" />
                <div className="text-lg font-semibold">{c.title}</div>
                <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-primary group-hover:gap-2 transition-all">
                  {c.cta} <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Service types */}
        <section className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Ambulance, label: "Medical", count: MOCK_VEHICLES.filter((v) => v.type === "ambulance").length },
            { icon: Flame, label: "Fire & Rescue", count: MOCK_VEHICLES.filter((v) => v.type === "fire").length },
            { icon: Shield, label: "Police", count: MOCK_VEHICLES.filter((v) => v.type === "police").length },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-surface p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">{s.label}</div>
                <div className="text-sm text-muted-foreground font-mono">{s.count} units in fleet</div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
