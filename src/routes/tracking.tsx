import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MapView } from "@/components/MapView";
import { MOCK_REQUESTS, MOCK_VEHICLES } from "@/lib/mockData";
import { useEffect, useState } from "react";
import { Clock, MapPin, Navigation, Phone, Radio } from "lucide-react";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Live Tracking · RescueAI" },
      { name: "description", content: "Watch your assigned emergency unit approach in real time." },
      { property: "og:title", content: "Live Tracking · RescueAI" },
      { property: "og:description", content: "Real-time location and ETA of dispatched emergency vehicles." },
    ],
  }),
  component: TrackingPage,
});

function TrackingPage() {
  const active = MOCK_REQUESTS.find((r) => r.status === "enroute") || MOCK_REQUESTS[0];
  const vehicle = MOCK_VEHICLES.find((v) => v.id === active.assignedVehicleId);
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    const t = setInterval(() => setProgress((p) => (p < 95 ? p + 1 : p)), 1500);
    return () => clearInterval(t);
  }, []);

  const eta = Math.max(1, Math.round(((100 - progress) / 100) * (active.etaMinutes || 8)));

  return (
    <AppShell>
      <div className="px-4 sm:px-8 py-6 lg:py-10 space-y-6 max-w-6xl mx-auto">
        <header>
          <div className="text-xs font-mono uppercase tracking-wider text-primary">Live tracking</div>
          <h1 className="text-3xl font-bold mt-1">{vehicle?.callSign} en route</h1>
          <p className="text-muted-foreground mt-1">{active.location.address}</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MapView
              vehicles={vehicle ? [vehicle] : []}
              requests={[active]}
              highlightVehicleId={vehicle?.id}
              className="h-[480px]"
            />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-primary/30 bg-gradient-surface p-6 glow-primary">
              <div className="text-xs font-mono uppercase tracking-wider text-primary">ETA</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-bold font-mono">{eta}</span>
                <span className="text-muted-foreground">min</span>
              </div>
              <div className="mt-5 h-2 rounded-full bg-surface overflow-hidden">
                <div
                  className="h-full bg-gradient-emergency transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-xs font-mono text-muted-foreground">{progress}% · approaching</div>
            </div>

            {vehicle && (
              <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
                    <Radio className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{vehicle.driver}</div>
                    <div className="text-xs text-muted-foreground font-mono">{vehicle.callSign} · {vehicle.type}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="rounded-xl border border-border bg-surface-elevated py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" /> Call
                  </button>
                  <button className="rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2">
                    <Navigation className="h-4 w-4" /> Share
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Timeline</div>
              <ol className="space-y-3 text-sm">
                {[
                  { icon: MapPin, label: "Request received", time: "0:00", done: true },
                  { icon: Radio, label: "Unit assigned", time: "0:14", done: true },
                  { icon: Navigation, label: "En route", time: "0:32", done: true },
                  { icon: Clock, label: "Arrival", time: `${eta}m`, done: false },
                ].map((step) => (
                  <li key={step.label} className="flex items-center gap-3">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full border ${step.done ? "border-success bg-success/15 text-success" : "border-border text-muted-foreground"}`}>
                      <step.icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className={step.done ? "" : "text-muted-foreground"}>{step.label}</span>
                      <span className="font-mono text-xs text-muted-foreground">{step.time}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
