import XLSX from "xlsx";
import fs from "fs";
import path from "path";

// Path to your Excel file
const excelPath = path.join(process.cwd(), "ingredients-dyeing.xlsx");

// Read the Excel file
const workbook = XLSX.readFile(excelPath);

// Get the first sheet (since it's only the named range now)
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert to array of arrays
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// Save JSON to src/data so React can import it
const outPath = path.join(process.cwd(), "src", "data", "ingredients.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

console.log(`✅ Extracted ${data.length} rows to src/data/ingredients.json`);
