import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MapView } from "@/components/MapView";
import { MOCK_REQUESTS, MOCK_VEHICLES, EmergencyRequest, findBestVehicle } from "@/lib/mockData";
import { Ambulance, CheckCircle2, Clock, Flame, Shield, Siren, Zap } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Dispatch Center · RescueAI" },
      { name: "description", content: "Real-time control room for emergency dispatch with AI-recommended assignments." },
      { property: "og:title", content: "Dispatch Center · RescueAI" },
      { property: "og:description", content: "Approve AI assignments, monitor live units, manage open requests." },
    ],
  }),
  component: AdminPage,
});

const TYPE_ICON = { ambulance: Ambulance, fire: Flame, police: Shield };
const STATUS_TONE: Record<string, string> = {
  pending: "bg-critical/15 text-critical border-critical/30",
  assigned: "bg-warning/15 text-warning border-warning/30",
  enroute: "bg-accent/15 text-accent border-accent/30",
  completed: "bg-success/15 text-success border-success/30",
};

function AdminPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>(MOCK_REQUESTS);
  const [selectedId, setSelectedId] = useState<string>(requests[0]?.id);

  const selected = requests.find((r) => r.id === selectedId);
  const recommendation = selected
    ? findBestVehicle({ type: selected.type, severity: selected.severity, location: selected.location }, MOCK_VEHICLES)
    : undefined;

  const assign = (reqId: string) => {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;
    const best = findBestVehicle({ type: req.type, severity: req.severity, location: req.location }, MOCK_VEHICLES);
    if (!best) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: "assigned",
              assignedVehicleId: best.vehicle.id,
              etaMinutes: Math.max(2, Math.round(best.distanceKm * 3.5)),
              distanceKm: Math.round(best.distanceKm * 10) / 10,
              priorityScore: best.score,
            }
          : r,
      ),
    );
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-8 py-6 lg:py-10 space-y-6 max-w-[1600px] mx-auto">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-primary">Dispatch Center</div>
            <h1 className="text-3xl font-bold tracking-tight mt-1">Operations Console</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success blink" /> SYNCED · {new Date().toLocaleTimeString()}
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi icon={Siren} label="Open" value={requests.filter((r) => r.status === "pending").length} tone="text-critical" />
          <Kpi icon={Zap} label="Assigned" value={requests.filter((r) => r.status === "assigned").length} tone="text-warning" />
          <Kpi icon={Clock} label="En route" value={requests.filter((r) => r.status === "enroute").length} tone="text-accent" />
          <Kpi icon={CheckCircle2} label="Available units" value={MOCK_VEHICLES.filter((v) => v.status === "available").length} tone="text-success" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Request queue */}
          <div className="lg:col-span-1 rounded-2xl border border-border bg-surface overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold">Active Queue</h2>
              <span className="text-xs font-mono text-muted-foreground">{requests.length} cases</span>
            </div>
            <div className="divide-y divide-border max-h-[600px] overflow-auto">
              {requests
                .sort((a, b) => b.priorityScore - a.priorityScore)
                .map((r) => {
                  const Icon = TYPE_ICON[r.type];
                  const active = r.id === selectedId;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      className={`w-full text-left px-5 py-4 transition ${active ? "bg-primary/5 border-l-2 border-primary" : "hover:bg-surface-elevated"}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className="h-4 w-4 text-primary shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">{r.location.address}</div>
                            <div className="text-xs text-muted-foreground truncate">{r.description}</div>
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] uppercase font-mono tracking-wider ${STATUS_TONE[r.status]}`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                        <span>SEV·{r.severity}</span>
                        <span>SCORE·{r.priorityScore}</span>
                        {r.etaMinutes && <span>ETA·{r.etaMinutes}m</span>}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Map + recommendation */}
          <div className="lg:col-span-2 space-y-6">
            <MapView
              vehicles={MOCK_VEHICLES}
              requests={requests.filter((r) => r.status !== "completed")}
              highlightVehicleId={selected?.assignedVehicleId || recommendation?.vehicle.id}
              className="h-[420px]"
            />
            {selected && (
              <div className="rounded-2xl border border-border bg-surface p-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Case #{selected.id.toUpperCase()}
                    </div>
                    <h3 className="text-xl font-bold mt-1">{selected.description}</h3>
                    <div className="text-sm text-muted-foreground mt-1">{selected.location.address}</div>
                  </div>
                  <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] uppercase font-mono tracking-wider ${STATUS_TONE[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>

                {recommendation && selected.status === "pending" ? (
                  <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono uppercase tracking-wider text-primary">AI Recommendation</div>
                      <div className="text-xs font-mono text-muted-foreground">Score {recommendation.score}</div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-sm">
                      <Field label="Unit" value={recommendation.vehicle.callSign} />
                      <Field label="Driver" value={recommendation.vehicle.driver} />
                      <Field label="Distance" value={`${recommendation.distanceKm.toFixed(1)} km`} />
                      <Field label="ETA" value={`${Math.max(2, Math.round(recommendation.distanceKm * 3.5))} min`} />
                    </div>
                    <button
                      onClick={() => assign(selected.id)}
                      className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                    >
                      Confirm assignment
                    </button>
                  </div>
                ) : (
                  selected.assignedVehicleId && (
                    <div className="rounded-xl border border-border bg-surface-elevated p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-sm">
                      <Field label="Unit" value={MOCK_VEHICLES.find((v) => v.id === selected.assignedVehicleId)?.callSign || "-"} />
                      <Field label="ETA" value={`${selected.etaMinutes} min`} />
                      <Field label="Distance" value={`${selected.distanceKm} km`} />
                      <Field label="Priority" value={selected.priorityScore.toString()} />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fleet roster */}
        <section className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold">Fleet Roster</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3">Unit</th>
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-left px-5 py-3">Driver</th>
                  <th className="text-left px-5 py-3">Base</th>
                  <th className="text-left px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_VEHICLES.map((v) => {
                  const Icon = TYPE_ICON[v.type];
                  return (
                    <tr key={v.id} className="border-b border-border last:border-0 hover:bg-surface-elevated">
                      <td className="px-5 py-3 font-mono font-semibold">{v.callSign}</td>
                      <td className="px-5 py-3 capitalize"><span className="inline-flex items-center gap-2"><Icon className="h-3.5 w-3.5 text-muted-foreground" />{v.type}</span></td>
                      <td className="px-5 py-3">{v.driver}</td>
                      <td className="px-5 py-3 text-muted-foreground">{v.location.label}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider ${
                          v.status === "available" ? "border-success/40 text-success bg-success/10" :
                          v.status === "busy" ? "border-warning/40 text-warning bg-warning/10" :
                          "border-muted text-muted-foreground bg-muted/30"
                        }`}>{v.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Kpi({ icon: Icon, label, value, tone }: { icon: typeof Siren; label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">{label}</span>
        <Icon className={`h-4 w-4 ${tone}`} />
      </div>
      <div className="mt-3 text-3xl font-bold font-mono">{value}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-semibold mt-0.5">{value}</div>
    </div>
  );
}
