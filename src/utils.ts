/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrademarkCertificate } from "./types";
import { CERTIFICATE_PRESETS } from "./presets";

const STORAGE_KEY = "iraq_gov_trademark_db_v2";

/**
 * Normalizes strings by removes spaces and punctuation to enable flexible search matching.
 */
function normalizeQuery(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, "");
}

/**
 * Retrieves all registered trademark certificates from LocalStorage database.
 * If empty, initializes with the official presets list.
 */
export function getStoredCertificates(): TrademarkCertificate[] {
  if (typeof window === "undefined") return [];

  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      const parsed = JSON.parse(rawData) as TrademarkCertificate[];
      if (parsed && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to read from local trademark database:", e);
  }

  // Seed the database with high-fidelity defaults if empty
  const defaultSeeds = CERTIFICATE_PRESETS.map((preset) => {
    const data = { ...preset.data };
    
    // Inject official USPTO metadata if missing
    if (!data.status) data.status = "REGISTERED";
    if (!data.statusAr) data.statusAr = "علامة مسجلة نشطة";
    if (!data.gazetteNumber) {
      data.gazetteNumber = `GZ-2026-${Math.floor(100 + Math.random() * 900)}`;
    }
    if (!data.publicationDate) {
      data.publicationDate = "2026-03-12";
    }
    data.isVerified = true;
    return data;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSeeds));
  } catch (err) {
    console.error("Failed to write seed trademarks:", err);
  }

  return defaultSeeds;
}

/**
 * Adds a brand new trademark to the live database, ensuring it is immediately discoverable.
 */
export function registerNewTrademark(certificate: TrademarkCertificate): TrademarkCertificate {
  const currentDb = getStoredCertificates();
  
  // Clean dates or generate backdate starting from 2020 up to now with 10 years expiry
  let cleanRegDate = certificate.dateOfRegistration;
  if (!cleanRegDate) {
    const startYear = Math.floor(2020 + Math.random() * 6); // 2020, 2021, 2022, 2023, 2024, 2025
    const month = String(Math.floor(1 + Math.random() * 12)).padStart(2, "0");
    const day = String(Math.floor(1 + Math.random() * 28)).padStart(2, "0");
    cleanRegDate = `${startYear}-${month}-${day}`;
  }

  const regYear = new Date(cleanRegDate).getFullYear();
  // Valid standard Iraqi protection is exactly 10 Gregorian years
  const cleanExpDate = `${regYear + 10}-12-31`;

  const finalizedCert: TrademarkCertificate = {
    ...certificate,
    dateOfRegistration: cleanRegDate,
    expiryDate: cleanExpDate,
    dateOfGrant: cleanRegDate,
    status: certificate.status || "REGISTERED",
    statusAr: certificate.statusAr || "سجل نظامي رسمي - نشطة",
    gazetteNumber: certificate.gazetteNumber || `GZ-${regYear}-${Math.floor(100 + Math.random() * 899)}`,
    publicationDate: certificate.publicationDate || cleanRegDate,
    isVerified: true,
    qrCodeUrl: certificate.qrCodeUrl || `https://iraqgovtrademark.org/verify?num=${encodeURIComponent(certificate.certificateNumber || certificate.applicationNumber)}`
  };

  // Upsert pattern (overwrite if matching certificateNumber)
  const existingIndex = currentDb.findIndex(
    (item) => 
      item.certificateNumber.toLowerCase().trim() === finalizedCert.certificateNumber.toLowerCase().trim() ||
      item.applicationNumber.toLowerCase().trim() === finalizedCert.applicationNumber.toLowerCase().trim()
  );

  if (existingIndex > -1) {
    currentDb[existingIndex] = finalizedCert;
  } else {
    currentDb.unshift(finalizedCert); // Add to beginning of database
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentDb));
  } catch (err) {
    console.error("database write error:", err);
  }

  return finalizedCert;
}

/**
 * Searches the database by word, number, or class.
 */
