import type { CategoryId, VehicleId } from "@/config/site";

export interface OemGuidePart {
  oemNumber: string;
  name: string;
  diagramRef?: string;
  notes?: string;
}

export interface OemGuideSection {
  categoryId: CategoryId;
  title: string;
  parts: OemGuidePart[];
}

export interface OemGuideEntry {
  id: string;
  vehicleId: VehicleId;
  variantId?: string;
  sections: OemGuideSection[];
}

export interface OemGuidesData {
  guides: OemGuideEntry[];
}
