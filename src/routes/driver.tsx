import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MapView } from "@/components/MapView";
import { MOCK_REQUESTS, MOCK_VEHICLES } from "@/lib/mockData";
import { useState } from "react";
import { CheckCircle2, MapPin, Navigation, Phone, Siren } from "lucide-react";

export const Route = createFileRoute("/driver")({
  head: () => ({
    meta: [
      { title: "Responder Console · RescueAI" },
      { name: "description", content: "Driver dashboard with assigned cases and turn-by-turn route guidance." },
      { property: "og:title", content: "Responder Console · RescueAI" },
      { property: "og:description", content: "Accept dispatched cases and follow the fastest route." },
    ],
  }),
  component: DriverPage,
});

const STATUSES = ["assigned", "enroute", "on-scene", "completed"] as const;

function DriverPage() {
  // Pretend the logged-in driver is AMB-12 (v2)
  const me = MOCK_VEHICLES.find((v) => v.id === "v2")!;
  const myCase = MOCK_REQUESTS.find((r) => r.assignedVehicleId === me.id) || MOCK_REQUESTS[0];
  const [statusIdx, setStatusIdx] = useState(1);

  return (
    <AppShell>
      <div className="px-4 sm:px-8 py-6 lg:py-10 space-y-6 max-w-5xl mx-auto">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-primary">Responder Console</div>
            <h1 className="text-3xl font-bold mt-1">{me.callSign} · {me.driver}</h1>
          </div>
          <span className="rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-mono uppercase tracking-wider text-success">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success blink mr-1.5 align-middle" />
            On duty
          </span>
        </header>

        <div className="rounded-2xl border border-critical/40 bg-critical/5 p-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-critical/15 pulse-ring">
            <Siren className="h-5 w-5 text-critical" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-mono uppercase tracking-wider text-critical">Active dispatch</div>
            <h2 className="text-xl font-bold mt-1">{myCase.description}</h2>
            <div className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> {myCase.location.address}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs font-mono text-muted-foreground">
              <span>SEV·{myCase.severity}</span>
              <span>SCORE·{myCase.priorityScore}</span>
              {myCase.etaMinutes && <span>ETA·{myCase.etaMinutes}m</span>}
              {myCase.distanceKm && <span>{myCase.distanceKm}km</span>}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MapView vehicles={[me]} requests={[myCase]} highlightVehicleId={me.id} className="h-[420px]" />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Status</div>
              <div className="space-y-2">
                {STATUSES.map((s, i) => {
                  const reached = i <= statusIdx;
                  return (
                    <button
                      key={s}
                      onClick={() => setStatusIdx(i)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition border ${
                        reached
                          ? "border-success/40 bg-success/10 text-success"
                          : "border-border bg-surface-elevated text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="capitalize">{s}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="rounded-xl border border-border bg-surface py-3 text-sm font-semibold flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" /> Reporter
              </button>
              <button className="rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2">
                <Navigation className="h-4 w-4" /> Navigate
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Route hints</div>
              <ol className="space-y-2 text-sm">
                <li className="flex justify-between"><span>Head south on Hosur Rd</span><span className="font-mono text-muted-foreground">800m</span></li>
                <li className="flex justify-between"><span>Right onto 80 Ft Rd</span><span className="font-mono text-muted-foreground">400m</span></li>
                <li className="flex justify-between"><span>Continue past Forum Mall</span><span className="font-mono text-muted-foreground">200m</span></li>
                <li className="flex justify-between text-success"><span>Arrive at scene</span><span className="font-mono">·</span></li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
