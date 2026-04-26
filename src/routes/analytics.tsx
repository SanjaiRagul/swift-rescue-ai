import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MOCK_VEHICLES } from "@/lib/mockData";
import { Activity, Clock, TrendingDown, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics · RescueAI" },
      { name: "description", content: "Operational analytics: response times, dispatch volume, and unit utilization." },
      { property: "og:title", content: "Analytics · RescueAI" },
      { property: "og:description", content: "Performance metrics for emergency response operations." },
    ],
  }),
  component: AnalyticsPage,
});

const HOURLY = [12, 18, 9, 14, 22, 31, 28, 36, 42, 38, 27, 19];
const TYPES = [
  { label: "Medical", value: 58, color: "bg-primary" },
  { label: "Fire", value: 22, color: "bg-accent" },
  { label: "Police", value: 31, color: "bg-success" },
];

function AnalyticsPage() {
  const max = Math.max(...HOURLY);

  return (
    <AppShell>
      <div className="px-4 sm:px-8 py-6 lg:py-10 space-y-6 max-w-6xl mx-auto">
        <header>
          <div className="text-xs font-mono uppercase tracking-wider text-primary">Analytics</div>
          <h1 className="text-3xl font-bold mt-1">Performance overview</h1>
          <p className="text-muted-foreground mt-1">Last 24 hours · Bangalore region</p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Metric label="Avg response" value="6.2 min" delta="-12%" trend="down" tone="text-success" />
          <Metric label="Dispatched" value="111" delta="+18" trend="up" tone="text-accent" />
          <Metric label="Completion" value="96%" delta="+2%" trend="up" tone="text-success" />
          <Metric label="Utilization" value="74%" delta="+5%" trend="up" tone="text-warning" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">Calls per hour</h2>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-end gap-2 h-48">
              {HOURLY.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary/40 transition-all"
                    style={{ height: `${(v / max) * 100}%` }}
                  />
                  <span className="text-[10px] font-mono text-muted-foreground">{i * 2}h</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-semibold mb-6">By service</h2>
            <div className="space-y-5">
              {TYPES.map((t) => {
                const total = TYPES.reduce((s, x) => s + x.value, 0);
                const pct = Math.round((t.value / total) * 100);
                return (
                  <div key={t.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span>{t.label}</span>
                      <span className="font-mono text-muted-foreground">{t.value} · {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
                      <div className={`h-full ${t.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Unit performance</h2>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3">Unit</th>
                  <th className="text-left px-5 py-3">Trips</th>
                  <th className="text-left px-5 py-3">Avg ETA</th>
                  <th className="text-left px-5 py-3">Utilization</th>
                  <th className="text-left px-5 py-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_VEHICLES.slice(0, 6).map((v, i) => {
                  const trips = 8 + ((i * 3) % 11);
                  const eta = (4 + (i % 4) * 0.7).toFixed(1);
                  const util = 50 + ((i * 9) % 45);
                  return (
                    <tr key={v.id} className="border-b border-border last:border-0 hover:bg-surface-elevated">
                      <td className="px-5 py-3 font-mono font-semibold">{v.callSign}</td>
                      <td className="px-5 py-3 font-mono">{trips}</td>
                      <td className="px-5 py-3 font-mono">{eta} min</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded-full bg-surface-elevated overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${util}%` }} />
                          </div>
                          <span className="font-mono text-xs text-muted-foreground">{util}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono">{200 + i * 12}</td>
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

function Metric({ label, value, delta, trend, tone }: { label: string; value: string; delta: string; trend: "up" | "down"; tone: string }) {
  const Icon = trend === "up" ? TrendingUp : TrendingDown;
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono">{label}</div>
      <div className="mt-2 text-3xl font-bold font-mono">{value}</div>
      <div className={`mt-1 inline-flex items-center gap-1 text-xs font-mono ${tone}`}>
        <Icon className="h-3 w-3" /> {delta}
      </div>
    </div>
  );
}
