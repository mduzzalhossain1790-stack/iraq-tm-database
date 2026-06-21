/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TrademarkCertificate, CertificatePresetId } from "../types";
import { CERTIFICATE_PRESETS } from "../presets";
import { Upload, Shuffle, Check, FileText, Globe, Award, Sparkles, Image as ImageIcon } from "lucide-react";

interface FormEditorProps {
  certificate: TrademarkCertificate;
  onChange: (updates: Partial<TrademarkCertificate>) => void;
  onLoadPreset: (presetId: CertificatePresetId) => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({ 
  certificate, 
  onChange, 
  onLoadPreset 
}) => {
  const [activeTab, setActiveTab] = useState<"presets" | "general" | "proprietor" | "dates" | "aesthetics">("presets");
  const [isDragging, setIsDragging] = useState(false);

  // Handle Drag & Drop for user's trademark logo
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({ uploadedLogoUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Helper to quickly copy bilingual text or generate random filing number for realism
  const generateRandomNumbers = () => {
    const randomAppNum = `IQ/TM/${new Date().getFullYear()}/${Math.floor(100000 + Math.random() * 900000)}`;
    const randomRegNum = `REG-${Math.floor(100000 + Math.random() * 900000)}-A`;
    onChange({
      applicationNumber: randomAppNum,
      certificateNumber: randomRegNum
    });
  };

  // Auto-set standard expiry date based on 10-years trademark rules in Iraq
  const handleFilingDateChange = (date: string) => {
    if (!date) return;
    const filingDate = new Date(date);
    // Iraqi Trademarks expire exactly 10 Gregorian years from filing date
    const expiryYear = filingDate.getFullYear() + (certificate.certificateType === "patent" ? 20 : 10);
    const expiryMonth = String(filingDate.getMonth() + 1).padStart(2, '0');
    const expiryDay = String(filingDate.getDate()).padStart(2, '0');
    onChange({
      dateOfFiling: date,
      expiryDate: `${expiryYear}-${expiryMonth}-${expiryDay}`
    });
  };

  return (
    <div className="bg-stone-900 border border-stone-850 rounded-xl overflow-hidden shadow-xl" id="editor-left-navigation-panel">
      {/* Tab bar header */}
      <div className="flex border-b border-stone-800 text-xs bg-stone-950 font-medium" id="editor-nav-tabbar">
        <button 
          onClick={() => setActiveTab("presets")}
          className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${activeTab === "presets" ? "border-amber-500 text-amber-400 bg-stone-900/40" : "border-transparent text-stone-400 hover:text-stone-200"}`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Presets
        </button>
        <button 
          onClick={() => setActiveTab("general")}
          className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${activeTab === "general" ? "border-amber-500 text-amber-400 bg-stone-900/40" : "border-transparent text-stone-400 hover:text-stone-200"}`}
        >
          <FileText className="w-3.5 h-3.5" /> Trademark Info
        </button>
        <button 
          onClick={() => setActiveTab("proprietor")}
          className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${activeTab === "proprietor" ? "border-amber-500 text-amber-400 bg-stone-900/40" : "border-transparent text-stone-400 hover:text-stone-200"}`}
        >
          <Globe className="w-3.5 h-3.5" /> Proprietor
        </button>
        <button 
          onClick={() => setActiveTab("dates")}
          className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${activeTab === "dates" ? "border-amber-500 text-amber-400 bg-stone-900/40" : "border-transparent text-stone-400 hover:text-stone-200"}`}
        >
          <Award className="w-3.5 h-3.5" /> Dates & ID
        </button>
        <button 
          onClick={() => setActiveTab("aesthetics")}
          className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 border-b-2 ${activeTab === "aesthetics" ? "border-amber-500 text-amber-400 bg-stone-900/40" : "border-transparent text-stone-400 hover:text-stone-200"}`}
        >
          <ImageIcon className="w-3.5 h-3.5" /> Aesthetics
        </button>
      </div>

      <div className="p-4 space-y-4 text-stone-300 select-none max-h-[640px] overflow-y-auto" id="editor-active-forms">
        
        {/* ================= 1. PRESETS TAB ================= */}
        {activeTab === "presets" && (
          <div className="space-y-4" id="presets-container-tab">
            <div className="bg-stone-950/80 p-3 rounded-lg border border-stone-800 text-center">
              <h3 className="text-amber-400 font-display font-semibold text-sm">Select Official Base Template</h3>
              <p className="text-[11px] text-stone-500 mt-1">Load high fidelity Iraqi governmental layouts mimicking authentic registries and ministerial bodies.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {CERTIFICATE_PRESETS.map((p) => {
                const isActive = certificate.certificateType === p.data.certificateType && certificate.documentTitleEn === p.data.documentTitleEn;
                return (
                  <button
                    key={p.id}
                    onClick={() => onLoadPreset(p.id)}
                    className={`text-left p-3.5 rounded-lg border transition-all flex flex-col justify-between cursor-pointer ${isActive ? "border-amber-500 bg-amber-500/5 text-white" : "border-stone-800 bg-stone-900 hover:bg-stone-850 hover:border-stone-700"}`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-semibold text-xs text-stone-200 flex items-center gap-1.5">
                        {p.name}
                        {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-normal">{p.description}</p>
                    <div className="mt-2.5 flex items-center gap-2 text-[10px] text-stone-400">
                      <span className="px-1.5 py-0.5 rounded bg-stone-850 font-mono text-[9px] border border-stone-800 uppercase">{p.data.certificateType}</span>
                      <span className="text-amber-600 font-semibold">{p.data.countryAr}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="p-3.5 rounded-lg border border-yellow-900/30 bg-yellow-950/20 text-yellow-500/90 text-[11px] leading-relaxed flex gap-2">
              <span className="text-xs">⚠️</span>
              <div>
                <strong>Bilingual Standard:</strong> All official documents in Iraq are fully translated. Changing values in one language does not automatically translate the other. Be sure to fill out both columns for legal fidelity.
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. TRADEMARK INFO TAB ================= */}
        {activeTab === "general" && (
          <div className="space-y-4" id="tm-info-container-tab">
            
            {/* Certificate Categorization Toggle */}
            <div className="bg-stone-950/40 p-2.5 rounded-lg border border-stone-850">
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">Registry Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(["trademark", "patent", "design"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onChange({ 
                      certificateType: type,
                      documentTitleEn: type === "trademark" ? "CERTIFICATE OF TRADEMARK REGISTRATION" : type === "patent" ? "PATENT OF INVENTION (CERTIFICATE ISSUED UNDER LAW 65)" : "CERTIFICATE OF INDUSTRIAL DESIGN REGISTRATION",
                      documentTitleAr: type === "trademark" ? "شهادة تســجيل علامة فارقة" : type === "patent" ? "بــراءة اخــتراع (ممنوحة وفق القانون رقـم ٦٥)" : "شهادة تسجيل الرسوم والنماذج الصناعية"
                    })}
                    className={`py-1.5 rounded text-[10.5px] font-bold capitalize transition-all border ${certificate.certificateType === type ? "bg-amber-500 border-amber-600 text-stone-950" : "bg-stone-900 border-stone-800 text-stone-400"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Trademark Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-stone-950/20 p-3 rounded-lg border border-stone-850">
              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Trademark Name (English)</label>
                <input 
                  type="text" 
                  value={certificate.trademarkNameEn}
                  onChange={(e) => onChange({ trademarkNameEn: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-500 font-sans"
                  placeholder="e.g. SINDIBAD TOURS LLC"
                />
              </div>
              <div className="text-right">
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1 text-right">عنوان أو لفظ العلامة (بالعربية)</label>
                <input 
                  type="text" 
                  dir="rtl"
                  value={certificate.trademarkNameAr}
                  onChange={(e) => onChange({ trademarkNameAr: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-500 font-serif"
                  placeholder="مثال: شركة السندباد للسياحة"
                />
              </div>
            </div>

            {/* Classification */}
            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">International Classification Nice/Locarno Class</label>
              <input 
                type="text" 
                value={certificate.classNumber}
                onChange={(e) => onChange({ classNumber: e.target.value })}
                className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                placeholder="e.g. Class 32 (Mineral beverages)"
              />
            </div>

            {/* Goods and Services description - English */}
            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Specification of Covered Goods (English)</label>
              <textarea 
                rows={3}
                value={certificate.goodsServicesEn}
                onChange={(e) => onChange({ goodsServicesEn: e.target.value })}
                className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
                placeholder="Write goods list... e.g. Soaps, mineral waters, dates extracts..."
              />
            </div>

            {/* Goods and Services description - Arabic */}
            <div className="text-right">
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1 text-right">بيان البضائع أو الخدمات المشمولة (بالعربية)</label>
              <textarea 
                rows={3}
                dir="rtl"
                value={certificate.goodsServicesAr}
                onChange={(e) => onChange({ goodsServicesAr: e.target.value })}
                className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-500 font-serif leading-relaxed"
                placeholder="بيان تفصيلي بالسلع... مثال: الصابون، موائد التجميل، التمور..."
              />
            </div>
            
            {/* Trademark Type Tag (Wordmark, Logo or Device, etc.) */}
            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Mark Representation Type</label>
              <select
                value={certificate.trademarkType}
                onChange={(e) => onChange({ trademarkType: e.target.value })}
                className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Word & Device (Logo) / لفظي ورسمي">Word & Device Logo (لفظي ورسمي)</option>
                <option value="Wordmark Only / لفظية فقط">Wordmark Only (لفظية فقط)</option>
                <option value="Device / رسمية تعبيرية فقط">Device Only (رسمية تعبيرية فقط)</option>
                <option value="Scientific Patent / الاختراع العلمي">Scientific Patent (الاختراع العلمي)</option>
                <option value="Industrial Pattern / نموذج صناعي">Industrial Patent (الأشكال والتصاميم)</option>
              </select>
            </div>

          </div>
        )}

        {/* ================= 3. PROPRIETOR INFO TAB ================= */}
        {activeTab === "proprietor" && (
          <div className="space-y-4" id="proprietor-container-tab">
            
            {/* Proprietor Name (English & Arabic) */}
            <div className="bg-stone-950/20 p-3 rounded-lg border border-stone-850 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Owner Name / Organization (English)</label>
                <input 
                  type="text" 
                  value={certificate.proprietorNameEn}
                  onChange={(e) => onChange({ proprietorNameEn: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none"
                  placeholder="e.g. SINDIBAD TRADING COMPANY LTD."
                />
              </div>
              <div className="text-right">
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1 text-right">اسم مالك العلامة الكامل (بالعربية)</label>
                <input 
                  type="text" 
                  dir="rtl"
                  value={certificate.proprietorNameAr}
                  onChange={(e) => onChange({ proprietorNameAr: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none font-serif"
                  placeholder="مثال: شركة دجلة والفرات التجارية مسجلة"
                />
              </div>
            </div>

            {/* Proprietor Address (English & Arabic) */}
            <div className="bg-stone-950/20 p-3 rounded-lg border border-stone-850 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Corporate Registered Address (English)</label>
                <textarea 
                  rows={2}
                  value={certificate.proprietorAddressEn}
                  onChange={(e) => onChange({ proprietorAddressEn: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none"
                  placeholder="e.g. Baghdad, Karada District, St 9, Building 7"
                />
              </div>
              <div className="text-right">
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1 text-right">العنوان الرسمي المعتمد للمالك (بالعربية)</label>
                <textarea 
                  rows={2}
                  dir="rtl"
                  value={certificate.proprietorAddressAr}
                  onChange={(e) => onChange({ proprietorAddressAr: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none font-serif"
                  placeholder="مثال: بغداد، شارع الكرادة داخل، محلة ٩٠١، بناء ٧"
                />
              </div>
            </div>

          </div>
        )}

        {/* ================= 4. DATES & RECORDS TAB ================= */}
        {activeTab === "dates" && (
          <div className="space-y-4" id="dates-container-tab">
            
            {/* Quick Generator tools */}
            <div className="flex justify-between items-center bg-stone-950/30 p-2.5 rounded-lg border border-stone-850">
              <span className="text-[11px] text-stone-400">Generate randomized, valid-format Iraqi legal registration numbers:</span>
              <button
                type="button"
                onClick={generateRandomNumbers}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-600 font-bold text-[10.5px] text-stone-950 cursor-pointer transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" /> Randomize IDs
              </button>
            </div>

            {/* Identifiers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Application N°</label>
                <input 
                  type="text" 
                  value={certificate.applicationNumber}
                  onChange={(e) => onChange({ applicationNumber: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Registration/Patent N°</label>
                <input 
                  type="text" 
                  value={certificate.certificateNumber}
                  onChange={(e) => onChange({ certificateNumber: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Priority Details */}
            <div>
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Legal Priority details (if applicable)</label>
              <input 
                type="text" 
                value={certificate.priorityData}
                onChange={(e) => onChange({ priorityData: e.target.value })}
                className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none"
                placeholder="e.g. Traditional priority claims/ none"
              />
            </div>

            {/* Dates: Filing & Reg */}
            <div className="bg-stone-950/25 p-3 rounded-lg border border-stone-850 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Filing Date (تاريخ التقديم)</label>
                <input 
                  type="date" 
                  value={certificate.dateOfFiling}
                  onChange={(e) => handleFilingDateChange(e.target.value)}
                  className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Registration Date (تاريخ التسجيل)</label>
                <input 
                  type="date" 
                  value={certificate.dateOfRegistration}
                  onChange={(e) => onChange({ dateOfRegistration: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">Expiry / Renew Date (تاريخ نفاذ الحماية)</label>
                  <span className="text-[9px] text-red-500 font-semibold font-mono">10 YR standard (TM) / 20 YR (Patent)</span>
                </div>
                <input 
                  type="date" 
                  value={certificate.expiryDate}
                  onChange={(e) => onChange({ expiryDate: e.target.value })}
                  className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none font-semibold text-red-400"
                />
              </div>
            </div>

          </div>
        )}

        {/* ================= 5. AESTHETICS & SIGN-OFF TAB ================= */}
        {activeTab === "aesthetics" && (
          <div className="space-y-4" id="aesthetics-container-tab">
            
            {/* Custom Logo Upload Section (Drag & Drop + File field) */}
            <div className="bg-stone-950/30 p-3.5 rounded-lg border-2 border-dashed border-stone-800 hover:border-amber-500/50 transition-colors">
              <label className="block text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-2 text-center flex items-center justify-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload Registered Trademark Logo
              </label>
              
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`text-center py-4 px-1 rounded-md transition-colors cursor-pointer ${isDragging ? "bg-amber-500/10" : "bg-stone-950/40"}`}
                onClick={() => document.getElementById("hidden-file-input")?.click()}
              >
                {certificate.uploadedLogoUrl ? (
                  <div className="flex flex-col items-center gap-1 text-[10px]">
                    <div className="w-12 h-12 rounded border border-stone-700 bg-white p-0.5 overflow-hidden flex items-center justify-center">
                      <img src={certificate.uploadedLogoUrl} alt="Thumbnail" className="max-w-full max-h-full object-contain" />
                    </div>
                    <span className="text-emerald-400 font-semibold">✓ Custom mark loaded successfully</span>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange({ uploadedLogoUrl: undefined });
                      }}
                      className="text-[9.5px] text-red-400 hover:underline pt-1"
                    >
                      Remove & Fallback to vector
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-[10px] text-stone-400">Drag or click to choose PNG/JPG. Transparent background recommended for maximum detail.</p>
                    <span className="inline-block text-[9px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded">A4 Resolution compliant</span>
                  </div>
                )}
              </div>
              <input 
                id="hidden-file-input" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>

            {/* Fallback Preset Trademark Marks Picker */}
            {!certificate.uploadedLogoUrl && (
              <div className="bg-stone-950/15 p-2.5 rounded-lg border border-stone-850">
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">Preset Vector Marks (If no upload used)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "mesopotamia-palm-shield", name: "Palm Tree" },
                    { id: "mesopotamia-cuneiform", name: "Cuneiform" },
                    { id: "crescent-tech", name: "Crescent" },
                    { id: "islamic-geometry", name: "8 Star" }
                  ].map((markOpt) => (
                    <button
                      key={markOpt.id}
                      type="button"
                      onClick={() => onChange({ presetLogoId: markOpt.id })}
                      className={`py-1.5 px-0.5 rounded text-[10px] truncate border text-center transition-all ${certificate.presetLogoId === markOpt.id ? "bg-amber-500/15 border-amber-500 text-amber-400 font-bold" : "bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-300"}`}
                    >
                      {markOpt.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Authority Signatory Fields */}
            <div className="bg-stone-950/20 p-3 rounded-lg border border-stone-850 space-y-3">
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">Authorized Officer Signature</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9.5px] text-stone-500 uppercase mb-0.5">Name (English)</label>
                  <input 
                    type="text" 
                    value={certificate.registrarNameEn}
                    onChange={(e) => onChange({ registrarNameEn: e.target.value })}
                    className="w-full text-xs p-1.5 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none"
                  />
                </div>
                <div className="text-right">
                  <label className="block text-[9.5px] text-stone-500 uppercase mb-0.5 text-right">الاسم بالعربية</label>
                  <input 
                    type="text" 
                    dir="rtl"
                    value={certificate.registrarNameAr}
                    onChange={(e) => onChange({ registrarNameAr: e.target.value })}
                    className="w-full text-xs p-1.5 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9.5px] text-stone-500 uppercase mb-0.5">Title En</label>
                  <input 
                    type="text" 
                    value={certificate.registrarPositionEn}
                    onChange={(e) => onChange({ registrarPositionEn: e.target.value })}
                    className="w-full text-xs p-1.5 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none"
                  />
                </div>
                <div className="text-right">
                  <label className="block text-[9.5px] text-stone-500 uppercase mb-0.5 text-right">عنوان المنصب بالعربية</label>
                  <input 
                    type="text" 
                    dir="rtl"
                    value={certificate.registrarPositionAr}
                    onChange={(e) => onChange({ registrarPositionAr: e.target.value })}
                    className="w-full text-xs p-1.5 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Decorative Theme Elements */}
            <div className="bg-stone-950/20 p-3 rounded-lg border border-stone-850 space-y-3">
              <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">Aesthetic Customizer</label>
              
              {/* Border select */}
              <div>
                <label className="block text-[10px] text-stone-500 uppercase mb-1">Border Ornamental Style</label>
                <select
                  value={certificate.borderStyle}
                  onChange={(e) => onChange({ borderStyle: e.target.value as any })}
                  className="w-full text-xs p-2 rounded bg-stone-950 border border-stone-800 text-white focus:outline-none"
                >
                  <option value="double-gold">Double Official Gold Fine Border (رسمي ذهبي مكرر)</option>
                  <option value="royal-gold">Royal Gold Thick Filigree (ملكي ذهبي عريض)</option>
                  <option value="emerald-ornamental">Babylonian Emerald & Gold (زمردي وبابلي عريق)</option>
                  <option value="baghdad-classic">Baghdad Bureau Vintage Border (مكتب بغداد كلاسيك)</option>
                </select>
              </div>

              {/* Seal color */}
              <div>
                <label className="block text-[10px] text-stone-500 uppercase mb-1">Embossed Ink Stamp Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "gold", hex: "bg-amber-600 border-amber-400" },
                    { id: "red", hex: "bg-red-800 border-red-500" },
                    { id: "green", hex: "bg-emerald-800 border-emerald-500" },
                    { id: "bronze", hex: "bg-stone-600 border-stone-400" }
                  ].map((colorOpt) => (
                    <button
                      key={colorOpt.id}
                      type="button"
                      onClick={() => onChange({ sealColor: colorOpt.id as any })}
                      className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded text-[10px] border cursor-pointer capitalize font-bold ${certificate.sealColor === colorOpt.id ? `${colorOpt.hex} text-white` : "bg-stone-950 border-stone-800 text-stone-400"}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${colorOpt.hex.split(" ")[0]}`} />
                      {colorOpt.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-2 pt-1.5 text-center">
                <button
                  type="button"
                  onClick={() => onChange({ showStamp: !certificate.showStamp })}
                  className={`py-1.5 rounded text-[9.5px] font-bold border ${certificate.showStamp ? "bg-amber-500/10 border-amber-500 text-amber-450" : "bg-stone-950 border-transparent text-stone-500"}`}
                >
                  Stamp Seal: {certificate.showStamp ? "ON" : "OFF"}
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ showSignature: !certificate.showSignature })}
                  className={`py-1.5 rounded text-[9.5px] font-bold border ${certificate.showSignature ? "bg-amber-500/10 border-amber-500 text-amber-450" : "bg-stone-950 border-transparent text-stone-500"}`}
                >
                  Signature: {certificate.showSignature ? "ON" : "OFF"}
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ showWatermark: !certificate.showWatermark })}
                  className={`py-1.5 rounded text-[9.5px] font-bold border ${certificate.showWatermark ? "bg-amber-500/10 border-amber-500 text-amber-450" : "bg-stone-950 border-transparent text-stone-500"}`}
                >
                  Watermark: {certificate.showWatermark ? "ON" : "OFF"}
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