export function queryTrademarkDatabase(searchText: string): TrademarkCertificate[] {
  const all = getStoredCertificates();
  const normalized = normalizeQuery(searchText);
  
  if (!normalized) return all;

  return all.filter((item) => {
    const nameEn = normalizeQuery(item.trademarkNameEn);
    const nameAr = normalizeQuery(item.trademarkNameAr);
    const appNum = normalizeQuery(item.applicationNumber);
    const certNum = normalizeQuery(item.certificateNumber);
    const ownerEn = normalizeQuery(item.proprietorNameEn || "");
    const ownerAr = normalizeQuery(item.proprietorNameAr || "");
    const classNum = normalizeQuery(item.classNumber);

    return (
      nameEn.includes(normalized) ||
      nameAr.includes(normalized) ||
      appNum.includes(normalized) ||
      certNum.includes(normalized) ||
      ownerEn.includes(normalized) ||
      ownerAr.includes(normalized) ||
      classNum.includes(normalized)
    );
  });
}

// Word mappings for intelligent business name generation
const WORD_DICT_EN_TO_AR: Record<string, string> = {
  SINDIBAD: "السندباد",
  RAFIDAIN: "الرافدين",
  BABYLON: "بابل",
  MESOPOTAMIA: "بلاد الرافدين",
  BAGHDAD: "بغداد",
  BASRA: "البصرة",
  IRAQ: "العراق",
  AL: "ال",
  AMAL: "الأمل",
  JAZIRA: "الجزيرة",
  FURAT: "الفرات",
  DIJLAH: "دجلة",
  TIJARA: "تجارة",
  FOOD: "للأغذية",
  SWEETS: "للحلويات",
  BAKERY: "مخبز",
  WATER: "مياه",
  HEALTH: "صحي",
  DATES: "تمور",
  PALM: "نخيل",
  STAR: "نجم",
  GOLD: "ذهبي",
  SOCIETY: "مجتمع",
  TECH: "تكنولوجيا",
  DIGITAL: "الرقمي",
  GLOBAL: "العالمي",
  REPUBLIC: "جمهورية",
  MINISTRY: "وزارة",
  DEPARTMENT: "قسم",
  INDUSTRY: "صناعة",
  COMMERCIAL: "تجاري",
  TRADING: "تجاري",
  INVESTMENT: "استثمار",
  GROUP: "مجموعة",
  COMPANY: "شركة",
  INDUSTRIES: "صناعات",
  PARTNERS: "شركاء"
};

const WORD_DICT_AR_TO_EN: Record<string, string> = {
  "سندباد": "SINDIBAD",
  "السندباد": "SINDIBAD",
  "رافدين": "RAFIDAIN",
  "الرافدين": "RAFIDAIN",
  "بابل": "BABYLON",
  "الفرات": "AL-FURAT",
  "دجلة": "DIJLAH",
  "بغداد": "BAGHDAD",
  "البصرة": "BASRA",
  "العراق": "IRAQ",
  "الجزيرة": "AL-JAZIRA",
  "الأمل": "AL-AMAL",
  "أمل": "AMAL",
  "تجارة": "TIJARA",
  "شركة": "COMPANY",
  "مجموعة": "GROUP",
  "صناعات": "INDUSTRIES",
  "مياه": "WATER",
  "صحية": "HEALTHY",
  "صحي": "HEALTHY",
  "تمور": "DATES",
  "نخيل": "PALM",
  "استثمار": "INVESTMENT",
  "الوطنية": "NATIONAL",
  "العالمية": "GLOBAL",
  "الحديثة": "MODERN",
  "الحلويات": "SWEETS",
  "معادن": "MINERALS",
  "صناعة": "INDUSTRY"
};

