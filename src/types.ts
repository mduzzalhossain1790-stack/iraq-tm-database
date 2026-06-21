/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TrademarkCertificate {
  certificateType: "trademark" | "patent" | "design";
  badgeType: "iraq-eagle" | "gold-seal" | "none";
  borderStyle: "double-gold" | "royal-gold" | "emerald-ornamental" | "baghdad-classic";
  
  // Header details (Bilingual)
  countryEn: string;
  countryAr: string;
  ministryEn: string;
  ministryAr: string;
  departmentEn: string;
  departmentAr: string;
  
  // Document titles
  documentTitleEn: string;
  documentTitleAr: string;
  legalActEn: string;
  legalActAr: string;
  
  // Specific Trademark Data
  trademarkNameEn: string;
  trademarkNameAr: string;
  trademarkType: string; // e.g., "Word & Logo", "Wordmark", "Device"
  applicationNumber: string;
  certificateNumber: string;
  dateOfFiling: string;
  dateOfRegistration: string;
  expiryDate: string;
  classNumber: string;
  priorityData: string;
  
  // Proprietor Details
  proprietorNameEn: string;
  proprietorNameAr: string;
  proprietorAddressEn: string;
  proprietorAddressAr: string;
  
  // Goods and Services
  goodsServicesEn: string;
  goodsServicesAr: string;
  
  // Authority details
  registrarPositionEn: string;
  registrarPositionAr: string;
  registrarNameEn: string;
  registrarNameAr: string;
  dateOfGrant: string;
  
  // Custom Visual Options
  sealColor: "gold" | "red" | "green" | "bronze";
  sealStyle: "classic-star" | "republic-shield" | "vanguard";
  showStamp: boolean;
  showSignature: boolean;
  showWatermark: boolean;
  signatureStyle: string; // cursive style picker
  qrCodeUrl: string;
  uploadedLogoUrl?: string; // Optional custom user logo image for the mark being registered
  presetLogoId?: string; // Standard default logo selection (e.g. Al-Rafidain Palm, Mesopotamia Star)
  certificateTheme?: "light" | "dark"; // Custom certificate background theme (Light Ivory vs Dark Royal)

  // Status & Registry Metrics (USPTO TSDR Style)
  status?: "REGISTERED" | "PENDING" | "EXPIRED" | "ABANDONED";
  statusAr?: string;
  publicationDate?: string;
  gazetteNumber?: string;
  isVerified?: boolean;
}

export type CertificatePresetId = "iraq_tm_modern" | "iraq_tm_classic_arabic" | "republic_patent_spec";

export interface PresetOption {
  id: CertificatePresetId;
  name: string;
  description: string;
  data: TrademarkCertificate;
}
