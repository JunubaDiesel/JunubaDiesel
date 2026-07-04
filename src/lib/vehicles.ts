import type { VehicleId } from "@/config/site";

const VEHICLE_IDS: VehicleId[] = ["starex", "staria", "porter", "bongo"];

export function isValidVehicleId(value: string): value is VehicleId {
  return (VEHICLE_IDS as string[]).includes(value);
}
