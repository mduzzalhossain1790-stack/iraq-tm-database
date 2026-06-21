import React from "react";
import QRCode from "qrcode";
import { TrademarkCertificate } from "../types";

// High-fidelity SVG of the official Emblem/Heraldic Crest of the Republic of Iraq
export function IraqiCrest({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Eagle Head & Crown beak */}
      <path d="M50 15 C52 10, 48 5, 45 4 C40 3, 38 6, 38 9 C38 12, 42 15, 44 19 Zm-7 0" fill="#cca43b" stroke="#997a00" strokeWidth="0.5" />
      {/* Head Crest feathers */}
      <path d="M44 4 C46 1, 49 1, 51 3 C52 5, 52 8, 50 11 Z" fill="#b38f1b" />
      <path d="M47 3 C49 0, 52 1, 53 4 C53 6, 51 9, 49 11 Z" fill="#b38f1b" />
      <circle cx="44" cy="8" r="1" fill="#000" />
      {/* Golden Eagle of Saladin Body & Wings */}
      <path d="M22 65 C18 40, 32 20, 42 22 C43 25, 40 35, 38 45 C35 55, 30 75, 40 85" fill="#cca43b" stroke="#b38f1b" strokeWidth="0.75" />
      <path d="M78 65 C82 40, 68 20, 58 22 C57 25, 60 35, 62 45 C65 55, 70 75, 60 85" fill="#cca43b" stroke="#b38f1b" strokeWidth="0.75" strokeLinecap="round" />
      
      {/* Wing Layered Feathers ornament */}
      <path d="M28 35 Q15 45 20 70 M34 38 Q22 48 26 73 M40 41 Q28 51 32 76" stroke="#997a00" strokeWidth="1" strokeLinecap="round" />
      <path d="M72 35 Q85 45 80 70 M66 38 Q78 48 74 73 M60 41 Q72 51 68 76" stroke="#997a00" strokeWidth="1" strokeLinecap="round" />

      {/* Eagle Legs & Base platform holding scroll */}
      <path d="M38 85 L35 98 L42 102 L44 95 Z" fill="#997a00" />
      <path d="M62 85 L65 98 L58 102 L56 95 Z" fill="#997a00" />

      {/* Flag Panel on Chest (Shield) */}
      <rect x="36" y="38" width="28" height="38" rx="2" fill="#fff" stroke="#1f2937" strokeWidth="1.5" />
      {/* Iraq Flag colors inside shield */}
      <path d="M36 38 H64 V50 h-28 Z" fill="#DA121A" /> {/* Red Stripe */}
      <path d="M36 50 H64 V62 h-28 Z" fill="#FFFFFF" /> {/* White Stripe */}
      <path d="M36 62 H64 V76 h-28 Z" fill="#000000" /> {/* Black Stripe */}
      {/* Allahu Akbar text mockup in central White Stripe */}
      <text x="50" y="58" fill="#007A3D" fontSize="4" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.1">الله أكبر</text>

      {/* Scroll banner at base with "جمهورية العراق" */}
      <rect x="18" y="98" width="64" height="12" rx="2" fill="#fff" stroke="#997a00" strokeWidth="1" />
      <text x="50" y="106" fill="#1f2937" fontSize="5" fontWeight="950" fontFamily="serif" textAnchor="middle">جمهورية العراق</text>
    </svg>
  );
}

export interface CertificatePreviewProps {
  certificate: TrademarkCertificate;
  zoom?: number; // Optional zoom percentage (e.g., 90)
  certificateMode?: "bilingual" | "english" | "arabic";
}