function transliterateEnglishToArabic(text: string): string {
  const upper = text.toUpperCase();
  const words = upper.split(/\s+/);
  const mappedWords = words.map((w) => {
    if (WORD_DICT_EN_TO_AR[w]) return WORD_DICT_EN_TO_AR[w];
    const cleanWord = w.replace(/[']S$/, "").replace(/S$/, "");
    if (WORD_DICT_EN_TO_AR[cleanWord]) {
      return WORD_DICT_EN_TO_AR[cleanWord];
    }

    let arWord = "";
    let i = 0;
    while (i < w.length) {
      if (w.slice(i, i + 2) === "AL" && i === 0) {
        arWord += "ال";
        i += 2;
        continue;
      }
      if (w.slice(i, i + 2) === "KH") { arWord += "خ"; i += 2; continue; }
      if (w.slice(i, i + 2) === "SH") { arWord += "ش"; i += 2; continue; }
      if (w.slice(i, i + 2) === "TH") { arWord += "ث"; i += 2; continue; }
      if (w.slice(i, i + 2) === "GH") { arWord += "غ"; i += 2; continue; }
      if (w.slice(i, i + 2) === "DH") { arWord += "ذ"; i += 2; continue; }
      if (w.slice(i, i + 2) === "EE") { arWord += "ي"; i += 2; continue; }
      if (w.slice(i, i + 2) === "OO") { arWord += "و"; i += 2; continue; }
      if (w.slice(i, i + 2) === "OU") { arWord += "و"; i += 2; continue; }

      const char = w[i];
      const charMap: Record<string, string> = {
        A: "ا", B: "ب", C: "ك", D: "د", E: "ي", F: "ف", G: "ج", H: "هـ", I: "ي",
        J: "ج", K: "ك", L: "ل", M: "م", N: "ن", O: "و", P: "ب", Q: "ق", R: "ر",
        S: "س", T: "ت", U: "و", V: "ف", W: "و", X: "كس", Y: "ي", Z: "ز"
      };
      
      arWord += charMap[char] || "";
      i++;
    }
    return arWord;
  });

  return mappedWords.join(" ");
}

function transliterateArabicToEnglish(text: string): string {
  const words = text.split(/\s+/);
  const mappedWords = words.map((w) => {
    if (WORD_DICT_AR_TO_EN[w]) return WORD_DICT_AR_TO_EN[w];
    if (w.startsWith("ال") && w.length > 2) {
      const base = w.slice(2);
      if (WORD_DICT_AR_TO_EN[base]) {
        return "AL-" + WORD_DICT_AR_TO_EN[base];
      }
    }

    let enWord = "";
    for (let i = 0; i < w.length; i++) {
      const char = w[i];
      const charMap: Record<string, string> = {
        "ا": "A", "أ": "A", "إ": "I", "آ": "A", "ب": "B", "ت": "T", "ث": "TH", "ج": "J",
        "ح": "H", "خ": "KH", "د": "D", "ذ": "DH", "ر": "R", "ز": "Z", "س": "S", "ش": "SH",
        "ص": "S", "ض": "D", "ط": "T", "ظ": "Z", "ع": "A", "غ": "GH", "ف": "F", "ق": "Q",
        "ك": "K", "ل": "L", "م": "M", "ن": "N", "هـ": "H", "ه": "H", "و": "W", "ي": "Y",
        "ى": "A", "ة": "H", "ئ": "I", "ؤ": "O"
      };
      enWord += charMap[char] || "";
    }
    return enWord;
  });

  return mappedWords.join(" ").toUpperCase();
}

/**
 * Translates/transliterates brand names between English and Arabic.
 */
export function helperAutoTranslateBrand(name: string): { en: string; ar: string } {
  const trimmed = name.trim();
  if (!trimmed) return { en: "", ar: "" };

  const isArabic = /[\u0600-\u06FF]/.test(trimmed);

  if (isArabic) {
    const en = transliterateArabicToEnglish(trimmed);
    return { en, ar: trimmed };
  } else {
    const ar = transliterateEnglishToArabic(trimmed);
    return { en: trimmed.toUpperCase(), ar };
  }
}

/**
 * Automatically drafts a bilingual Proprietor Name and address based on the brand.
 */
export function helperAutoGenerateProprietor(brandEn: string, brandAr: string): {
  proprietorEn: string;
  proprietorAr: string;
  addressEn: string;
  addressAr: string;
} {
  return {
    proprietorEn: brandEn ? `${brandEn} HOLDING & INDUSTRIAL COMPANY (LLC)` : "",
    proprietorAr: brandAr ? `شركة ${brandAr} الاستثمارية والصناعية المحدودة` : "",
    addressEn: "Area 901, Street 18, Karada District, Baghdad, Iraq",
    addressAr: "محلة ٩٠١، زقاق ١٨، حي الكرادة داخل، بغداد، العراق"
  };
}
