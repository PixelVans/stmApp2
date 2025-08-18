const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

// === CONFIG ===
const excelFilePath = path.join(__dirname, "igridients dyeing.xlsx");
const sheetName = "Sheet1";
const exportName = "IngredientsDying";
const outputFile = path.join(__dirname, `${exportName}.js`);

// === READ EXCEL ===
const workbook = XLSX.readFile(excelFilePath);
const sheet = workbook.Sheets[sheetName];

if (!sheet) {
  console.error(`Sheet "${sheetName}" not found in ${excelFilePath}`);
  process.exit(1);
}

// Read as 2D array (raw values, including blanks)
let rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });

// Find the maximum number of columns in any row (so we preserve the table shape)
const maxCols = Math.max(...rows.map(r => r.length));

// Fill all missing/empty cells with null
rows = rows.map(row => {
  const newRow = [];
  for (let i = 0; i < maxCols; i++) {
    const value = row[i];
    newRow[i] = (value === undefined || value === "") ? null : value;
  }
  return newRow;
});

// Optional: Remove completely empty rows (all nulls)
// Comment this out if you want to keep the empty rows too
rows = rows.filter(row => row.some(cell => cell !== null));

// === FORMAT JS OUTPUT ===
const jsArrayString = `export const ${exportName} = ${JSON.stringify(rows, null, 2)};\n`;

// === WRITE OUTPUT FILE ===
fs.writeFileSync(outputFile, jsArrayString, "utf8");
console.log(`Generated ${outputFile}`);
