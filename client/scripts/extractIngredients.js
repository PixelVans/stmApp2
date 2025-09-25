import XLSX from "xlsx";
import fs from "fs";
import path from "path";


const excelPath = path.join(process.cwd(), "ingredients-dyeing.xlsx");


const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });


const outPath = path.join(process.cwd(), "src", "data", "ingredients.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

console.log(`Extracted ${data.length} rows to src/data/ingredients.json`);
