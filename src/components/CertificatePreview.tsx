/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { TrademarkCertificate } from "../types";
import { IraqCoatOfArms, OfficialChamberSeal, PresetMarkLogo } from "./Icons";
import { QRCodeSVG } from "qrcode.react";

interface PreviewProps {
  certificate: TrademarkCertificate;
  zoom?: number; // scale percent (e.g. 100 for 1x, 80 for 0.8x)
}

export const CertificatePreview: React.FC<PreviewProps> = ({ certificate, zoom = 100 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine border styles based on user selection
  const getBorderClasses = () => {
    switch(certificate.borderStyle) {
      case "royal-gold":
        return {
          outer: "border-[16px] border-amber-500",
          inner: "border-4 border-amber-600 m-2",
          decor: "border-2 border-double border-amber-700 m-0.5"
        };
      case "emerald-ornamental":
        return {
          outer: "border-[18px] border-emerald-800",
          inner: "border-4 border-amber-500 m-2",
          decor: "border-2 border-dashed border-amber-600 m-0.5"
        };
      case "baghdad-classic":
        return {
          outer: "border-[14px] border-amber-700",
          inner: "border-2 border-amber-800 m-2",
          decor: "border-[6px] border-double border-amber-900 m-1"
        };
      case "double-gold":
      default:
        return {
          outer: "border-[12px] border-amber-400",
          inner: "border-[3px] border-amber-500 m-2.5",
          decor: "border border-amber-300 m-0.5"
        };
    }
  };

  const borders = getBorderClasses();

  // Custom styling for watermark
  const watermarkText = certificate.certificateType === "trademark" 
    ? "TRADEMARK • علامة فارقة" 
    : certificate.certificateType === "patent" 
    ? "PATENT • براءة اختراع" 
    : "DESIGN • نموذج صناعي";

  const isDarkCert = certificate.certificateTheme === "dark";
  const verificationUrl = `${window.location.origin}${window.location.pathname}#verify=${encodeURIComponent(certificate.certificateNumber)}`;

  // Dynamic royal color classes
  const tc = {
    bg: isDarkCert ? "bg-stone-950 text-stone-100 border-amber-500/20" : "bg-white text-stone-900",
    textMain: isDarkCert ? "text-stone-100" : "text-stone-900",
    textMuted: isDarkCert ? "text-stone-400" : "text-stone-500",
    textTitle: isDarkCert ? "text-amber-400" : "text-amber-900",
    textSub: isDarkCert ? "text-amber-500" : "text-amber-800",
    label: isDarkCert ? "text-amber-500/90 font-black" : "text-stone-700 font-bold",
    border: isDarkCert ? "border-amber-900/30" : "border-stone-150",
    innerBoxBg: isDarkCert ? "bg-stone-900/60 border-amber-500/20" : "bg-stone-50/80 border-amber-100/50",
    innerBoxMuted: isDarkCert ? "bg-stone-900/30 border-stone-800/80" : "bg-stone-50/40 border-stone-100",
    boxTextMain: isDarkCert ? "text-amber-300" : "text-amber-900",
    boxTextSec: isDarkCert ? "text-stone-100" : "text-amber-955"
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full mx-auto shadow-2xl overflow-hidden print:shadow-none print-container aspect-[210/297] select-none ${tc.bg}`}
      style={{ 
        width: `${zoom}%`,
        maxWidth: "820px",
        minWidth: "320px",
        fontFamily: "'Inter', sans-serif" 
      }}
      id="iraq-certificate-preview-container"
    >
      {/* Background Subtle Parchment Texture & Gloss */}
      {isDarkCert ? (
        <div className="absolute inset-0 bg-stone-950 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, rgba(30,27,22,1) 0%, rgba(10,10,10,1) 100%)" }} />
      ) : (
        <div className="absolute inset-0 bg-stone-50/20 parchment-glow pointer-events-none" />
      )}
      
      {/* Optional Watermark Pattern behind fields */}
      {certificate.showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] select-none pointer-events-none transform -rotate-45" id="watermark-layer">
          <div className="text-center">
            <span className={`text-8xl font-black tracking-widest block ${isDarkCert ? "text-amber-500" : "text-[#92400e]"}`}>{watermarkText}</span>
            <span className={`text-6xl font-serif mt-4 block ${isDarkCert ? "text-amber-500" : "text-[#92400e]"}`}>جمهورية العراق</span>
            <span className={`text-4xl font-sans mt-2 tracking-wider block ${isDarkCert ? "text-amber-500" : "text-[#92400e]"}`}>REPUBLIC OF IRAQ</span>
          </div>
        </div>
      )}

      {/* Primary Ornamental Border */}
      <div className={`absolute inset-4 ${borders.outer} rounded-sm pointer-events-none`} id="certificate-border-outer">
        <div className={`h-full ${borders.inner} rounded-sm`}>
          <div className={`h-full ${borders.decor} rounded-sm`} />
        </div>
      </div>

      {/* Corner Corner-Decors for high polish */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-amber-500 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-amber-500 rounded-tr-sm pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-amber-500 rounded-bl-sm pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-amber-500 rounded-br-sm pointer-events-none" />

      {/* Pending status security watermark ribbon */}
      {certificate.status === "PENDING" && (
        <div className="absolute top-[40%] left-0 w-full text-center bg-amber-500/10 border-y border-amber-600/25 py-5 rotate-[-28deg] z-40 select-none pointer-events-none" id="pending-draft-watermark">
          <span className="text-3xl sm:text-[40px] font-black font-sans tracking-[0.2em] text-amber-600/70 block">APPLICATION PENDING</span>
          <span className="text-xl sm:text-2xl font-serif text-amber-700/75 block mt-2">طلب قيد الفحص والدراسة - مسودّة غير معتمدة</span>
        </div>
      )}

      {/* Main Certificate Content Container (Padding carefully adjusted to clear borders) */}
      <div className={`relative h-full py-12 px-14 flex flex-col justify-between ${isDarkCert ? "text-stone-300 animate-fadeIn" : "text-stone-900"}`} id="certificate-inner-content">
        
        {/* ================= HEADER SECTION ================= */}
        <header className="flex flex-col items-center text-center mt-2 relative z-10" id="certificate-header">
          {/* Top Country Label (Bilingual) */}
          <div className="w-full flex justify-between items-start text-xs font-semibold px-4 text-stone-600 mb-1" id="header-top-bilingual">
            <div className="text-left font-sans tracking-wide">
              <span className={isDarkCert ? "text-stone-200 font-bold" : "text-stone-600"}>{certificate.countryEn}</span>
              <span className="block text-[9px] font-normal text-stone-500">{certificate.ministryEn}</span>
            </div>
            <div className="text-right font-serif">
              <span className={isDarkCert ? "text-stone-200 font-bold font-arabic" : "text-stone-600"}>{certificate.countryAr}</span>
              <span className="block text-[10px] font-cairo font-normal text-stone-500">{certificate.ministryAr}</span>
            </div>
          </div>

          {/* Iraqi Coat of Arms Emblem */}
          {certificate.badgeType === "iraq-eagle" && (
            <div className="my-2 transition-transform duration-500 transform hover:scale-110" id="main-crest-container">
              <IraqCoatOfArms className="w-20 h-20 drop-shadow-md" />
            </div>
          )}

          {/* Department / Directorate Title */}
          <div className="mt-1" id="department-titles">
            <h1 className={`text-xl font-cairo font-bold tracking-wide ${isDarkCert ? "text-stone-100" : "text-stone-850"}`}>
              {certificate.departmentAr}
            </h1>
            <h2 className={`text-xs font-sans font-medium tracking-widest uppercase mt-0.5 ${tc.textSub}`}>
              {certificate.departmentEn}
            </h2>
          </div>

          {/* Divider Line */}
          <div className="w-2/3 h-[1px] bg-gradient-to-r from-transparent via-amber-600 to-transparent my-3" />

          {/* Document Main Title (Bilingual) */}
          <div className="my-1" id="document-main-titles">
            <h3 className={`text-2xl font-serif font-black tracking-normal leading-tight ${isDarkCert ? "text-stone-101" : "text-stone-900"}`}>
              {certificate.documentTitleEn}
            </h3>
            <h4 className={`text-2.5xl font-arabic font-bold mt-1 leading-normal ${isDarkCert ? "text-amber-500" : "text-amber-900"}`}>
              {certificate.documentTitleAr}
            </h4>
          </div>

          {/* Official Act/Statute (Bilingual) */}
          <div className="mt-1 text-[10px] text-stone-500 max-w-lg leading-relaxed px-4" id="statute-details">
            <p className={`font-arabic font-regular text-[11px] mb-0.5 ${isDarkCert ? "text-stone-300" : "text-stone-700"}`}>{certificate.legalActAr}</p>
            <p className={`font-sans italic ${isDarkCert ? "text-stone-400" : "text-stone-500"}`}>{certificate.legalActEn}</p>
          </div>
        </header>


        {/* ================= DUAL COLUMN LEGAL DATA SECTION ================= */}
        <section className="my-4 grid grid-cols-2 gap-x-8 gap-y-4 text-[11px] leading-relaxed relative z-10" id="certificate-data-grid">
          
          {/* TRADEMARK / MARK TITLE DETAILS */}
          <div className={`col-span-2 border-b pb-2 mb-2 ${tc.border}`} id="grid-row-trademark-title">
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-sans font-bold text-[9px] tracking-wider ${tc.label}`}>TRADEMARK / PATENT NAME:</span>
              <span className={`font-arabic font-bold text-xs ${tc.label}`}>اسم العلامة / براءة الاختراع:</span>
            </div>
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 rounded border ${tc.innerBoxBg}`}>
              <div>
                <span className={`font-display font-bold text-md block tracking-tight ${tc.boxTextMain}`}>{certificate.trademarkNameEn}</span>
                <span className="text-[10px] text-stone-500 font-sans italic mt-0.5">Type: {certificate.trademarkType}</span>
              </div>
              <div className="text-right mt-1 sm:mt-0">
                <span className={`font-arabic font-bold text-lg block ${tc.boxTextSec || "text-amber-955"}`}>{certificate.trademarkNameAr}</span>
              </div>
            </div>
          </div>

          {/* REGISTERED PROPRIETOR (OWNER) */}
          <div className={`col-span-2 border-b pb-2 ${tc.border}`} id="grid-row-proprietor">
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-sans font-sm font-bold text-[9px] tracking-wider ${tc.label}`}>NAME & ADDRESS OF PROPRIETOR:</span>
              <span className={`font-arabic font-semibold ${tc.label}`}>المالك والعنوان الكامل:</span>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 p-2.5 rounded border ${tc.innerBoxMuted}`}>
              {/* English detail */}
              <div className={`border-r pr-2 ${tc.border}`}>
                <span className={`font-sans font-bold block ${isDarkCert ? "text-stone-200" : "text-stone-850"}`}>{certificate.proprietorNameEn}</span>
                <span className="font-sans text-[10px] text-stone-500 block mt-0.5 leading-snug">{certificate.proprietorAddressEn}</span>
              </div>
              {/* Arabic detail */}
              <div className="text-right pl-2 font-serif">
                <span className={`font-arabic font-bold block text-xs ${tc.boxTextMain}`}>{certificate.proprietorNameAr}</span>
                <span className="font-arabic text-[11px] text-stone-400 block mt-1 leading-relaxed">{certificate.proprietorAddressAr}</span>
              </div>
            </div>
          </div>

          {/* CLASSIFICATION DETAILS */}
          <div className={`border-r pr-4 ${tc.border}`} id="grid-col-class">
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-sans font-bold text-stone-500 uppercase text-[9px] tracking-wider">Class Number / Descriptor</span>
              <span className="font-arabic text-[10px] font-semibold text-stone-500">رقم الصنف الدولي</span>
            </div>
            <p className={`font-sans font-bold text-xs px-2 py-1 rounded border ${isDarkCert ? "bg-stone-900 border-amber-955/20 text-amber-400" : "bg-stone-100/50 border-stone-200 text-stone-850"}`}>
              {certificate.classNumber}
            </p>
          </div>

          {/* APP NUMBER & CERT NUMBER */}
          <div className="pl-2" id="grid-col-numbers">
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-sans font-bold text-stone-500 uppercase text-[9px] tracking-wider">Application & REG No</span>
              <span className="font-arabic text-[10px] font-semibold text-stone-500">رقم الطلب والسجل</span>
            </div>
            <div className={`flex justify-between font-mono font-bold text-[11px] px-2 py-1 rounded border ${isDarkCert ? "bg-stone-900 border-amber-955/20 text-stone-250" : "bg-amber-50/50 border-amber-100 text-stone-800"}`}>
              <span>N°: {certificate.applicationNumber}</span>
              <span className={isDarkCert ? "text-amber-400" : "text-amber-800"}>Reg: {certificate.certificateNumber}</span>
            </div>
          </div>

          {/* DATES OF FILING & REGISTRATION */}
          <div className={`border-r pr-4 ${tc.border}`} id="grid-col-dates">
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-sans font-bold text-stone-500 uppercase text-[9px] tracking-wider">Filing & Reg Dates</span>
              <span className="font-arabic text-[10px] font-semibold text-stone-500">تواريخ التقديم والتسجيل</span>
            </div>
            <div className="text-[10px] text-stone-700 space-y-0.5 font-mono">
              <div className="flex justify-between">
                <span>Filing: <strong className={`font-semibold ${isDarkCert ? "text-stone-300" : "text-stone-900"}`}>{certificate.dateOfFiling}</strong></span>
                <span className="text-[10px] font-sans">تقديم: {certificate.dateOfFiling.replace(/-/g, '/')}</span>
              </div>
              <div className="flex justify-between">
                <span>Registered: <strong className={`font-semibold ${isDarkCert ? "text-stone-300" : "text-stone-900"}`}>{certificate.dateOfRegistration}</strong></span>
                <span className="text-[10px] font-sans">تسجيل: {certificate.dateOfRegistration.replace(/-/g, '/')}</span>
              </div>
              <div className="flex justify-between text-red-500 font-semibold border-t border-dashed border-stone-800 pt-0.5 mt-0.5">
                <span>Expiry: <strong className="font-extrabold">{certificate.expiryDate}</strong></span>
                <span className="text-[10px] font-sans">نفاذ: {certificate.expiryDate.replace(/-/g, '/')}</span>
              </div>
            </div>
          </div>

          {/* PRIORITY & OTHER STATES */}
          <div className="pl-4" id="grid-col-priority">
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-sans font-bold text-stone-500 uppercase text-[9px] tracking-wider">Priority Data</span>
              <span className="font-arabic text-[10px] font-semibold text-stone-500">بيانات الأسبقية المشروعة</span>
            </div>
            <p className={`text-[10px] p-1.5 rounded font-sans italic h-14 overflow-hidden leading-snug border ${isDarkCert ? "bg-stone-900 border-amber-955/20 text-stone-300" : "bg-stone-50 p-1.5 rounded text-stone-600 border-stone-150"}`}>
              {certificate.priorityData}
            </p>
          </div>

          {/* TRADEMARK LOGO / EMBLEM PRESENTATION OR MONOGRAM */}
          <div className={`col-span-2 mt-2 pt-2 border-t ${tc.border}`} id="certificate-trademark-representation">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-sans font-bold text-stone-500 uppercase text-[9px] tracking-wider">REGISTERED TRADEMARK DEVICE / IMAGE</span>
              <span className="font-arabic text-[10px] font-semibold text-stone-500">شعار أو رسم العلامة المسجل</span>
            </div>
            
            <div className={`flex justify-center items-center py-4 rounded-lg border-2 border-dashed relative overflow-hidden ${isDarkCert ? "bg-stone-900/40 border-amber-600/30" : "bg-stone-50/50 border-amber-200/65"}`} id="logo-preview-box">
              {/* Mini authentication corners inside logo box */}
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-amber-400" />
              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-amber-400" />
              <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-amber-400" />
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-amber-400" />
              
              {certificate.uploadedLogoUrl ? (
                // Display user uploaded official logo
                <div className={`w-24 h-24 flex items-center justify-center p-1 rounded shadow-sm border ${isDarkCert ? "bg-stone-900/90 border-amber-500/30" : "bg-white border-stone-200"}`} id="uploaded-logo-frame">
                  <img 
                    src={certificate.uploadedLogoUrl} 
                    alt="Registered Trademark" 
                    id="registered-user-trademark"
                    className="max-w-full max-h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                // Display high quality Vector presets
                <PresetMarkLogo 
                  logoId={certificate.presetLogoId || "mesopotamia-palm-shield"} 
                  color={certificate.sealColor === "gold" ? "#a16207" : certificate.sealColor === "red" ? "#991b1b" : certificate.sealColor === "green" ? "#065f46" : "#4b5563"}
                  textInitials={certificate.trademarkNameEn ? certificate.trademarkNameEn.slice(0, 3) : "IQ"}
                  className="w-24 h-24 drop-shadow-sm"
                />
              )}
            </div>
          </div>
          
          {/* COMPREHENSIVE GOODS & SERVICES SPECIFICATION */}
          <div className={`col-span-2 border-t border-b py-2 mt-1 ${tc.border}`} id="grid-row-goods-services">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-sans font-bold text-stone-500 uppercase text-[9px] tracking-wider">SPECIFICATION OF GOODS / SERVICES</span>
              <span className="font-arabic text-[10px] font-semibold text-stone-500">بيان البضائع أو الخدمات المشمولة</span>
            </div>
            
            <div className={`grid grid-cols-2 gap-4 p-2 rounded ${isDarkCert ? "bg-stone-900/30 border border-stone-800/80" : "bg-stone-50/50"}`}>
              <p className={`font-sans text-[10.5px] italic leading-normal pr-2 border-r max-h-[85px] overflow-hidden text-justify ${isDarkCert ? "text-stone-300 border-amber-955/20 font-sans" : "text-stone-700 border-stone-150/60"}`}>
                {certificate.goodsServicesEn}
              </p>
              <p className={`font-arabic text-[11px] leading-relaxed text-right pl-2 max-h-[85px] overflow-hidden text-justify ${isDarkCert ? "text-stone-300 font-arabic font-regular" : "text-stone-700"}`}>
                {certificate.goodsServicesAr}
              </p>
            </div>
          </div>
        </section>


         {/* ================= OUTCOME STATEMENT ================= */}
        <div className="text-center my-1 relative z-10" id="outcome-statement">
          <p className="font-sans text-[9px] text-stone-500 uppercase tracking-widest">
            IN TESTIMONY WHEREOF, the Industrial Property Department has ordered this Certificate to be Sealed
          </p>
          <p className={`font-arabic text-[10px] font-semibold mt-0.5 ${isDarkCert ? "text-amber-500" : "text-amber-900"}`}>
            وتوثيقاً لذلك، أمر مسجل الملكية الصناعية بوضع خاتم الدائرة على هذه الشهادة الرسمية
          </p>
        </div>


        {/* ================= FOOTER SIGNATURE & STAMP ARTIFACT ================= */}
        <footer className={`mt-2 flex justify-between items-end border-t pt-3 relative z-10 ${isDarkCert ? "border-amber-900/30" : "border-amber-200/45"}`} id="certificate-footer">
          
          {/* Left: Official Chamber Stamping */}
          <div className="w-1/3 flex flex-col justify-end items-start" id="seal-artifact-col">
            {certificate.showStamp && (
              <div className="transform -rotate-6 translate-x-2 -translate-y-1 scale-100 origin-center transition-transform hover:rotate-0" id="certificate-stamp-holder">
                <OfficialChamberSeal 
                  color={certificate.sealColor} 
                  title={certificate.ministryAr} 
                  className="w-[96px] h-[96px]" 
                />
              </div>
            )}
            <div className="text-[8px] text-stone-400 font-mono mt-1 select-none">
              STAMP SECURE N° {certificate.certificateNumber.replace("REG-", "")}
            </div>
          </div>

          {/* Middle: Custom Certification QR Code for client status matching the verification requirement */}
          <div className="w-1/4 flex flex-col items-center justify-end pb-1" id="verification-qr-col">
            <div className={`p-1.5 rounded-xl flex flex-col items-center justify-center border transition-all hover:scale-105 ${isDarkCert ? "bg-stone-900/40 border-amber-900/30 text-amber-500" : "bg-stone-50/90 border-stone-250 text-stone-800"}`}>
              <a 
                href={verificationUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`p-1 bg-white rounded shadow-sm block cursor-pointer border ${isDarkCert ? "border-amber-500/30" : "border-stone-300"}`}
                id="qr-frame"
                title="Click to check registry / Scan to verify"
              >
                <div className="bg-white p-0.5">
                  <QRCodeSVG
                    value={verificationUrl}
                    size={56}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                  />
                </div>
              </a>
              <span className={`text-[8.5px] mt-1 uppercase font-black tracking-wider text-center leading-none ${isDarkCert ? "text-amber-500" : "text-stone-700"}`}>Verify Registry</span>
            </div>
          </div>

          {/* Right: Signature Line of Authorized Official */}
          <div className="w-1/3 flex flex-col items-center text-center pl-2" id="signature-artifact-col">
            <span className="text-[9px] text-stone-500 font-sans tracking-wide uppercase">AUTHORISED SIGNATORY</span>
            
            {/* Signature Area with realistic fluid ink strokes */}
            <div className={`h-10 relative flex items-center justify-center w-full my-1 border-b ${isDarkCert ? "border-amber-500/30" : "border-stone-300"}`} id="signature-block">
              {certificate.showSignature && (
                <>
                  <span 
                    className={`text-2xl absolute transform -rotate-2 select-none z-10`}
                    style={{ 
                      fontFamily: certificate.signatureStyle === "great-vibes" ? "'Great Vibes', cursive" : "'Playfair Display', serif",
                      color: isDarkCert ? "#f59e0b" : "#1e40af"
                    }}
                  >
                    {certificate.registrarNameEn || "Haidar Al-Rubaie"}
                  </span>
                  {/* Real looking digital pen vector signature paths overlap */}
                  <svg className="absolute w-28 h-8 pointer-events-none opacity-85 z-20 overflow-visible" viewBox="0 0 100 30" fill="none" stroke={isDarkCert ? "#fbbf24" : "#2563eb"} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 6,14 C 18,2 26,10 40,8 C 54,6 62,22 75,12 C 88,2 92,18 97,12" />
                    <path d="M 12,22 Q 40,3 70,16 T 94,8" strokeWidth="0.8" opacity="0.65" />
                    <path d="M 4,16 C 25,26 50,22 80,14 C 90,11 96,16 99,6" strokeWidth="0.7" opacity="0.5" />
                    <circle cx="97" cy="12" r="1" fill={isDarkCert ? "#fbbf24" : "#2563eb"} />
                  </svg>
                </>
              )}
            </div>
            
            <div className="flex flex-col" id="signatory-bilingual-details">
              <span className={`font-arabic font-bold text-[11px] ${isDarkCert ? "text-stone-100" : "text-stone-900"}`}>
                {certificate.registrarNameAr}
              </span>
              <span className={`font-sans text-[9px] font-bold block leading-tight ${isDarkCert ? "text-amber-400" : "text-stone-600"}`}>
                {certificate.registrarNameEn}
              </span>
              <span className="font-arabic text-[9px] text-stone-500 block leading-tight mt-0.5">
                {certificate.registrarPositionAr}
              </span>
              <span className="font-sans text-[8px] italic text-stone-400 block leading-tight">
                {certificate.registrarPositionEn}
              </span>
            </div>
          </div>

        </footer>

      </div>
    </div>
  );
};
