import { Vehicle, EmergencyRequest } from "@/lib/mockData";
import { Ambulance, Flame, Shield } from "lucide-react";

interface Props {
  vehicles?: Vehicle[];
  requests?: EmergencyRequest[];
  highlightVehicleId?: string;
  className?: string;
}

const TYPE_ICON = {
  ambulance: Ambulance,
  fire: Flame,
  police: Shield,
};

// Project lat/lng onto a fixed bounding box for our mock map
const BOUNDS = { minLat: 12.89, maxLat: 12.99, minLng: 77.55, maxLng: 77.76 };

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = (1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
}

export function MapView({ vehicles = [], requests = [], highlightVehicleId, className }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border bg-surface scanline ${className || ""}`}
    >
      {/* Grid overlay */}
      <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" className="text-muted-foreground" />
      </svg>

      {/* Faux roads */}
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 Q30,38 50,45 T100,42" stroke="currentColor" strokeWidth="0.4" fill="none" className="text-border" />
        <path d="M0,70 Q40,65 60,72 T100,68" stroke="currentColor" strokeWidth="0.4" fill="none" className="text-border" />
        <path d="M30,0 Q35,30 32,55 T28,100" stroke="currentColor" strokeWidth="0.4" fill="none" className="text-border" />
        <path d="M70,0 Q68,40 72,60 T75,100" stroke="currentColor" strokeWidth="0.4" fill="none" className="text-border" />
      </svg>

      {/* Requests */}
      {requests.map((r) => {
        const { x, y } = project(r.location.lat, r.location.lng);
        return (
          <div
            key={r.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-critical pulse-ring">
              <span className="h-2 w-2 rounded-full bg-critical-foreground" />
            </div>
          </div>
        );
      })}

      {/* Vehicles */}
      {vehicles.map((v) => {
        const { x, y } = project(v.location.lat, v.location.lng);
        const Icon = TYPE_ICON[v.type];
        const highlight = v.id === highlightVehicleId;
        const color =
          v.status === "available" ? "bg-success" : v.status === "busy" ? "bg-warning" : "bg-muted";
        return (
          <div
            key={v.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div
              className={`relative flex h-8 w-8 items-center justify-center rounded-lg border-2 ${color} ${highlight ? "border-primary glow-primary" : "border-background/30"}`}
            >
              <Icon className="h-4 w-4 text-background" />
            </div>
            <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-1.5 py-0.5 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
              {v.callSign}
            </div>
          </div>
        );
      })}

      {/* Compass */}
      <div className="absolute top-3 right-3 rounded-lg border border-border bg-popover/80 backdrop-blur px-2 py-1 text-[10px] font-mono text-muted-foreground">
        BLR · LIVE GRID
      </div>
    </div>
  );
}
