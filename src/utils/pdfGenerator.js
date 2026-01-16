import { PDFDocument, TextAlignment } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export async function loadTemplate() {
  const res = await fetch("/TEMPLATE.pdf");
  if (!res.ok) throw new Error("Failed to load TEMPLATE.pdf");
  return await res.arrayBuffer();
}

async function loadFont() {
  const res = await fetch("/DejaVuSans.ttf");
  if (!res.ok) return null;
  return await res.arrayBuffer();
}

const COUNTRY_CODES = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AR: "Argentina",
  AM: "Armenia",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BH: "Bahrain",
  BD: "Bangladesh",
  BY: "Belarus",
  BE: "Belgium",
  BO: "Bolivia",
  BA: "Bosnia and Herzegovina",
  BR: "Brazil",
  BG: "Bulgaria",
  KH: "Cambodia",
  CA: "Canada",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  CR: "Costa Rica",
  HR: "Croatia",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  EE: "Estonia",
  FI: "Finland",
  FR: "France",
  GE: "Georgia",
  DE: "Germany",
  GR: "Greece",
  GT: "Guatemala",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IE: "Ireland",
  IL: "Israel",
  IT: "Italy",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KR: "South Korea",
  KW: "Kuwait",
  LV: "Latvia",
  LB: "Lebanon",
  LT: "Lithuania",
  LU: "Luxembourg",
  MY: "Malaysia",
  MX: "Mexico",
  MA: "Morocco",
  NL: "Netherlands",
  NZ: "New Zealand",
  NG: "Nigeria",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PA: "Panama",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PL: "Poland",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  RO: "Romania",
  RU: "Russia",
  SA: "Saudi Arabia",
  RS: "Serbia",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  ZA: "South Africa",
  ES: "Spain",
  LK: "Sri Lanka",
  SE: "Sweden",
  CH: "Switzerland",
  TW: "Taiwan",
  TH: "Thailand",
  TR: "Turkey",
  UA: "Ukraine",
  AE: "United Arab Emirates",
  GB: "United Kingdom",
  UK: "United Kingdom",
  US: "United States",
  UY: "Uruguay",
  VE: "Venezuela",
  VN: "Vietnam",
};

function formatCountry(val) {
  if (!val) return val;
  const str = String(val).trim().toUpperCase();
  return COUNTRY_CODES[str] || val;
}

function buildAddressTo(data) {
  const lines = [];

  if (data.Recipient) lines.push(data.Recipient);
  if (data.Company) lines.push(data.Company);
  if (data.AddressLine1) lines.push(data.AddressLine1);
  if (data.AddressLine2) lines.push(data.AddressLine2);

  const cityStateZip = [
    data.City,
    data.State ? `, ${data.State}` : "",
    data.Zipcode ? ` ${data.Zipcode}` : "",
  ].join("");
  if (cityStateZip.trim()) lines.push(cityStateZip);

  if (data.Country) lines.push(formatCountry(data.Country));
  if (data.Phone) lines.push(`Tel: ${data.Phone}`);

  return lines.join("\n");
}

export async function generateReceiptPdf(templateBytes, data) {
  const formatCurrency = (val) => {
    if (!val) return val;
    const str = String(val).trim();
    if (!str) return str;
    return str.startsWith("$") ? str : `$${str}`;
  };

  const formatDate = (val) => {
    if (!val) return val;
    const str = String(val).trim();
    if (!str) return str;
    const date = new Date(str);
    if (isNaN(date.getTime())) return str;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const enrichedData = {
    ...data,
    AddressTo: buildAddressTo(data),
    ItemValue: formatCurrency(data.ItemValue),
    Cost: formatCurrency(data.Cost),
    ShipDate: formatDate(data.ShipDate),
  };

  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);

  const fontBytes = await loadFont();
  const customFont = fontBytes ? await pdfDoc.embedFont(fontBytes) : null;

  const form = pdfDoc.getForm();
  const fields = form.getFields();

  for (const field of fields) {
    const name = field.getName();
    const value = enrichedData[name];

    if (value !== undefined && value !== null) {
      try {
        const textField = form.getTextField(name);
        const strValue = String(value);
        if (strValue.includes("\n")) {
          textField.enableMultiline();
        }
        if (customFont) {
          textField.updateAppearances(customFont);
        }
        textField.setText(strValue);
      } catch (e) {
        console.warn(`Could not fill field "${name}":`, e);
      }
    }
  }

  form.flatten();

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
