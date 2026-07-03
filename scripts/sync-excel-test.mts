import fs from "fs";
import { syncInventoryFromExcel } from "../src/lib/erp/excel-sync";

async function main() {
  const path =
    process.argv[2] ??
    "Z:\\2. Ventas\\JUNUBA INFORMAR PIEZAS.xlsx";
  const buffer = fs.readFileSync(path);
  const result = await syncInventoryFromExcel(buffer);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
