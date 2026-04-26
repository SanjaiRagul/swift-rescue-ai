export type VehicleType = "ambulance" | "fire" | "police";
export type RequestStatus = "pending" | "assigned" | "enroute" | "completed";
export type Severity = 1 | 2 | 3 | 4 | 5;

export interface Vehicle {
  id: string;
  callSign: string;
  type: VehicleType;
  status: "available" | "busy" | "offline";
  location: { lat: number; lng: number; label: string };
  driver: string;
}

export interface EmergencyRequest {
  id: string;
  type: VehicleType;
  severity: Severity;
  description: string;
  location: { lat: number; lng: number; address: string };
  reporter: string;
  createdAt: Date;
  status: RequestStatus;
  assignedVehicleId?: string;
  priorityScore: number;
  etaMinutes?: number;
  distanceKm?: number;
}

export const MOCK_VEHICLES: Vehicle[] = [
  { id: "v1", callSign: "AMB-07", type: "ambulance", status: "available", location: { lat: 12.9716, lng: 77.5946, label: "MG Road Hub" }, driver: "R. Kumar" },
  { id: "v2", callSign: "AMB-12", type: "ambulance", status: "available", location: { lat: 12.9352, lng: 77.6245, label: "Koramangala Base" }, driver: "S. Devi" },
  { id: "v3", callSign: "AMB-21", type: "ambulance", status: "busy", location: { lat: 12.9081, lng: 77.6476, label: "HSR Layout" }, driver: "A. Khan" },
  { id: "v4", callSign: "FIRE-03", type: "fire", status: "available", location: { lat: 12.9784, lng: 77.6408, label: "Indiranagar Station" }, driver: "M. Singh" },
  { id: "v5", callSign: "FIRE-09", type: "fire", status: "available", location: { lat: 12.9250, lng: 77.5938, label: "Jayanagar Station" }, driver: "P. Rao" },
  { id: "v6", callSign: "PCR-14", type: "police", status: "available", location: { lat: 12.9698, lng: 77.7500, label: "Whitefield Patrol" }, driver: "V. Iyer" },
  { id: "v7", callSign: "PCR-22", type: "police", status: "available", location: { lat: 12.9611, lng: 77.6387, label: "Ulsoor Patrol" }, driver: "N. Sharma" },
  { id: "v8", callSign: "PCR-31", type: "police", status: "offline", location: { lat: 12.9000, lng: 77.5800, label: "BTM Patrol" }, driver: "K. Joshi" },
];

export const MOCK_REQUESTS: EmergencyRequest[] = [
  {
    id: "r1",
    type: "ambulance",
    severity: 5,
    description: "Cardiac arrest reported at office building",
    location: { lat: 12.9352, lng: 77.6145, address: "Forum Mall, Koramangala" },
    reporter: "Anonymous",
    createdAt: new Date(Date.now() - 4 * 60 * 1000),
    status: "enroute",
    assignedVehicleId: "v2",
    priorityScore: 287,
    etaMinutes: 6,
    distanceKm: 1.2,
  },
  {
    id: "r2",
    type: "fire",
    severity: 4,
    description: "Smoke from electrical panel, no flames yet",
    location: { lat: 12.9784, lng: 77.6308, address: "100 Ft Rd, Indiranagar" },
    reporter: "S. Mehta",
    createdAt: new Date(Date.now() - 12 * 60 * 1000),
    status: "assigned",
    assignedVehicleId: "v4",
    priorityScore: 232,
    etaMinutes: 9,
    distanceKm: 1.8,
  },
  {
    id: "r3",
    type: "police",
    severity: 3,
    description: "Two-wheeler collision, minor injuries",
    location: { lat: 12.9611, lng: 77.6487, address: "CMH Rd, Indiranagar" },
    reporter: "Bystander",
    createdAt: new Date(Date.now() - 18 * 60 * 1000),
    status: "pending",
    priorityScore: 178,
  },
];

// Haversine distance in km
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Priority Score = Severity × 50 + DistanceFactor + TrafficFactor + AvailabilityFactor
export function priorityScore(opts: {
  severity: Severity;
  distanceKm: number;
  trafficLevel: 0 | 1 | 2; // low, med, high
  available: boolean;
}) {
  const sev = opts.severity * 50;
  const dist = Math.max(0, 60 - opts.distanceKm * 6); // closer = higher
  const traffic = [30, 15, 0][opts.trafficLevel];
  const avail = opts.available ? 40 : 0;
  return Math.round(sev + dist + traffic + avail);
}

export function findBestVehicle(
  request: { type: VehicleType; severity: Severity; location: { lat: number; lng: number } },
  vehicles: Vehicle[],
) {
  const candidates = vehicles
    .filter((v) => v.type === request.type && v.status === "available")
    .map((v) => {
      const d = distanceKm(v.location, request.location);
      const trafficLevel = (Math.floor(Math.random() * 3) as 0 | 1 | 2);
      const score = priorityScore({
        severity: request.severity,
        distanceKm: d,
        trafficLevel,
        available: true,
      });
      return { vehicle: v, distanceKm: d, score, trafficLevel };
    })
    .sort((a, b) => b.score - a.score);
  return candidates[0];
}
