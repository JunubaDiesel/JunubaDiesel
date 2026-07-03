import fs from "fs";
import { syncInventoryFromStockExcel } from "../src/lib/erp/inven-sync";
import { loadInventory } from "../src/lib/erp/sync";
import { lookupByOem } from "../src/lib/inventory";

async function main() {
  const path =
    process.argv[2] ?? "C:\\Users\\RYZEN  5 7000\\Downloads\\inven-0629.xlsx";
  const buffer = fs.readFileSync(path);
  const result = await syncInventoryFromStockExcel(buffer);
  console.log(JSON.stringify(result, null, 2));

  const inventory = loadInventory();
  const servicio = inventory.filter((p) =>
    p.specs?.Hoja === "재고현황" && p.name.toUpperCase().includes("SERVICIO")
  );
  const lookup = lookupByOem("25100-2E020");
  const wpMatch = lookup.products.find((p) => p.erpId === "WP-1");

  console.log("\n--- Verification ---");
  console.log("Inventory count:", inventory.length);
  console.log("In stock:", inventory.filter((p) => (p.stockQty ?? 0) > 0).length);
  console.log("SERVICIO-like in catalog:", servicio.length);
  console.log("OEM 25100-2E020 lookup found:", lookup.found, "stock:", lookup.totalStock);
  if (wpMatch) {
    console.log("WP-1 stockQty:", wpMatch.stockQty, "images:", wpMatch.images[0]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
