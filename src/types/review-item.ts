import type { CategoryId, VehicleId } from "@/config/site";

export interface ReviewItem {
  id: string;
  oemNumber: string;
  name?: string;
  vehicleId: VehicleId;
  variantId?: string;
  categoryId?: CategoryId;
  notes?: string;
  addedAt: string;
}