export function CertificatePreview({ certificate, zoom = 100, certificateMode = "bilingual" }: CertificatePreviewProps) {
  const scale = zoom / 100;
  
  const [qrDataUrl, setQrDataUrl] = React.useState<string>("");

  React.useEffect(() => {
    let active = true;
    let data = certificate.qrCodeUrl || "";
    if (!data) {
      const baseURL = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "https://iraqgovtrademark.org";
      data = `${baseURL}#verify=${encodeURIComponent(certificate.certificateNumber)}`;
    }

    QRCode.toDataURL(data, {
      margin: 1,
      width: 180,
      color: {
        dark: "#000000",
        light: "#ffffff"
      }
    })
      .then((url) => {
        if (active) {
          setQrDataUrl(url);
        }
      })
      .catch((err) => {
        console.error("Failed to generate local QR Code:", err);
      });
    return () => {
      active = false;
    };
  }, [certificate.qrCodeUrl, certificate.certificateNumber]);

  const isBilingual = certificateMode === "bilingual";
  const isEnglish = certificateMode === "english";
  const isArabic = certificateMode === "arabic";

  // Stable pseudo-random generator based on certificate characteristics
  const seedString = (certificate.certificateNumber || "") + (certificate.trademarkNameEn || certificate.trademarkNameAr || "");
  let hashVal = 0;
  for (let i = 0; i < seedString.length; i++) {
    hashVal = (hashVal << 5) - hashVal + seedString.charCodeAt(i);
    hashVal |= 0;
  }
  const hashAbs = Math.abs(hashVal);

  const templatesEn = [
    `According to Law No. 21 of 1957 on Trademarks and Descriptions of the Republic of Iraq, this certified mark is officially classified within <strong class="text-stone-950 font-bold font-sans">${certificate.classNumber}</strong>. The underlying protective scope covers the official category of: <em class="text-amber-950 not-italic font-black select-all">"${certificate.goodsServicesEn}"</em>. This registration grants exclusive proprietary rights and protections over this distinct category within Iraqi National boundaries for the statutory 10-year period.`,
    `Under the statutory provisions of the Iraqi Trademark Code (Law 21 of 1957), this mark has been registered and scheduled under <strong class="text-stone-950 font-bold font-sans">${certificate.classNumber}</strong>. It confers absolute proprietary registry rights and state protection over the specific category of: <em class="text-amber-955 not-italic font-black select-all">"${certificate.goodsServicesEn}"</em>. Any unauthorized usage, imitation or infringement within the territory of Iraq is strictly prohibited by federal law.`,
    `The Ministry of Industry and Minerals hereby certifies that this distinct trademark is fully logged in the National Register of Trademarks under <strong class="text-stone-950 font-bold font-sans">${certificate.classNumber}</strong>. This registration secures comprehensive legal protection and federal immunity for the category description of: <em class="text-amber-955 not-italic font-black select-all">"${certificate.goodsServicesEn}"</em> for 10 Gregorian years from the official filing date.`,
    `Pursuant to the legal mandates of the Republic of Iraq Trade Authority, this corporate trademark has successfully passed all regulatory checks and is entered on the state roll in <strong class="text-stone-950 font-bold font-sans">${certificate.classNumber}</strong>. Legal protection is hereby active for the registered scope: <em class="text-amber-955 not-italic font-black select-all">"${certificate.goodsServicesEn}"</em>, granting sole distribution and ownership rights.`
  ];

  const templatesAr = [
    `بموجب أحكام ومقتضيات قانون العلامات والبيانات التجارية العراقي رقم ٢١ لسنة ١٩٥٧، تم إدراج وتوثيق هذه العلامة المعتمدة رسمياً وحمايتها قانونياً تحت <strong class="text-stone-950 font-serif font-bold">${certificate.classNumber}</strong>. صنف وفئة الحماية المسجلة تغطي السجل الفئوي التالي: <em class="text-amber-955 not-italic font-serif font-black select-all">"${certificate.goodsServicesAr}"</em>. يمنح هذا التسجيل المالك المسجل الحقوق والامتيازات القانونية الحصرية والكاملة لمنع أي استخدام أو تقليد غير مشروع.`,
    `بناءً على الصلاحيات الممنوحة لوزارة الصناعة والمعادن بمقتضى القانون الإداري رقم ٢١ لعام ١٩٥٧، تشهر هذه العلامة التجارية وتصنف تحت <strong class="text-stone-950 font-serif font-bold">${certificate.classNumber}</strong>. يثبت هذا السجل الملكية الحصرية والحماية الفيدرالية الشاملة لنطاق: <em class="text-amber-955 not-italic font-serif font-black select-all">"${certificate.goodsServicesAr}"</em> على امتداد أراضي جمهورية العراق لتبدأ من تاريخ الإيداع الرسمي.`,
    `طبقاً للمرسوم والاختصاص الدستوري لمسجل العلامات التجارية العراقي، تقرر رسمياً قبول هذه العلامة وبسط الحماية القانونية التامة عليها ضمن <strong class="text-stone-950 font-serif font-bold">${certificate.classNumber}</strong>. تشمل هذه الشهادة الحماية الحصرية لبيان السلع التالي: <em class="text-amber-955 not-italic font-serif font-black select-all">"${certificate.goodsServicesAr}"</em>، ويحظر على أي طرف ثالث محاكاة أو استخدام العلامة بدون ترخيص خطي معتمد.`,
    `بموجب الضوابط واللوائح المعتمدة في الهيئة العامة لتسجيل السلع والبيانات، فقد تقرر قيد هذه العلامة في الدفتر الرسمي وحمايتها في <strong class="text-stone-950 font-serif font-bold">${certificate.classNumber}</strong>. هذه الحماية سارية المفعول وتغطي بصفة حصرية السجل التجاري التالي: <em class="text-amber-955 not-italic font-serif font-black select-all">"${certificate.goodsServicesAr}"</em> لمدة عشر سنوات كاملة قابلة للتجديد.`
  ];

  const descEn = templatesEn[hashAbs % templatesEn.length];
  const descAr = templatesAr[hashAbs % templatesAr.length];
  
  return (
    <div 
      className="relative bg-white text-stone-900 border border-stone-300 shadow-2xl p-10 md:p-12 font-serif select-none select-text mx-auto print:m-0 print:border-none print:shadow-none print:p-0"
      style={{
        width: "794px",
        height: "1123px",
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        boxSizing: "border-box"
      }}
      id={`auth-certificate-sheet-${certificate.certificateNumber}`}
    >
      {/* ================= BACKGROUND WATERMARK (IRAQ IND. PROPERTY) ================= */}
      {certificate.showWatermark && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0">
          <div className="text-[78px] font-black text-stone-100/40 uppercase tracking-widest leading-none rotate-30 select-none text-center grid select-none border-4 border-stone-100/45 p-4 rounded-xl border-dashed">
            {(!isEnglish) && <span>جمهورية العراق</span>}
            {(!isArabic) && <span className="text-3xl font-sans mt-2">REPUBLIC OF IRAQ</span>}
            <span className="text-xl font-sans tracking-wide">MINISTRY OF TRADE / INDUSTRY</span>
          </div>
        </div>
      )}

      {/* ================= COMPLIANT ARABESQUE FRAME LIMIT ================= */}
      {/* Dynamic Golden Double Border Frame with Corner Loops */}
      <div className="absolute inset-4 border-[3px] border-amber-600/90 pointer-events-none z-10">
        <div className="absolute inset-1.5 border border-amber-600/60"></div>
        
        {/* Top-Left Corner Ornament */}
        <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-[3px] border-l-[3px] border-amber-600/95 rounded-tl bg-white"></div>
        {/* Top-Right Corner Ornament */}
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-[3px] border-r-[3px] border-amber-600/95 rounded-tr bg-white"></div>
        {/* Bottom-Left Corner Ornament */}
        <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-[3px] border-l-[3px] border-amber-600/95 rounded-bl bg-white"></div>
        {/* Bottom-Right Corner Ornament */}
        <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-[3px] border-r-[3px] border-amber-600/95 rounded-br bg-white"></div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-between py-2" id="document-composition">
        
        {/* ================= CERTIFICATE HEADER ================= */}
        <header className="flex justify-between items-start gap-4 border-b-2 border-stone-200 pb-3" id="legal-cert-header">
          {/* Left Block - English Headings */}
          {(!isArabic) ? (
            <div className="text-left space-y-0.5 max-w-[260px] font-sans">
              <h4 className="text-xs font-black tracking-wider text-stone-850 uppercase">{certificate.countryEn}</h4>
              <h5 className="text-[9px] font-extrabold text-stone-750 uppercase leading-tight">{certificate.ministryEn}</h5>
              <p className="text-[7.5px] font-bold text-stone-600 leading-snug">{certificate.departmentEn}</p>
            </div>
          ) : (
            <div className="w-[100px]" /> /* spacer */
          )}

          {/* Central Logo Emblem - High-Fidelity SVG Coat of Arms of Republic of Iraq */}
          <div className="flex flex-col items-center justify-center text-center shrink-0">
            <div className="w-14 h-16 flex items-center justify-center p-1 border border-amber-600/35 bg-white shadow-sm rounded-lg">
              <IraqiCrest className="w-12 h-14" />
            </div>
            <span className="text-[6.5px] font-sans mt-1.5 font-black text-stone-500 tracking-widest uppercase">FEDERAL GOVERNMENT RECORD</span>
          </div>

          {/* Right Block - Arabic Headings */}
          {(!isEnglish) ? (
            <div className="text-right space-y-0.5 max-w-[260px] font-serif font-bold" dir="rtl">
              <h4 className="text-[12px] font-bold tracking-wide text-stone-900">{certificate.countryAr}</h4>
              <h5 className="text-[10px] font-extrabold text-stone-800 leading-tight">{certificate.ministryAr}</h5>
              <p className="text-[8px] font-bold text-stone-600 leading-snug">{certificate.departmentAr}</p>
            </div>
          ) : (
            <div className="w-[100px]" /> /* spacer */
          )}
        </header>

        {/* ================= CERTIFICATE TITLES ================= */}
        <div className="text-center space-y-1.5 mt-3" id="legal-cert-titles">
          {(!isArabic) && (
            <h2 className="text-lg font-bold text-stone-900 tracking-tight font-sans">
              {certificate.documentTitleEn}
            </h2>
          )}
          {(!isEnglish) && (
            <h2 className="text-lg font-black text-amber-900 tracking-wide font-serif leading-none mt-1" dir="rtl">
              {certificate.documentTitleAr}
            </h2>
          )}
          <div className="flex items-center justify-center gap-4 text-[9px] font-sans font-bold text-stone-500 tracking-tight">
            {(!isArabic) && <span>{certificate.legalActEn}</span>}
            {isBilingual && <span className="text-stone-300">•</span>}
            {(!isEnglish) && <span className="font-serif text-[8.5px]" dir="rtl">{certificate.legalActAr}</span>}
          </div>
        </div>

        {/* ================= MAIN DATA MATRIX TABLE ================= */}
        <div className="mt-4 border-t border-b border-stone-200 py-4 grid grid-cols-12 gap-5 items-stretch" id="cert-datasheet-matrix">
          
          {/* Key-Value Attributes Matrix (9 Cols width) */}
          <div className="col-span-9 space-y-3 font-sans" id="matrix-left-specs">
            
            {/* ROW 1: Wordmark / اسم العلامة */}
            <div className={`grid grid-cols-12 items-center border-b border-stone-150 pb-2 ${isArabic ? "text-right" : "text-left"}`}>
              <div className="col-span-4 text-[10px] font-extrabold uppercase tracking-wide text-stone-550 flex flex-col justify-center">
                <span>{isArabic ? "توصيف علامة الاختصار" : "Trademark Word Mark"}</span>
                {isBilingual && <span className="text-[8px] text-stone-400 capitalize font-medium">اسم العلامة التجارية</span>}
              </div>
              
              <div className="col-span-8 flex justify-start items-center">
                <span className="font-sans font-black text-sm text-stone-900 select-all tracking-wide uppercase">
                  {certificate.trademarkNameEn || certificate.trademarkNameAr}
                </span>
              </div>
            </div>

            {/* ROW 2: Class Classification / صنف العلامة */}
            <div className={`grid grid-cols-12 items-center border-b border-stone-150 pb-2 ${isArabic ? "text-right" : "text-left"}`}>
              <div className="col-span-4 text-[10px] font-extrabold uppercase tracking-wide text-stone-550">
                <span>{isArabic ? "التصنيف الدولي (نيس)" : "Goods & Services Class"}</span>
                {isBilingual && <span className="text-[8px] text-stone-400 capitalize font-medium block">الفئة الدولية للعلامة</span>}
              </div>
              <div className="col-span-8 text-right font-sans font-bold text-xs text-stone-850">
                {certificate.classNumber}
              </div>
            </div>

            {/* ROW 3: Registrar Owner / مالك العلامة */}
            <div className={`grid grid-cols-12 items-start border-b border-stone-150 pb-2 ${isArabic ? "text-right" : "text-left"}`}>
              <div className="col-span-4 text-[10px] font-extrabold uppercase tracking-wide text-stone-550">
                <span>{isArabic ? "المالك المسجل وصاحب الحق" : "Registered Proprietor"}</span>
                {isBilingual && <span className="text-[8px] text-stone-400 capitalize font-medium block">اسم وعنوان الشركة المالكة</span>}
              </div>
              <div className={`col-span-8 space-y-1.5 ${isArabic ? "text-right" : "text-left"}`}>
                {(!isArabic) && (
                  <span className="block text-xs font-black text-stone-900 leading-none select-all uppercase">
                    {certificate.proprietorNameEn}
                  </span>
                )}
                {(!isEnglish) && (
                  <span className="block font-serif text-[11px] font-bold text-stone-800 select-all" dir="rtl">
                    {certificate.proprietorNameAr}
                  </span>
                )}
                {(!isArabic) && (
                  <span className="block text-[10px] text-stone-500 leading-snug">
                    {certificate.proprietorAddressEn}
                  </span>
                )}
                {(!isEnglish) && (
                  <span className="block font-serif text-[9px] text-stone-500 leading-none font-medium" dir="rtl">
                    {certificate.proprietorAddressAr}
                  </span>
                )}
              </div>
            </div>

            {/* ROW 4: Goods & Services / تفاصيل السلع والبيان */}
            <div className={`grid grid-cols-12 items-start border-b border-stone-150 pb-2 ${isArabic ? "text-right" : "text-left"}`}>
              <div className="col-span-4 text-[10px] font-extrabold uppercase tracking-wide text-stone-550">
                <span>{isArabic ? "السلع والخدمات المشمولة" : "Claimed Specifications"}</span>
                {isBilingual && <span className="text-[8px] text-stone-400 capitalize font-medium block">بيان المنتجات والخدمات</span>}
              </div>
              <div className="col-span-8 space-y-1 text-xs">
                {(!isArabic) && (
                  <p className="font-semibold text-stone-750 text-left select-all text-[10px] leading-snug">{certificate.goodsServicesEn}</p>
                )}
                {(!isEnglish) && (
                  <p className="font-serif text-[10px] text-stone-850 leading-normal select-all text-right font-bold" dir="rtl">
                    {certificate.goodsServicesAr}
                  </p>
                )}
              </div>
            </div>

            {/* ROW 5: ID Numbers and Legal protection Dates */}
            <div className="grid grid-cols-12 gap-3" id="timeline-matrix-row">
              <div className="col-span-6 bg-stone-50 p-2 border border-stone-150 rounded">
                <span className="text-[7.5px] font-black text-stone-500 uppercase tracking-widest block font-sans">
                  {isArabic ? "مفاتيح وسجل الطلبات" : "Application Registry Identifiers"}
                </span>
                <div className="mt-1 font-mono text-[9px] text-stone-800 font-bold space-y-0.5 leading-none">
                  <div className="flex justify-between">
                    <span>{isArabic ? "رقم الطلب الأولي:" : "CASE FILING ID:"}</span>
                    <span className="select-all font-black text-stone-950">{certificate.applicationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? "رقم تسجيل الشهادة:" : "CASE REG ID:"}</span>
                    <span className="select-all font-black text-stone-950">{certificate.certificateNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? "البلد الحامي:" : "NATION STATE:"}</span>
                    <span>{isArabic ? "جمهورية العراق" : "REPUBLIC OF IRAQ"}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-6 bg-stone-50 p-2 border border-stone-150 rounded">
                <span className="text-[7.5px] font-black text-stone-500 uppercase tracking-widest block font-sans">
                  {isArabic ? "صلاحيات وفترة الحماية" : "Statutory Validities (10 Years)"}
                </span>
                <div className="mt-1 font-mono text-[9px] text-stone-800 font-bold space-y-0.5 leading-none">
                  <div className="flex justify-between">
                    <span>{isArabic ? "التسجيل المعتمد:" : "REGISTRATION DATE:"}</span>
                    <span className="select-all">{certificate.dateOfRegistration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? "تاريخ التقديم:" : "FILING DATE:"}</span>
                    <span className="select-all">{certificate.dateOfFiling}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? "تاريخ الانتهاء:" : "EXPIRATION DATE:"}</span>
                    <span className="select-all text-red-700">{certificate.expiryDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 6: Classification & Category Protection Write-up Box */}
            <div className={`mt-2.5 p-2 rounded-lg border border-amber-600/15 bg-amber-500/5 text-stone-850 ${isArabic ? "text-right" : "text-left"}`}>
              <span className="text-[7.5px] font-black text-amber-900 uppercase tracking-widest block font-sans mb-1">
                {isArabic ? "توصيف وتصنيف علامة والخدمات المعتمدة قانونياً" : "Official Trademark Classification & Protected Category"}
              </span>
              <div className="text-[8.5px] leading-relaxed space-y-1">
                {(!isArabic) && (
                  <p 
                    className="font-semibold text-stone-750 font-sans text-left" 
                    id="cert-desc-english-section"
                    dangerouslySetInnerHTML={{ __html: descEn }}
                  />
                )}
                {(!isEnglish) && (
                  <p 
                    className="font-serif font-bold text-stone-900 leading-relaxed text-right" 
                    dir="rtl" 
                    id="cert-desc-arabic-section"
                    dangerouslySetInnerHTML={{ __html: descAr }}
                  />
                )}
              </div>
            </div>

          </div>

          {/* Device Trademark Logo Representation Column (3 Cols width) */}
          <div className="col-span-3 border-l border-stone-150 pl-4 flex flex-col justify-start items-center space-y-4" id="matrix-right-logo">
            <span className="text-[7.5px] font-black tracking-widest uppercase text-stone-400 block text-center font-sans">
              {isArabic ? "الشعار المودع" : "Registered Logo"}
            </span>
            
            <div className="w-[124px] h-[124px] bg-white border-2 border-stone-200 rounded p-1 flex items-center justify-center overflow-hidden shadow-inner relative z-10 mt-1">
              {certificate.uploadedLogoUrl ? (
                <img 
                  src={certificate.uploadedLogoUrl} 
                  alt="Registrant Device Symbol" 
                  className="max-h-full max-w-full object-contain filter"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center font-bold text-stone-800 font-sans text-xs tracking-tight leading-snug uppercase">
                  {certificate.presetLogoId === "mesopotamia-palm-shield" && (
                    <div className="space-y-0.5">
                      <span className="text-lg block">🌴</span>
                      <span className="text-[9px] block">AL-PALM</span>
                    </div>
                  )}
                  {certificate.presetLogoId === "mesopotamia-cuneiform" && (
                    <div className="space-y-0.5">
                      <span className="text-lg block">⭐</span>
                      <span className="text-[9px] block">AL-STAR</span>
                    </div>
                  )}
                  {certificate.presetLogoId === "crescent-tech" && (
                    <div className="space-y-0.5">
                      <span className="text-lg block">🌙</span>
                      <span className="text-[9px] block">AL-CRESCENT</span>
                    </div>
                  )}
                  {certificate.presetLogoId === "islamic-geometry" && (
                    <div className="space-y-0.5">
                      <span className="text-lg block">🛡️</span>
                      <span className="text-[9px] block">AL-SHIELD</span>
                    </div>
                  )}
                  {!certificate.presetLogoId && (
                    <span className="text-[9px] text-stone-400">No Logo Device</span>
                  )}
                </div>
              )}
            </div>

            <span className="text-[8.5px] text-stone-500 italic block font-sans text-center mt-1 leading-tight font-bold">
              {isArabic ? "نمط العلامة: لفظي ثنائي" : `Model: ${certificate.trademarkType.split(" / ")[0]}`}
            </span>

            {/* System Gazette Issue Ref */}
            <div className="text-center bg-stone-50 border border-stone-150 py-1.5 px-2 rounded w-full">
              <span className="text-[7px] text-stone-400 uppercase tracking-widest font-mono font-bold block">
                {isArabic ? "الجريدة الرسمية" : "CASE PUBLICATION"}
              </span>
              <span className="text-[8.5px] text-amber-950 font-extrabold block truncate leading-none mt-1 select-all">{certificate.gazetteNumber}</span>
            </div>
          </div>

        </div>

        {/* ================= REGISTER SIGNATURES & STAMPS ================= */}
        <div className="grid grid-cols-12 gap-4 items-end mt-4" id="seals-signatures-pane">
          
          {/* Bottom Left - Registrar Signature Block */}
          <div className="col-span-7 text-left space-y-1" id="signature-registrar-block">
            <span className="text-[8px] font-black text-stone-400 uppercase tracking-wider block font-sans">
              {isArabic ? "التوقيق الرسمي والتصديق" : "Seal of Authority & Approval"}
            </span>
            <div className="h-16 flex items-center justify-start pl-2 relative" id="signature-handwritten-stage">
              {certificate.showSignature && (
                <div className="absolute left-1 top-1 select-none pointer-events-none z-10 opacity-95">
                  <svg viewBox="0 0 160 50" className="w-38 h-12 text-blue-900/90" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ mixBlendMode: "multiply", transform: "rotate(-3deg)" }}>
                    <path d="M 6 30 C 12 18, 16 4, 22 10 C 26 15, 18 36, 32 28 C 38 23, 41 16, 46 20 C 49 23, 44 32, 53 28 C 60 25, 64 10, 67 15 C 70 20, 64 34, 73 31 C 79 28, 81 16, 87 21 C 92 25, 85 36, 94 32 C 101 28, 104 13, 109 17 C 113 21, 108 31, 117 27 C 123 24, 126 13, 132 17 Q 138 22, 131 32 C 137 28, 145 10, 153 18" />
                    <path d="M 8 34 Q 40 44, 105 38 T 154 28" strokeWidth="1.2" stroke="currentColor" className="opacity-80" />
                    <path d="M 28 38 Q 65 44, 115 39" strokeWidth="0.8" stroke="currentColor" className="opacity-70" />
                  </svg>
                </div>
              )}
              {/* Registrar stamp representation */}
              {certificate.showStamp && (
                <div className="absolute left-[34px] -top-5 w-20 h-20 select-none pointer-events-none z-0 transform rotate-12 transition-transform hover:rotate-6">
                  <svg 
                     viewBox="0 0 100 100" 
                    className="w-full h-full text-blue-700/85 drop-shadow-[0.5px_1px_1px_rgba(0,0,0,0.15)] filter"
                    style={{ 
                      color: certificate.sealColor === "blue" ? "#1e40af" : certificate.sealColor === "gold" ? "#b45309" : "#be123c",
                      mixBlendMode: "multiply"
                    }}
                  >
                    <defs>
                      <path id="stamp-text-path-top" d="M 12,50 A 38,38 0 1,1 88,50" fill="none" />
                      <path id="stamp-text-path-bottom" d="M 88,50 A 38,38 0 1,1 12,50" fill="none" />
                    </defs>
                    
                    {/* Ring designs for maximum authenticity */}
                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="98 2" className="opacity-95" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.75" className="opacity-80" />
                    <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="1.2" className="opacity-90" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 1" className="opacity-70" />
                    
                    {/* Concentric text */}
                    <text fontFamily="sans-serif" fontWeight="950" fontSize="6px" fill="currentColor" letterSpacing="0.5">
                      <textPath xlinkHref="#stamp-text-path-top" href="#stamp-text-path-top" startOffset="50%" textAnchor="middle">
                        ★ TRADEMARK REGISTRY ★
                      </textPath>
                    </text>
                    <text fontFamily="sans-serif" fontWeight="955" fontSize="5.5px" fill="currentColor" letterSpacing="0.2">
                      <textPath xlinkHref="#stamp-text-path-bottom" href="#stamp-text-path-bottom" startOffset="50%" textAnchor="middle">
                        مسجل العلامات التجارية • بغداد
                      </textPath>
                    </text>
                    
                    {/* Central Mesopotamia Palm / Crown details */}
                    <g transform="translate(50, 50) scale(0.72)">
                      <path d="M-1.5 15 L1.5 15 L1 0 L-1 0 Z" fill="currentColor" />
                      <path d="M0 0 Q-15 -4 -20 3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M0 0 Q-12 -12 -22 -6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M0 0 Q-6 -18 -12 -14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M0 0 Q0 -20 0 -15" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M0 0 Q6 -18 12 -14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M0 0 Q12 -12 22 -6" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M0 0 Q15 -4 20 3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      <text y="24" fontFamily="sans-serif" fontWeight="900" fontSize="7px" fill="currentColor" textAnchor="middle" letterSpacing="1">
                        M.I.M
                      </text>
                    </g>
                  </svg>
                </div>
              )}
            </div>
            <div className="space-y-0.5 leading-none font-sans mt-1">
              <div className="flex justify-between items-center text-[10px]">
                {(!isArabic) && <strong className="text-stone-850">{certificate.registrarNameEn}</strong>}
                {(!isEnglish) && <span className="font-serif text-[10px] font-bold" dir="rtl">{certificate.registrarNameAr}</span>}
              </div>
              {(!isArabic) && <p className="text-[7.5px] text-stone-500">{certificate.registrarPositionEn}</p>}
              {(!isEnglish) && <p className="text-[8px] font-serif font-bold text-stone-500 leading-none text-left" dir="rtl">{certificate.registrarPositionAr}</p>}
            </div>
          </div>

          {/* Bottom Right - Verifiable QR Code Validation */}
          <div className="col-span-5 flex flex-col items-end text-right space-y-1.5" id="cert-digital-badge">
            <span className="text-[7.5px] font-black text-stone-400 uppercase tracking-widest block font-sans">
              {isArabic ? "مفتاح التحقق ثنائي اللغة" : "Bilingual Live Verify Code"}
            </span>
            
            <div className="flex items-center gap-3 bg-stone-50 p-2 rounded-xl border border-stone-200 shadow-inner shrink-0 leading-none">
              <div className="text-left font-mono space-y-1 text-stone-600">
                <span className="text-[7.5px] font-black text-stone-400 tracking-wider block leading-none">
                  {isArabic ? "حالة التسجيل:" : "REGISTRATION STATUS:"}
                </span>
                <span className="text-[9.5px] font-black text-emerald-700 block bg-emerald-100/60 border border-emerald-400 px-1 py-0.5 rounded leading-none text-center">
                  {isArabic ? "نشطة وقانونية" : "ACTIVE"}
                </span>
                <span className="text-[6.5px] text-stone-500 font-sans block leading-none mt-1">
                  {isArabic ? "امسح لسحب الملف" : "Scan to pull up case files"}
                </span>
              </div>
              <div className="bg-white p-1 rounded border border-stone-200 shrink-0 flex items-center justify-center w-16 h-16">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Verified Live QR Code"
                    className="w-14 h-14"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 bg-stone-100 flex items-center justify-center">
                    <span className="text-[6px] font-sans text-stone-400">Loading...</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[7px] text-stone-450 leading-relaxed font-sans max-w-[190px] text-right">
              {isArabic ? (
                <span>الرمز الإلكتروني يعود مساره لسجل التحقق برقم: <strong className="text-stone-700 select-all font-mono break-all">{certificate.certificateNumber}</strong>.</span>
              ) : (
                <span>This secure QR Code dynamically maps and redirects to case verify registry: <strong className="text-stone-700 select-all font-mono break-all">{certificate.certificateNumber}</strong>.</span>
              )}
            </p>
          </div>

        </div>

        {/* ================= COMPLIANT SYSTEM CREDIT FOOTER NOTE ================= */}
        <footer className="border-t border-stone-200/80 pt-1.5 mt-2 flex justify-between items-center text-[7px] font-sans font-bold text-stone-400" id="spec-legal-footer">
          <span>FEDERAL TRADEMARKS DATABASE SYSTEM (IRAQGOVTRADEMARK.ORG)</span>
          <span>BILINGUAL ORIGINAL REGISTRATION A4 CERTIFICATE (10 YEARS STATUTORY REGISTRATION TERM)</span>
        </footer>

      </div>
    </div>
  );
}
