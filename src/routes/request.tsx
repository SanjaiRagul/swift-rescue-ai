import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Ambulance, Flame, MapPin, Shield, Siren } from "lucide-react";
import { Severity, VehicleType, findBestVehicle, MOCK_VEHICLES } from "@/lib/mockData";

export const Route = createFileRoute("/request")({
  head: () => ({
    meta: [
      { title: "Send Emergency · RescueAI" },
      { name: "description", content: "Submit an emergency request — the nearest available unit will be dispatched in seconds." },
      { property: "og:title", content: "Send Emergency · RescueAI" },
      { property: "og:description", content: "One-tap emergency request with GPS, type, and severity." },
    ],
  }),
  component: RequestPage,
});

const TYPES: { id: VehicleType; label: string; icon: typeof Ambulance; desc: string }[] = [
  { id: "ambulance", label: "Medical", icon: Ambulance, desc: "Injury · cardiac · medical" },
  { id: "fire", label: "Fire", icon: Flame, desc: "Fire · gas · rescue" },
  { id: "police", label: "Police", icon: Shield, desc: "Crime · accident · safety" },
];

const SEVERITY: { id: Severity; label: string; tone: string }[] = [
  { id: 1, label: "Minor", tone: "border-muted text-muted-foreground" },
  { id: 2, label: "Low", tone: "border-success/40 text-success" },
  { id: 3, label: "Moderate", tone: "border-warning/50 text-warning" },
  { id: 4, label: "Severe", tone: "border-accent/60 text-accent" },
  { id: 5, label: "Critical", tone: "border-critical text-critical" },
];

function RequestPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<VehicleType>("ambulance");
  const [severity, setSeverity] = useState<Severity>(4);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState<null | {
    callSign: string;
    eta: number;
    distance: number;
    score: number;
  }>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated user location (Forum Mall, Koramangala)
    const loc = { lat: 12.9352, lng: 77.6145 };
    const best = findBestVehicle({ type, severity, location: loc }, MOCK_VEHICLES);
    if (!best) return;
    setSubmitted({
      callSign: best.vehicle.callSign,
      eta: Math.max(2, Math.round(best.distanceKm * 3.5)),
      distance: Math.round(best.distanceKm * 10) / 10,
      score: best.score,
    });
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-8 py-6 lg:py-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-3">
            <Siren className="h-3.5 w-3.5" /> Emergency request
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Get help now.</h1>
          <p className="text-muted-foreground mt-2">Three taps. Nearest unit dispatched automatically.</p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-success/40 bg-success/5 p-8 text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 pulse-ring">
              <Ambulance className="h-7 w-7 text-success" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Unit dispatched</h2>
              <p className="text-muted-foreground mt-1">{submitted.callSign} is on the way.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto font-mono">
              <Stat label="ETA" value={`${submitted.eta}m`} />
              <Stat label="Distance" value={`${submitted.distance}km`} />
              <Stat label="Priority" value={submitted.score.toString()} />
            </div>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button
                onClick={() => navigate({ to: "/tracking" })}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Track live
              </button>
              <button
                onClick={() => setSubmitted(null)}
                className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold"
              >
                New request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Type */}
            <Field label="What's the emergency?">
              <div className="grid grid-cols-3 gap-3">
                {TYPES.map((t) => {
                  const active = type === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-primary bg-primary/10 glow-primary"
                          : "border-border bg-surface hover:border-primary/40"
                      }`}
                    >
                      <t.icon className={`h-5 w-5 mb-2 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="font-semibold">{t.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Severity */}
            <Field label="How serious?">
              <div className="grid grid-cols-5 gap-2">
                {SEVERITY.map((s) => {
                  const active = severity === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSeverity(s.id)}
                      className={`rounded-xl border-2 p-3 text-center transition ${
                        active ? `${s.tone} bg-surface-elevated` : "border-border bg-surface text-muted-foreground"
                      }`}
                    >
                      <div className="font-mono text-lg font-bold">{s.id}</div>
                      <div className="text-[10px] uppercase tracking-wider">{s.label}</div>
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Description */}
            <Field label="What happened? (optional)">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description so responders know what to expect…"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </Field>

            {/* Location */}
            <Field label="Location">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                <MapPin className="h-4 w-4 text-success" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">Forum Mall, Koramangala</div>
                  <div className="text-xs text-muted-foreground font-mono">12.9352° N, 77.6145° E · GPS lock</div>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-success">Live</span>
              </div>
            </Field>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-emergency py-4 text-base font-bold text-primary-foreground glow-primary hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <Siren className="h-5 w-5" /> Dispatch nearest unit
            </button>
          </form>
        )}
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}
