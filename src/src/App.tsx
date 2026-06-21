/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { TrademarkCertificate } from "./types";
import { CertificatePreview } from "./components/CertificatePreview";
import { 
  getStoredCertificates, 
  registerNewTrademark, 
  queryTrademarkDatabase,
  helperAutoTranslateBrand,
  helperAutoGenerateProprietor
} from "./utils";
import {
  saveTrademarkToFirebase,
  fetchTrademarksFromFirebase,
  fetchTrademarkByCertificateNumber
} from "./firebase";
import { NICE_CLASSES } from "./niceClasses";
import { 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  Printer, 
  Copy, 
  CheckCircle2, 
  Info, 
  Globe, 
  History, 
  FileCheck, 
  Upload, 
  Sparkles,
  RefreshCw,
  BookOpen,
  Share2,
  Lock,
  Unlock,
  Building,
  Sun,
  Moon,
  Scale,
  FileText,
  AlertTriangle
} from "lucide-react";

const IRAQ_IP_NEWS_DATA = [
  {
    id: 1,
    titleEn: "Baghdad Trademark Gazette Volume 2026 published for immediate opposition review and public audit",
    titleAr: "نشر جريدة العلامات التجارية البغدادية لعام ٢٠٢٦ لغرض التدقيق العام وفترة الاعتراض القانوني",
    date: "2026-06-18",
    badge: "Gazette",
    badgeAr: "الجريدة الرسمية"
  },
  {
    id: 2,
    titleEn: "Ministry of Trade activates unified electronic Single-Window submission portal for local companies",
    titleAr: "وزارة التجارة تفعل بوابة التقديم الإلكتروني الموحدة للشركات المحلية لتسريع معاملات تسجيل الملكية للصناعيين",
    date: "2026-06-15",
    badge: "System Update",
    badgeAr: "تحديث النظام"
  },
  {
    id: 3,
    titleEn: "Administrative Decree No. 427 enforces strict custom control & civil borders protection on active trademarks",
    titleAr: "صدور القرار الوزاري رقم ٤٢٧ بفرض إجراءات جمركية صارمة لحماية العلامات التجارية الموثقة والنشطة في الأسواق",
    date: "2026-06-10",
    badge: "Decree",
    badgeAr: "قرار وزاري"
  },
  {
    id: 4,
    titleEn: "Industrial Division registers 274 new domestic trade files aligned with international NICE guidelines",
    titleAr: "قسم الملكية الصناعية يسجل ٢٧٤ طلب حماية علامة جديدة متوافقة مع معايير تصنيف نيس الدولي للسلع والخدمات",
    date: "2026-06-02",
    badge: "Statistics",
    badgeAr: "إحصائيات"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"search" | "register" | "disputes">("search");
  const [uiLanguage, setUiLanguage] = useState<"en" | "ar">("en");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TrademarkCertificate[]>([]);
  
  // Currently highlighted trademark in search/verification list
  const [selectedCertificate, setSelectedCertificate] = useState<TrademarkCertificate | null>(null);

  // Certificate Layout Language Toggle state
  const [certLayoutMode, setCertLayoutMode] = useState<"bilingual" | "english" | "arabic">("bilingual");

  // Dispute form state for USPTO TTAB conflict reporting
  const [disputeForm, setDisputeForm] = useState({
    targetCertNumber: "",
    reporterName: "",
    reporterEmail: "",
    conflictingBrandName: "",
    reason: "Likelihood of Confusion / تداخل وتشابه العلامات",
    description: ""
  });
  
  // Create / Register state
  const [newTrademark, setNewTrademark] = useState<Partial<TrademarkCertificate>>({
    certificateType: "trademark",
    badgeType: "iraq-eagle",
    borderStyle: "double-gold",
    countryEn: "REPUBLIC OF IRAQ",
    countryAr: "جمهورية العراق",
    ministryEn: "MINISTRY OF INDUSTRY & MINERALS",
    ministryAr: "وزارة الصناعة والمعادن",
    departmentEn: "Industrial Property & Trademark Department",
    departmentAr: "قسم الملكية الصناعية ومسجل العلامات",
    documentTitleEn: "CERTIFICATE OF TRADEMARK REGISTRATION",
    documentTitleAr: "شهادة تســجيل علامة فارقة",
    legalActEn: "Under Law No. 21 of 1957 on Trademarks and Descriptions",
    legalActAr: "صادرة بمقتضى أحكام قانون العلامات والبيانات التجارية رقم ٢١ لسنة ١٩٥٧",
    trademarkNameEn: "",
    trademarkNameAr: "",
    trademarkType: "Word & Device (Logo) / لفظي ورسمي",
    applicationNumber: "",
    certificateNumber: "",
    classNumber: "Class 35 (Advertising & Office Functions)",
    priorityData: "None / لا يوجد",
    proprietorNameEn: "",
    proprietorNameAr: "",
    proprietorAddressEn: "",
    proprietorAddressAr: "",
    goodsServicesEn: "General Commercial trading, retail services, and import-export operations.",
    goodsServicesAr: "الخدمات التجارية العامة، البيع بالتجزئة، وعمليات الاستيراد والتصدير.",
    registrarPositionEn: "Registrar of Trademarks, Baghdad",
    registrarPositionAr: "مسـجل العلامات الفارقـة، بغداد",
    registrarNameEn: "Dr. Haidar Al-Rubaie",
    registrarNameAr: "الدكتور حيدر الربيعي",
    sealColor: "gold",
    sealStyle: "classic-star",
    showStamp: true,
    showSignature: true,
    showWatermark: true,
    signatureStyle: "great-vibes",
    presetLogoId: "mesopotamia-palm-shield",
    status: "REGISTERED",
    statusAr: "سجل نظامي رسمي - نشطة",
  });

  const [uploadedLogo, setUploadedLogo] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRegSuccess, setShowRegSuccess] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Live database states
  const [dbVersion, setDbVersion] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isVerifyingRef, setIsVerifyingRef] = useState(false);

  // States to support security owner lockout of PDF Certificates
  const [ownedTrademarks, setOwnedTrademarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("owned_trademarks_list");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [lockPinInput, setLockPinInput] = useState("");
  const [pinUnlockOverride, setPinUnlockOverride] = useState<string | null>(null);
  const [certificateDetailTab, setCertificateDetailTab] = useState<"uspto" | "certificate">("uspto");
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "night">(() => {
    try {
      const saved = localStorage.getItem("iraq_theme_mode");
      return (saved === "light" || saved === "dark" || saved === "night") ? (saved as "light" | "dark" | "night") : "dark";
    } catch {
      return "dark";
    }
  });

  const loadAndSyncDatabase = async () => {
    setIsSyncing(true);
    try {
      const liveList = await fetchTrademarksFromFirebase();
      if (liveList && liveList.length > 0) {
        // Merge
        const stored = getStoredCertificates();
        const mergedMap = new Map<string, TrademarkCertificate>();
        stored.forEach(c => mergedMap.set(c.certificateNumber.toLowerCase().trim(), c));
        liveList.forEach(c => mergedMap.set(c.certificateNumber.toLowerCase().trim(), c));
        
        const mergedList = Array.from(mergedMap.values());
        localStorage.setItem("iraq_trademarks_db", JSON.stringify(mergedList));
        setDbVersion(prev => prev + 1);
      } else {
        // Firebase is empty, let's seed it with what we have locally!
        const stored = getStoredCertificates();
        for (const cert of stored) {
          await saveTrademarkToFirebase(cert);
        }
        console.log("Seeded database with initial trademarks.");
        setDbVersion(prev => prev + 1);
      }
    } catch (e) {
      console.error("Failed loadAndSyncDatabase:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Run database sync on startup
  useEffect(() => {
    loadAndSyncDatabase();
  }, []);

  // Load and search database on mount & query change
  useEffect(() => {
    const results = queryTrademarkDatabase(searchQuery);
    setSearchResults(results);
    
    // Auto-select exact matching serial/reg number or brand name if typed/searched
    const exactMatch = results.find(
      (c) => 
        c.certificateNumber.toLowerCase().trim() === searchQuery.toLowerCase().trim() ||
        c.applicationNumber.toLowerCase().trim() === searchQuery.toLowerCase().trim() ||
        c.trademarkNameEn.toLowerCase().trim() === searchQuery.toLowerCase().trim()
    );

    if (exactMatch) {
      setSelectedCertificate(exactMatch);
    } else if (selectedCertificate) {
      const liveCopy = results.find(r => r.certificateNumber === selectedCertificate.certificateNumber);
      if (liveCopy) {
        setSelectedCertificate(liveCopy);
      } else if (results.length > 0) {
        setSelectedCertificate(results[0]);
      }
    } else if (results.length > 0) {
      setSelectedCertificate(results[0]);
    }
  }, [searchQuery, activeTab, dbVersion]);

  // Handle Share Hash-Routing (Direct links from Facebook/Verify URLs)
  useEffect(() => {
    const parseHashRoute = async () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#verify=")) {
        const queryPart = hash.substring(1); // e.g. "verify=REG-1234&data=abcd..."
        let targetNum = "";
        let b64Data = "";

        if (queryPart.includes("&")) {
          try {
            const searchParams = new URLSearchParams(queryPart);
            targetNum = searchParams.get("verify") || "";
            b64Data = searchParams.get("data") || "";
          } catch (e) {
            console.error("Error parsing URL params:", e);
          }
        } else {
          targetNum = decodeURIComponent(queryPart.split("verify=")[1] || "");
        }

        let found: TrademarkCertificate | undefined;

        // Try decoding direct premium payload first if present
        if (b64Data) {
          try {
            // Fix URLSearchParams decoding issue where '+' is converted to space
            const normalizedB64 = b64Data.replace(/ /g, "+");
            const decodedStr = decodeURIComponent(atob(normalizedB64));
            const decodedCert = JSON.parse(decodedStr) as TrademarkCertificate;
            if (decodedCert && decodedCert.certificateNumber) {
              // Upsert automatically into receivers local storage registry
              found = registerNewTrademark(decodedCert);
              
              // Add to owned list to bypass passcode gate since they possess the premium link!
              if (found && !ownedTrademarks.includes(found.certificateNumber)) {
                const newOwnerList = [...ownedTrademarks, found.certificateNumber];
                setOwnedTrademarks(newOwnerList);
                localStorage.setItem("owned_trademarks_list", JSON.stringify(newOwnerList));
              }
            }
          } catch (err) {
            console.error("Failed to parse base64 validation parameters", err);
          }
        }

        if (!found && targetNum) {
          const dbs = getStoredCertificates();
          found = dbs.find(
            (c) => 
              c.certificateNumber.toLowerCase().trim() === targetNum.toLowerCase().trim() ||
              c.applicationNumber.toLowerCase().trim() === targetNum.toLowerCase().trim()
          );

          // If not found in the local list, query our real live Cloud Database in real-time!
          if (!found) {
            setIsVerifyingRef(true);
            try {
              const liveRecord = await fetchTrademarkByCertificateNumber(targetNum);
              if (liveRecord) {
                // Save it locally so it displays
                found = registerNewTrademark(liveRecord);
                setDbVersion(p => p + 1);
                triggerToast(`🔍 Online Record Found & Synced: ${liveRecord.trademarkNameEn}`);
              }
            } catch (err) {
              console.error("Error querying firebase directly for verify target", err);
            } finally {
              setIsVerifyingRef(false);
            }
          }
        }

        if (found) {
          // Since they navigated via direct verification url, bypass passcode lock for this session
          if (!ownedTrademarks.includes(found.certificateNumber)) {
            const newOwnerList = [...ownedTrademarks, found.certificateNumber];
            setOwnedTrademarks(newOwnerList);
            localStorage.setItem("owned_trademarks_list", JSON.stringify(newOwnerList));
          }
          setSelectedCertificate(found);
          setActiveTab("search");
          setSearchQuery(found.certificateNumber);
          triggerToast(`✨ Real-time Verified Link Loaded: ${found.trademarkNameEn}`);
        } else if (targetNum) {
          triggerToast(`❌ Trademark number ${targetNum} not found in the official database.`);
        }
      }
    };

    // Run custom async inside parseHashRoute callback safely
    parseHashRoute();

    const handleHashChange = () => {
      parseHashRoute();
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [ownedTrademarks]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper to copy verification link (Perfect for Facebook forms!)
  const getVerificationUrl = (cert: TrademarkCertificate) => {
    const baseURL = window.location.origin + window.location.pathname;
    return `${baseURL}#verify=${encodeURIComponent(cert.certificateNumber)}`;
  };

  const handleCopyLink = (cert: TrademarkCertificate) => {
    const url = getVerificationUrl(cert);
    navigator.clipboard.writeText(url).then(() => {
      triggerToast("✓ Link Copied! Perfect to add in Facebook form or messages.");
    }).catch(() => {
      triggerToast("Error copying link. Please copy URL bar manually.");
    });
  };

  // Pre-generate professional Trademark identifiers
  const injectAutoNumbers = () => {
    const randomSuffix = Math.floor(100000 + Math.random() * 899999);
    setNewTrademark((prev) => ({
      ...prev,
      applicationNumber: `IQ/TM/${new Date().getFullYear()}/${randomSuffix}`,
      certificateNumber: `REG-${randomSuffix}-A`
    }));
  };

  const handleAutoPilotFill = (brandName: string) => {
    if (!brandName) return;
    const trans = helperAutoTranslateBrand(brandName);
    const prop = helperAutoGenerateProprietor(trans.en, trans.ar);
    const randomSuffix = Math.floor(100000 + Math.random() * 899999);
    const appNum = newTrademark.applicationNumber || `IQ/TM/${new Date().getFullYear()}/${randomSuffix}`;
    const certNum = newTrademark.certificateNumber || `REG-${randomSuffix}-A`;

    // Automatically randomize and assign a Nice class and associated descriptions on auto-pilot
    const randomClassIndex = Math.floor(Math.random() * NICE_CLASSES.length);
    const selectedClass = NICE_CLASSES[randomClassIndex];
    const classStr = `Class ${selectedClass.number} (${selectedClass.nameEn})`;

    setNewTrademark((prev) => ({
      ...prev,
      trademarkNameEn: trans.en,
      trademarkNameAr: trans.ar,
      proprietorNameEn: prop.proprietorEn,
      proprietorNameAr: prop.proprietorAr,
      proprietorAddressEn: prop.addressEn,
      proprietorAddressAr: prop.addressAr,
      applicationNumber: appNum,
      certificateNumber: certNum,
      classNumber: classStr,
      goodsServicesEn: selectedClass.descriptionEn,
      goodsServicesAr: selectedClass.descriptionAr
    }));
    triggerToast("✨ Auto-pilot: Arabic-English translations, random Nice Class & serial IDs generated!");
  };

  // Process uploaded logo
  const handleLogoUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedLogo(e.target.result as string);
          triggerToast("✓ Custom logo uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Execute interactive registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrademark.trademarkNameEn || !newTrademark.trademarkNameAr) {
      alert("Please enter English and Arabic names for the mark.");
      return;
    }
    
    // Ensure numbers exist
    const finalAppNum = newTrademark.applicationNumber || `IQ/TM/${new Date().getFullYear()}/${Math.floor(100000 + Math.random() * 900000)}`;
    const finalCertNum = newTrademark.certificateNumber || `REG-${Math.floor(100000 + Math.random() * 900000)}-A`;

    // Process Date (Starting from 2020 onward with 10 years expiration)
    const randomYear = Math.floor(2020 + Math.random() * 6); // 2020 to 2025
    const randomMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
    const randomDay = String(Math.floor(1 + Math.random() * 28)).padStart(2, '0');
    
    const registrationDate = `${randomYear}-${randomMonth}-${randomDay}`;
    const expiryDate = `${randomYear + 10}-${randomMonth}-${randomDay}`; // Standard Iraqi 10 Year Protection

    const submitData: TrademarkCertificate = {
      ...(newTrademark as TrademarkCertificate),
      status: (newTrademark.status as "REGISTERED" | "PENDING") || "REGISTERED",
      statusAr: newTrademark.status === "REGISTERED" ? "سجل نظامي رسمي - نشطة" : "طلب قيد الفحص والمراجعة الرسمية",
      applicationNumber: finalAppNum,
      certificateNumber: finalCertNum,
      dateOfFiling: `${randomYear - 1}-${randomMonth}-${randomDay}`, // Filed slightly earlier
      dateOfRegistration: registrationDate,
      expiryDate: expiryDate,
      uploadedLogoUrl: uploadedLogo,
      qrCodeUrl: "", // Calculated below
      gazetteNumber: newTrademark.gazetteNumber || `Official Gazette No. 2026/${Math.floor(10 + Math.random() * 80)}`,
      isVerified: true
    };
    submitData.qrCodeUrl = getVerificationUrl(submitData);

    // Save to LocalStorage
    const saved = registerNewTrademark(submitData);
    
    // Save to Firestore Online Database (makes it a real, global registry!)
    saveTrademarkToFirebase(saved).then(() => {
      triggerToast("☁️ Synced successfully with Ministry Online Cloud Database!");
      setDbVersion(p => p + 1); // trigger refresh
    }).catch(err => {
      console.error("Firebase sync error on submit:", err);
    });
    
    // Add to owned list to bypass passcode gate
    const updatedOwned = [...ownedTrademarks, saved.certificateNumber];
    setOwnedTrademarks(updatedOwned);
    localStorage.setItem("owned_trademarks_list", JSON.stringify(updatedOwned));
    
    // Reset inputs
    setNewTrademark((prev) => ({
      ...prev,
      trademarkNameEn: "",
      trademarkNameAr: "",
      proprietorNameEn: "",
      proprietorNameAr: "",
      proprietorAddressEn: "",
      proprietorAddressAr: "",
    }));
    setUploadedLogo(undefined);

    // Show beautiful success dialog with direct shareable link
    const shareLink = getVerificationUrl(saved);
    setShowRegSuccess(shareLink);
    setSelectedCertificate(saved);
    setSearchQuery(saved.certificateNumber);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950 ${themeMode === "light" ? "bg-stone-50 text-stone-900" : "bg-stone-950 text-stone-100"}`} id="iraq-root-container">
      
      {/* ================= STICKY TOP APP BANNER ================= */}
      <header className={`no-print sticky top-0 z-50 py-3 px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b shadow-xl transition-colors ${themeMode === "light" ? "bg-white border-stone-200 text-stone-900" : "bg-stone-900 border-stone-800/85"}`} id="national-portal-header">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-800 text-stone-100 p-2 rounded-xl shadow-lg border border-emerald-600 transition-transform hover:rotate-3" id="national-seal-logo">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-display font-extrabold text-sm md:text-base tracking-widest ${themeMode === "light" ? "text-stone-900" : "text-stone-100"}`}>
                IRAQGOVTRADEMARK.ORG
              </h1>
              <span className="hidden md:inline-block bg-amber-500/10 border border-amber-505/40 text-amber-500 font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                OFFICIAL PORTAL
              </span>
            </div>
            <p className={`text-[10px] font-medium ${themeMode === "light" ? "text-stone-500" : "text-stone-400"}`}>
              National Intellectual Property Registry • مسجل العلامات والبيانات التجارية
            </p>
          </div>
        </div>

        {/* Global Statistics Indicators */}
        <div className={`hidden lg:flex items-center gap-6 text-[11px] font-mono border-l pl-6 ${themeMode === "light" ? "text-stone-500 border-stone-200" : "text-stone-400 border-stone-850"}`} id="stats-ribbon">
          <div>
            <span className="text-emerald-500 font-bold block">14,942 active</span>
            <span className={themeMode === "light" ? "text-stone-400" : "text-stone-500"}>TRADEMARKS</span>
          </div>
          <div>
            <span className="text-amber-500 font-bold block">154 classes</span>
            <span className={themeMode === "light" ? "text-stone-400" : "text-stone-500"}>INTERNATIONAL NICE</span>
          </div>
          <div>
            <span className="text-sky-500 font-bold block flex items-center gap-1.5 justify-end">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-450 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              LIVE DB
            </span>
            <span className={themeMode === "light" ? "text-stone-400" : "text-stone-500"}>ONLINE CONNECT</span>
          </div>
        </div>

        {/* Main Tab Switch Buttons & Language Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-3" id="portal-actions">
          {/* Theme Mode Toggle (White / Night Mode) */}
          <button
            type="button"
            onClick={() => {
              const nextMode = themeMode === "light" ? "dark" : "light";
              setThemeMode(nextMode);
              localStorage.setItem("iraq_theme_mode", nextMode);
              triggerToast(nextMode === "light" ? "☀️ Light Mode activated!" : "🌙 Dark/Night Mode activated!");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
              themeMode === "light" 
                ? "bg-amber-500 text-stone-950 border-amber-600 shadow-sm" 
                : "bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200"
            }`}
          >
            {themeMode === "light" ? (
              <>
                <Sun className="w-3.5 h-3.5 text-stone-950" />
                <span>☀️ White Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-500" />
                <span>🌙 Night Mode</span>
              </>
            )}
          </button>

          {/* Bilingual Selector */}
          <div className={`flex border p-2.5 rounded-xl text-[10px] font-black ${themeMode === "light" ? "bg-stone-100 border-stone-200" : "bg-stone-900 border-stone-800"}`} id="language-switcher">
            <button
              type="button"
              onClick={() => { setUiLanguage("en"); triggerToast("🇺🇸 Language: English Set"); }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${uiLanguage === "en" ? "bg-amber-500 text-stone-950" : themeMode === "light" ? "text-stone-500 hover:text-stone-700" : "text-stone-400 hover:text-stone-200"}`}
            >
              <span>EN</span>
            </button>
            <button
              type="button"
              onClick={() => { setUiLanguage("ar"); triggerToast("🇮🇶 تم تغيير لغة الموقع إلى العربية"); }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-serif ${uiLanguage === "ar" ? "bg-amber-500 text-stone-950" : themeMode === "light" ? "text-stone-500 hover:text-stone-700" : "text-stone-400 hover:text-stone-200"}`}
            >
              <span>العربية</span>
            </button>
          </div>

          <div className={`flex border p-2.5 rounded-xl ${themeMode === "light" ? "bg-stone-100 border-stone-200" : "bg-stone-900 border-stone-800"}`} id="menu-selector-portal">
            <button
              type="button"
              onClick={() => { setActiveTab("search"); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "search" ? "bg-amber-500 text-stone-950 shadow-md" : themeMode === "light" ? "text-stone-500 hover:text-stone-700" : "text-stone-400 hover:text-stone-200"}`}
            >
              <Search className="w-3.5 h-3.5" /> {uiLanguage === "ar" ? "البحث والتحقق" : "Option A: Search Portal"}
            </button>
            
            <button
              type="button"
              onClick={() => { setActiveTab("register"); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "register" ? "bg-amber-500 text-stone-950 shadow-md" : themeMode === "light" ? "text-stone-500 hover:text-stone-700" : "text-stone-400 hover:text-stone-200"}`}
            >
              <PlusCircle className="w-3.5 h-3.5" /> {uiLanguage === "ar" ? "طلب تسجيل علامة" : "Option B: Register Trademark"}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("disputes"); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "disputes" ? "bg-amber-500 text-stone-950 shadow-md" : themeMode === "light" ? "text-stone-500 hover:text-stone-700" : "text-stone-400 hover:text-stone-200"}`}
            >
              <Scale className="w-3.5 h-3.5" /> {uiLanguage === "ar" ? "تقديم اعتراض وقضية" : "Option C: Report Case"}
            </button>
          </div>
        </div>
      </header>

      {/* ================= APP PORTAL DESCRIPTION AND METRICS (No-print) ================= */}
      <section className={`no-print py-3.5 px-4 md:px-8 text-center text-xs border-b ${themeMode === "light" ? "bg-stone-100 border-stone-200 text-stone-700" : "bg-gradient-to-r from-emerald-950/20 via-stone-900 to-amber-950/10 border-stone-900 text-stone-300"}`} id="bengali-instruction-banner">
        <div className="max-w-4xl mx-auto leading-relaxed">
          {uiLanguage === "ar" ? (
            <span className="font-serif text-amber-300 text-sm">
              🇮🇶 <strong>مرحباً بكم في البوابة الإلكترونية للملكية الصناعية:</strong> منصة الاستعلام والتحقق الرسمية للعلامات التجارية الصادرة عن قسم العلامات والملكيات الفكرية في جمهورية العراق (<strong>iraqgovtrademark.org</strong>). تتيح لك المنصة البحث والتحقق من ملفات القضايا وتحميل شهادات الحماية الرسمية بحجم A4 كاملة دون اقتطاع.
            </span>
          ) : (
            <span className="text-stone-300 font-sans">
              🏛️ <strong>Intellectual Property Registry Division Gateway:</strong> The official case-file search and filing lookup gateway for the Ministry of Trade & Industry in the Republic of Iraq (<strong>iraqgovtrademark.org</strong>). Authenticate case parameters, track current examiners status (Registered / Pending), and generate print-perfect, full A4 legal certificates with zero-clipping guarantees.
            </span>
          )}
        </div>
      </section>

      {/* ================= MAIN DUAL VIEW SECTION ================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10" id="main-portal-content">
        
        {/* ================= STUNNING IRAQI NATIONAL IP GATEWAY HERO SECTION (No-print) ================= */}
        <div className={`no-print lg:col-span-12 p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden space-y-6 border transition-colors ${themeMode === "light" ? "bg-white border-stone-200 text-stone-900 shadow-stone-100" : "bg-stone-900/40 border-stone-800 shadow-2xl"}`} id="national-gateway-hero">
          {/* Subtle light leaks and glow ornaments */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-mono uppercase tracking-widest font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Federal IP Registry • Central Trade Database
              </div>
              <h2 className={`text-xl md:text-2xl font-display font-black tracking-tight leading-none uppercase ${themeMode === "light" ? "text-stone-900" : "text-stone-100"}`}>
                IRAQ INTELLECTUAL PROPERTY & TRADEMARK PORTAL
              </h2>
              <p className="text-xs text-amber-500 font-serif leading-relaxed" dir="rtl">
                جمهورية العراق • وزارة الصناعة والمعادن • قسم الملكية الصناعية ومسجل العلامات والبيانات التجارية
              </p>
              <p className={`text-[11px] ${themeMode === "light" ? "text-stone-605" : "text-stone-400"}`}>
                The centralized gateway for Iraqi trade protection, verification, lookup and legal filing. Search active Nice class registered assets and retrieve verified, high-resolution registration certificates instantly.
              </p>
            </div>

            {/* Ministry Golden Medalion Icon */}
            <div className={`w-16 h-16 border-2 p-3 rounded-full flex items-center justify-center shadow-lg relative shrink-0 ${themeMode === "light" ? "bg-stone-100 border-amber-500" : "bg-stone-950 border-amber-500"}`}>
              <span className="text-2xl text-amber-500 font-serif font-black animate-pulse">🇮🇶</span>
              <div className="absolute inset-0 rounded-full border border-stone-800 animate-spin-slow"></div>
            </div>
          </div>

          {/* FRONT ACTION NAV SWITCHES: "web sit er samne serch reg amn jeno thake" */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2" id="front-action-panels">
            <button
              type="button"
              onClick={() => { setActiveTab("search"); triggerToast("🔍 TESS Case File database directory focused."); }}
              className={`p-5 rounded-xl border text-left cursor-pointer transition-all ${
                activeTab === "search" 
                  ? "bg-amber-500/10 border-amber-500/60 shadow-lg" 
                  : themeMode === "light"
                    ? "bg-stone-50 border-stone-200 hover:border-stone-300 hover:bg-stone-100/65"
                    : "bg-stone-900 border-stone-800 hover:border-stone-700 hover:bg-stone-850"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg shrink-0 ${activeTab === "search" ? "bg-amber-500 text-stone-950" : themeMode === "light" ? "bg-stone-200 text-stone-700" : "bg-stone-950 text-stone-400"}`}>
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${themeMode === "light" ? "text-stone-800" : "text-stone-100"}`}>Option A: Search Intellectual Property Database (TESS)</h3>
                  <p className={`text-[10px] mt-0.5 leading-relaxed ${themeMode === "light" ? "text-stone-605" : "text-stone-400"}`}>
                    Search and verify brand registrations by serial ID, wordmark, or proprietor name details.
                  </p>
                  <span className="text-[10px] text-amber-500 font-bold block mt-2">البحث والاستعلام والتحقق الرقمي للعلامات الفعالة ←</span>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("register"); triggerToast("📋 Corporation brand register intakes focused."); }}
              className={`p-5 rounded-xl border text-left cursor-pointer transition-all ${
                activeTab === "register" 
                  ? "bg-amber-500/10 border-amber-500/60 shadow-lg" 
                  : themeMode === "light"
                    ? "bg-stone-50 border-stone-200 hover:border-stone-300 hover:bg-stone-100/65"
                    : "bg-stone-900 border-stone-800 hover:border-stone-700 hover:bg-stone-850"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg shrink-0 ${activeTab === "register" ? "bg-amber-500 text-stone-950" : themeMode === "light" ? "bg-stone-200 text-stone-700" : "bg-stone-950 text-stone-400"}`}>
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${themeMode === "light" ? "text-stone-800" : "text-stone-100"}`}>Option B: Request New Trademark Registration (Intake)</h3>
                  <p className={`text-[10px] mt-0.5 leading-relaxed ${themeMode === "light" ? "text-stone-605" : "text-stone-400"}`}>
                    Log new mark specifications, upload brand devices (logos) and trigger automated Nice terms classification.
                  </p>
                  <span className="text-[10px] text-amber-500 font-bold block mt-2">تقديم طلب تسجيل وحماية علامة جديدة فورياً علـى النظام ←</span>
                </div>
              </div>
            </button>
          </div>

          {/* DYNAMIC IRAQ NEWS & AUTOMATED GAZETTE UPDATE SUBSECTION */}
          <div className="bg-stone-905/85 p-4 rounded-xl border border-stone-800" id="bulletin-news-marquee">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-stone-800/80 text-xs text-stone-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 font-bold text-stone-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Ministry Gazette Notice Board & Auto Bulletins Feed
              </span>
              <span className="text-[10px] font-mono text-stone-500">Status: SYNCED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {IRAQ_IP_NEWS_DATA.map((article) => (
                <div key={article.id} className="p-2.5 bg-stone-900/50 rounded-lg border border-stone-800 flex items-start gap-3 hover:bg-stone-900 transition-colors">
                  <span className="bg-stone-950 px-2 py-0.5 h-fit text-stone-400 text-[9px] border border-stone-800 font-mono rounded select-none uppercase font-bold text-center shrink-0">
                    {article.badge}
                  </span>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-stone-500 block leading-none">{article.date} | Bureau Baghdad</span>
                    <p className="text-[11px] font-semibold text-stone-200 leading-snug">
                      {article.titleEn}
                    </p>
                    <p className="text-[10px] font-serif text-stone-400 text-right leading-relaxed mt-0.5" dir="rtl">
                      {article.titleAr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= OPTION A: SEARCH PORTAL VIEW ================= */}
        {activeTab === "search" && (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8" id="search-layout">
            
            {/* Search list inputs and matching database records (Left Side) */}
            <div className="no-print lg:col-span-4 space-y-4" id="search-controls-sidebar">
              <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl shadow-lg space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                  <div className="flex items-center gap-1.5 text-stone-200 font-bold text-xs uppercase tracking-wider">
                    <History className="w-4 h-4 text-amber-500" /> Live Database Search
                  </div>
                  <span className="bg-stone-950 text-stone-500 font-mono text-[9px] px-1.5 py-0.5 rounded uppercase font-bold border border-stone-800">
                    TESS / TSDR ENGINE
                  </span>
                </div>

                <p className="text-[11px] text-stone-400 leading-normal">
                  Enter Trademark Name, Application Number, registration ID, or Owner Name. Newly registered brands will appear instantly.
                </p>

                {/* Main Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search database... (e.g., Al-Hilal)"
                    className="w-full pl-9 pr-4 py-2 bg-stone-950 border border-stone-800 text-white rounded-lg text-xs font-medium focus:outline-none focus:border-amber-500 placeholder-stone-600 transition-colors"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")} 
                      className="absolute right-2 px-1.5 py-1 text-[9px] bg-stone-800 hover:bg-stone-750 text-stone-400 rounded top-2 cursor-pointer font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Match counter state */}
                <div className="flex justify-between items-center text-[10px] text-stone-500 font-mono">
                  <span>Matched Results: <strong>{searchResults.length}</strong></span>
                  <span>Source: Iraq Central Registry</span>
                </div>
              </div>

              {/* SEARCH RESULTS LIST */}
              <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg" id="search-results-viewport">
                <div className="bg-stone-950/60 py-2.5 px-4 border-b border-stone-800 text-[10.5px] font-bold text-stone-400 flex justify-between items-center">
                  <span>REGISTRATION RECORDS LIST</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">🟢 Database Online</span>
                </div>

                <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-800/60" id="search-list-box">
                  {searchResults.length === 0 ? (
                    <div className="p-8 text-center text-stone-500 space-y-2">
                      <BookOpen className="w-8 h-8 mx-auto stroke-1" />
                      <p className="text-xs">No matching trademark registrations found in Iraq database.</p>
                      <button 
                        type="button"
                        onClick={() => { setActiveTab("register"); }}
                        className="text-[11px] text-amber-500 underline font-semibold cursor-pointer block mx-auto"
                      >
                        Register this Trademark Now →
                      </button>
                    </div>
                  ) : (
                    searchResults.map((cert) => {
                      const isSelected = selectedCertificate?.certificateNumber === cert.certificateNumber;
                      return (
                        <button
                          type="button"
                          key={cert.certificateNumber}
                          onClick={() => { setSelectedCertificate(cert); setCertificateDetailTab("uspto"); }}
                          className={`w-full text-left p-3.5 transition-all block relative cursor-pointer ${isSelected ? "bg-amber-500/10 border-l-4 border-amber-500" : "hover:bg-stone-800/60"}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-display font-semibold text-xs text-stone-200 uppercase tracking-tight">{cert.trademarkNameEn}</span>
                                {cert.isVerified && <span className="text-emerald-500 text-[10px] font-bold" title="Verified active entry">✓ Verified</span>}
                              </div>
                              <span className="text-[10px] text-stone-500 block font-mono mt-0.5">Reg: {cert.certificateNumber} | {cert.classNumber.split(" ")[0]}</span>
                            </div>
                            <span className="bg-emerald-950 text-emerald-400 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border border-emerald-900/60 shrink-0">
                              Active
                            </span>
                          </div>

                          <div className="mt-2.5 flex justify-between items-center text-[10px]">
                            <span className="text-stone-400 italic w-4/5 truncate">Owner: {cert.proprietorNameEn}</span>
                            <span className="text-amber-500 font-bold bg-amber-500/5 px-1 py-0.5 rounded shrink-0">{cert.dateOfRegistration ? cert.dateOfRegistration.split("-")[0] : ""}</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Informative Help Card */}
              <div className="bg-stone-900/40 border border-stone-805 p-3.5 rounded-xl text-[11px] text-stone-400 space-y-2">
                <div className="flex items-center gap-1.5 text-stone-200 font-bold">
                  <Info className="w-3.5 h-3.5 text-amber-500" /> Shareable Online Mock-up
                </div>
                <p className="leading-relaxed">
                  Anyone can check live entries inside this database. All newly created trademarks are stored in client-side persistence and are deep-linked dynamically when clicking shared URLs.
                </p>
              </div>
            </div>

            {/* Comprehensive Trademark TSDR Status & Printable Certificate Presentation (Right Side) */}
            <div className="lg:col-span-8 flex flex-col items-center justify-start min-h-[600px] border-l border-stone-900/50 pl-0 lg:pl-6" id="digital-certificate-workspace">
              {selectedCertificate ? (
                <div className="w-full space-y-6" id="verification-results-screen">
                  
                  {/* DUAL WORKSPACE SUBTABS FOR COMPLIANT TAB SELECTION */}
                  <div className="no-print flex bg-stone-905 border border-stone-800 p-1 rounded-xl w-full" id="details-subtabs-controller">
                    <button
                      type="button"
                      onClick={() => setCertificateDetailTab("uspto")}
                      className={`flex-1 py-2 px-4 text-center text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group ${
                        certificateDetailTab === "uspto" 
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md font-extrabold" 
                          : "text-stone-400 hover:text-stone-200 hover:bg-stone-850/40"
                      }`}
                    >
                      <Building className="w-3.5 h-3.5" /> 🇺🇸 USPTO TSDR Case Sheet
                    </button>
                    <button
                      type="button"
                      onClick={() => setCertificateDetailTab("certificate")}
                      className={`flex-1 py-2 px-4 text-center text-xs font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group ${
                        certificateDetailTab === "certificate" 
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-stone-950 shadow-md font-extrabold" 
                          : "text-stone-400 hover:text-stone-200 hover:bg-stone-850/40"
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" /> 🔒 Official A4 Certificate
                    </button>
                  </div>

                  {/* TAB 1: USPTO STYLE DATABASE CASE SHEET */}
                  {certificateDetailTab === "uspto" && (
                    <div className="space-y-6 animate-fadeIn" id="uspto-tsdr-tab-panel">
                      
                      {/* Dynamic TSDR Status Sheet Header */}
                      <div className="no-print bg-stone-900 border border-stone-800 p-4 rounded-xl shadow-lg space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-stone-800">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h2 className="text-sm font-black text-stone-100 flex items-center gap-2 uppercase font-mono tracking-wider">
                                <FileCheck className="w-4.5 h-4.5 text-emerald-500" /> USPTO-COMPLIANT TSDR CASE FILE
                              </h2>
                              <span className="bg-stone-950 font-bold text-[9px] text-stone-400 font-mono px-2 py-0.5 rounded border border-stone-800">
                                STATUS: ACTIVE REGISTERED
                              </span>
                            </div>
                            <p className="text-[10px] text-stone-500 mt-0.5 font-sans">Federal Intellectual Property Database Verification Terminal • Baghdad-DC Synced</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyLink(selectedCertificate)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 font-extrabold text-[11px] text-white rounded-lg transition-all cursor-pointer shadow-md shrink-0 border-t border-emerald-500/20"
                          >
                            <Share2 className="w-3.5 h-3.5" /> Copy Shareable URL
                          </button>
                        </div>

                        {/* Top quick state metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div className="p-2.5 rounded bg-stone-950/45 border border-stone-800">
                            <span className="text-stone-500 text-[9px] uppercase font-mono block">Current Status</span>
                            <span className="text-emerald-400 font-bold block mt-0.5">{selectedCertificate.status === "PENDING" ? "PENDING CASE" : "LIVE / REGISTERED"}</span>
                            <span className="text-[9px] text-stone-500 block">حمـاية فـعالة مسـجلة</span>
                          </div>
                          
                          <div className="p-2.5 rounded bg-stone-950/45 border border-stone-800">
                            <span className="text-stone-500 text-[9px] uppercase font-mono block">Registry Nice Class</span>
                            <span className="text-amber-500 font-bold block mt-0.5 truncate">{selectedCertificate.classNumber.split(" ")[0]}</span>
                            <span className="text-[9px] text-stone-500 block">International Class</span>
                          </div>

                          <div className="p-2.5 rounded bg-stone-950/45 border border-stone-800">
                            <span className="text-stone-500 text-[9px] uppercase font-mono block">Serial Application No</span>
                            <span className="text-stone-200 font-bold block mt-0.5 font-mono truncate">{selectedCertificate.applicationNumber}</span>
                            <span className="text-[9px] text-stone-500 block">IQ Central ID</span>
                          </div>

                          <div className="p-2.5 rounded bg-stone-950/45 border border-stone-800">
                            <span className="text-stone-500 text-[9px] uppercase font-mono block">Filing / Pub Date</span>
                            <span className="text-stone-200 font-bold block mt-0.5 font-mono truncate">{selectedCertificate.dateOfFiling}</span>
                            <span className="text-[9px] text-stone-500 block">Gazette Synced</span>
                          </div>
                        </div>
                      </div>

                      {/* DETAILED TESS / USPTO SPECIFICATION GRID SHEET - SIMILAR TO USPTO 74034647 */}
                      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6" id="uspto-specification-sheet">
                        <div className="flex flex-col md:flex-row gap-6 justify-between items-start border-b border-stone-800 pb-5">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest">TSDR Trademark Search Document Retrieval</span>
                            <h3 className="text-base font-black text-stone-100 uppercase tracking-tight">
                              Case Parameters for Mark: "{selectedCertificate.trademarkNameEn}"
                            </h3>
                            <p className="text-[10.5px] text-stone-400 leading-relaxed font-serif animate-pulse" dir="rtl">
                              تفاصيل السجل لرمز القضية المستعلم عنها رقم: {selectedCertificate.applicationNumber}
                            </p>
                          </div>

                          {/* Live Verification Badge with Golden Circular Borders */}
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-900 rounded-xl text-emerald-450 font-bold text-[10px] uppercase font-mono tracking-wider shrink-0 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            🟢 Record Synced & Live
                          </div>
                        </div>

                        {/* USPTO TABULAR KEY-VALUE ROWS */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          <div className="lg:col-span-8 overflow-hidden rounded-xl border border-stone-800 bg-stone-950/30 text-xs shadow-inner">
                            <div className="grid grid-cols-1 divide-y divide-stone-800">
                              
                              {/* Row: Word Mark */}
                              <div className="grid grid-cols-4 md:grid-cols-12 items-center">
                                <div className="col-span-4 md:col-span-3 bg-stone-950/60 p-3 font-semibold text-stone-400 font-mono text-[10.5px] uppercase tracking-wider border-r border-stone-800 min-h-[44px] flex items-center">
                                  Word Mark
                                </div>
                                <div className="col-span-4 md:col-span-9 p-3 font-extrabold text-stone-100 font-mono text-sm tracking-tight uppercase flex items-center">
                                  {selectedCertificate.trademarkNameEn}
                                </div>
                              </div>

                              {/* Row: Translations */}
                              <div className="grid grid-cols-4 md:grid-cols-12 items-center">
                                <div className="col-span-4 md:col-span-3 bg-stone-950/60 p-3 font-semibold text-stone-400 font-mono text-[10.5px] uppercase tracking-wider border-r border-stone-800 min-h-[44px] flex items-center">
                                  Translations
                                </div>
                                <div className="col-span-4 md:col-span-9 p-3 text-stone-300 leading-relaxed text-[11px] font-sans">
                                  The Word Mark <strong className="text-amber-500">"{selectedCertificate.trademarkNameEn.toUpperCase()}"</strong> transliterates directly into Arabic as <strong className="text-amber-500 font-serif text-xs">"{selectedCertificate.trademarkNameAr}"</strong> according to the Baghdad Registry records of Republic of Iraq. No other specific translation is claimed.
                                </div>
                              </div>

                              {/* Row: Goods & Services */}
                              <div className="grid grid-cols-4 md:grid-cols-12 items-center">
                                <div className="col-span-4 md:col-span-3 bg-stone-950/60 p-3 font-semibold text-stone-400 font-mono text-[10.5px] uppercase tracking-wider border-r border-stone-800 min-h-[44px] flex items-center">
                                  Goods & Services
                                </div>
                                <div className="col-span-4 md:col-span-9 p-3 text-stone-300 leading-relaxed font-sans text-xs">
                                  <span className="text-amber-500 font-bold block mb-1">{selectedCertificate.classNumber}</span>
                                  {selectedCertificate.goodsServicesEn}
                                  <span className="text-[10.5px] text-stone-400 block italic mt-1 pb-1 font-serif text-right" dir="rtl">
                                    {selectedCertificate.goodsServicesAr}
                                  </span>
                                </div>
                              </div>

                              {/* Row: Mark Drawing Code */}
                              <div className="grid grid-cols-4 md:grid-cols-12 items-center">
                                <div className="col-span-4 md:col-span-3 bg-stone-950/60 p-3 font-semibold text-stone-400 font-mono text-[10.5px] uppercase tracking-wider border-r border-stone-800 min-h-[44px] flex items-center">
                                  Drawing Code
                                </div>
                                <div className="col-span-4 md:col-span-9 p-3 text-stone-250 font-mono text-[11px] flex items-center gap-1.5 font-bold">
                                  <span>(3) STYLIZED DESIGN / DEVICE MARK</span>
                                  <span className="text-[10px] text-stone-500 font-normal font-sans">(The mark consists of stylized typography containing the custom brand emblem element)</span>
                                </div>
                              </div>

                              {/* Row: Serial Number */}
                              <div className="grid grid-cols-4 md:grid-cols-12 items-center">
                                <div className="col-span-4 md:col-span-3 bg-stone-950/60 p-3 font-semibold text-stone-400 font-mono text-[10.5px] uppercase tracking-wider border-r border-stone-800 min-h-[44px] flex items-center">
                                  Serial Number
                                </div>
                                <div className="col-span-4 md:col-span-9 p-3 font-mono text-stone-200 font-extrabold text-[12.5px] tracking-wider select-all">
                                  {selectedCertificate.applicationNumber}
                                </div>
                              </div>

                              {/* Row: Filing Date */}
                              <div className="grid grid-cols-4 md:grid-cols-12 items-center">
                                <div className="col-span-4 md:col-span-3 bg-stone-950/60 p-3 font-semibold text-stone-400 font-mono text-[10.5px] uppercase tracking-wider border-r border-stone-800 min-h-[44px] flex items-center">
                                  Filing Date
                                </div>
                                <div className="col-span-4 md:col-span-9 p-3 font-mono text-stone-300">
                                  {selectedCertificate.dateOfFiling}
                                </div>
                              </div>

                              {/* Row: Registration Number */}
                              <div className="grid grid-cols-4 md:grid-cols-12 items-center">
                                <div className="col-span-4 md:col-span-3 bg-stone-950/60 p-3 font-semibold text-stone-400 font-mono text-[10.5px] uppercase tracking-wider border-r border-stone-800 min-h-[44px] flex items-center">
                                  Registration No.
                                </div>
                                <div className="col-span-4 md:col-span-9 p-3 font-mono text-stone-250 font-bold tracking-wider select-all">
                                  {selectedCertificate.certificateNumber}
                                </div>
                              </div>

                              {/* Row: Registration Date */}
                              <div className="grid grid-cols-4 md:grid-cols-12 items-center">
                                <div className="col-span-4 md:col-span-3 bg-stone-950/60 p-3 font-semibold text-stone-400 font-mono text-[10.5px] uppercase tracking-wider border-r border-stone-800 min-h-[44px] flex items-center">
                                  Registration Date
                                </div>
                                <div className="col-span-4 md:col-span-9 p-3 font-mono text-stone-300 font-bold font-sans">
                                  {selectedCertificate.dateOfRegistration}
                                </div>
                              </div>

                              {/* Row: Owner */}
                              <div className="grid grid-cols-4 md:grid-cols-12 items-center">
                                <div className="col-span-4 md:col-span-3 bg-stone-950/60 p-3 font-semibold text-stone-400 font-mono text-[10.5px] uppercase tracking-wider border-r border-stone-800 min-h-[44px] flex items-center">
                                  Registrant / Owner
                                </div>
                                <div className="col-span-4 md:col-span-9 p-3 text-stone-200 space-y-1">
                                  <strong className="block text-stone-100 font-bold uppercase">{selectedCertificate.proprietorNameEn}</strong>
                                  <span className="block text-[11px] text-stone-400 font-serif text-right" dir="rtl">{selectedCertificate.proprietorNameAr}</span>
                                  <span className="block text-[11px] text-stone-400 leading-relaxed">{selectedCertificate.proprietorAddressEn}</span>
                                  <span className="block text-[10px] text-stone-500 font-serif leading-none mt-1" dir="rtl">{selectedCertificate.proprietorAddressAr}</span>
                                </div>
                              </div>

                              {/* Row: Attorney of Record */}
                              <div className="grid grid-cols-4 md:grid-cols-12 items-center">
                                <div className="col-span-4 md:col-span-3 bg-stone-950/60 p-3 font-semibold text-stone-400 font-mono text-[10.5px] uppercase tracking-wider border-r border-stone-800 min-h-[44px] flex items-center">
                                  Attorney / Admin
                                </div>
                                <div className="col-span-4 md:col-span-9 p-3 font-sans text-stone-300 font-bold">
                                  {selectedCertificate.registrarNameEn} / Baghdad Legal Division Group
                                </div>
                              </div>

                              {/* Row: Register Option */}
                              <div className="grid grid-cols-4 md:grid-cols-12 items-center">
                                <div className="col-span-4 md:col-span-3 bg-stone-950/60 p-3 font-semibold text-stone-400 font-mono text-[10.5px] uppercase tracking-wider border-r border-stone-800 min-h-[44px] flex items-center">
                                  Register Type
                                </div>
                                <div className="col-span-4 md:col-span-9 p-3 text-stone-300 font-mono uppercase font-semibold">
                                  PRINCIPAL REGISTER OF REPUBLIC OF IRAQ
                                </div>
                              </div>

                              {/* Row: Live Indicator */}
                              <div className="grid grid-cols-4 md:grid-cols-12 items-center">
                                <div className="col-span-4 md:col-span-3 bg-stone-950/60 p-3 font-semibold text-stone-400 font-mono text-[10.5px] uppercase tracking-wider border-r border-stone-800 min-h-[44px] flex items-center">
                                  Status Indicator
                                </div>
                                <div className="col-span-4 md:col-span-9 p-3 text-emerald-400 font-bold font-mono tracking-wider text-[11.5px] flex items-center gap-1">
                                  {selectedCertificate.status === "PENDING" ? "🔴 UNDER ADVERSE REVIEW / PENDING" : "🟢 LIVE / ACTIVE REGISTERED"}
                                </div>
                              </div>

                              {/* Row: TTAB Oppositions & Adversors */}
                              <div className="grid grid-cols-4 md:grid-cols-12 items-start">
                                <div className="col-span-4 md:col-span-3 bg-stone-950/60 p-3 font-semibold text-stone-400 font-mono text-[10.5px] uppercase tracking-wider border-r border-stone-800 min-h-[54px] flex items-center">
                                  TTAB Adverse Oppositions
                                </div>
                                <div className="col-span-4 md:col-span-9 p-3 space-y-3">
                                  {!selectedCertificate.oppositions || selectedCertificate.oppositions.length === 0 ? (
                                    <div className="text-stone-500 italic text-[11px] font-sans">
                                      No active third-party opposition claims, reports, or legal disputes filed against this trademark registry.
                                    </div>
                                  ) : (
                                    <div className="space-y-2.5">
                                      {selectedCertificate.oppositions.map((op) => (
                                        <div key={op.id} className="p-2.5 rounded bg-red-950/20 border border-red-900/40 text-left space-y-1">
                                          <div className="flex items-center justify-between">
                                            <span className="font-mono text-[10px] text-red-400 font-bold uppercase">
                                              ⚖️ Opposition Case No: {op.id}
                                            </span>
                                            <span className="bg-red-500/20 text-red-350 border border-red-500/30 font-mono text-[8px] font-bold px-1.5 py-0.2 rounded">
                                              STATUS: {op.statusOfOpposition.replace(/_/g, " ")}
                                            </span>
                                          </div>
                                          <div className="text-[11px] text-stone-300">
                                            Filed by: <strong className="text-amber-500">{op.reporterName}</strong> ({op.reporterEmail}) on <span className="text-stone-400 font-mono">{op.dateFiled}</span>
                                          </div>
                                          <div className="text-[11px] text-stone-300">
                                            Claimed Brand overlap: <span className="text-red-400 font-black tracking-wide">{op.conflictingBrandName.toUpperCase()}</span>
                                          </div>
                                          <div className="text-[11px] text-stone-400 leading-normal italic bg-stone-950/40 p-2 rounded border border-stone-900">
                                            "Ground of Appeal: {op.reason} • Detail: {op.description}"
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div className="pt-1 select-none">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDisputeForm({
                                          ...disputeForm,
                                          targetCertNumber: selectedCertificate.certificateNumber
                                        });
                                        setActiveTab("disputes");
                                        triggerToast("⚖️ TTAB Dispute Center loaded for target trademark " + selectedCertificate.trademarkNameEn);
                                      }}
                                      className="text-[10px] text-amber-500 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                      ⚖️ Submit Infringement Claim or File Dispute Against This Mark →
                                    </button>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>

                          {/* RIGHT SIDEBAR PANEL: VERIFICATION SCANNABLE QR CODE & DEVICE LOGO DISPLAY */}
                          <div className="lg:col-span-4 space-y-4 w-full">
                            
                            {/* BRAND DEVICE LOGO MOCKUP */}
                            <div className="bg-stone-950/40 border border-stone-800 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
                              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest font-bold">Registered Mark Device</span>
                              <div className="w-28 h-28 bg-stone-955 border border-stone-800 rounded-lg flex items-center justify-center p-2 relative overflow-hidden bg-gradient-to-br from-stone-900 to-stone-950">
                                {selectedCertificate.uploadedLogoUrl ? (
                                  <img 
                                    src={selectedCertificate.uploadedLogoUrl} 
                                    alt="Brand Logo Device" 
                                    className="max-h-full max-w-full object-contain filter relative z-10 animate-fade-in"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="text-center font-bold text-stone-300 font-display text-sm tracking-widest leading-none select-none uppercase">
                                    {selectedCertificate.trademarkNameEn.split(" ")[0]}
                                  </div>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-400 italic mt-1 font-mono tracking-wide">
                                Type: {selectedCertificate.trademarkType || "Word & Device"}
                              </span>
                            </div>

                            {/* DYNAMIC SCANNABLE ONLINE QR VERIFICATION BOX - REAL DIGITAL LINK */}
                            <div className="bg-stone-950/80 border-2 border-dashed border-stone-800 p-4 rounded-xl flex flex-col items-center text-center space-y-3 shadow-inner" id="scannable-verification-badge-case">
                              <div className="bg-white p-2.5 rounded-lg inline-block shadow-lg hover:scale-105 transition-transform pointer-events-auto">
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=000000&data=${encodeURIComponent(
                                    selectedCertificate.qrCodeUrl || "https://iraqgovtrademark.org#verify=" + selectedCertificate.certificateNumber
                                  )}`}
                                  alt="Verified Live Register Verification Link"
                                  className="w-28 h-28"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-amber-500 font-black block uppercase tracking-widest">OFFICIAL QR VERIFICATION</span>
                                <p className="text-[9.5px] text-stone-400 leading-normal font-sans">
                                  Scan this QR Code on any device to pull up the official TESS profile page instantly. Great for verification in external systems and official forms!
                                </p>
                              </div>
                            </div>

                            {/* EXAMINER MILESTONES REVIEW PANEL */}
                            <div className="p-3.5 bg-stone-900/60 rounded-xl border border-stone-800 text-[10px] text-stone-400 space-y-2">
                              <span className="text-stone-300 font-bold block uppercase tracking-wide">Official Gazettes & Seal Registry</span>
                              <p className="leading-relaxed">
                                Seal Style: <strong className="text-stone-200">{selectedCertificate.sealStyle.toUpperCase()} ({selectedCertificate.sealColor.toUpperCase()})</strong> <br/>
                                Gazette Issue: <strong className="text-stone-200">{selectedCertificate.gazetteNumber}</strong> <br/>
                                Official Term: 10 Years from Registration (Good until {selectedCertificate.expiryDate})
                              </p>
                            </div>

                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* TAB 2: SECURE OFFICIAL A4 CERTIFICATE (AUTHORIZED RESTRICTED VIEW) */}
                  {certificateDetailTab === "certificate" && (
                    <div className="space-y-6 animate-fadeIn" id="secure-cert-tab-panel">
                      
                      {/* Check if current user owns isOwner, else show lock gate */}
                      {(() => {
                        const isOwner = ownedTrademarks.includes(selectedCertificate.certificateNumber) || 
                                        pinUnlockOverride === selectedCertificate.certificateNumber;
                        
                        if (isOwner) {
                          return (
                            <>
                              {/* PDF / Printing action controls */}
                              <div className="bg-stone-950/60 p-4 rounded-lg border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-300 no-print" id="print-controls-bar">
                                <div className="flex items-center gap-2">
                                  <Unlock className="w-4 h-4 text-emerald-400 shrink-0" />
                                  <span className="font-semibold text-stone-200">Official Document Authenticated: Standard A4 printable registration certificate unlocked.</span>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => { window.print(); }}
                                  className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-stone-950 font-extrabold rounded-xl cursor-pointer text-xs select-none transition-all w-full sm:w-auto justify-center shadow-lg shadow-amber-500/10 animate-pulse"
                                >
                                  <Printer className="w-4 h-4" /> Print / Save Single A4 PDF
                                </button>
                              </div>

                              {/* Beautiful interactive toggle for Certificate Layout Language (Iraq / English version options) */}
                              <div className="no-print bg-stone-950/40 p-3.5 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
                                <div className="text-left">
                                  <span className="text-[10px] font-mono text-amber-500 font-bold block uppercase tracking-widest">Certificate Layout Language Option (ইংরেজি/ইরাকি ভার্সন ২টা অপশন)</span>
                                  <p className="text-[11px] text-stone-400">Select whether to display the English version, Arabic/Iraq version, or original Bilingual certificate.</p>
                                </div>
                                
                                <div className="flex bg-stone-900 border border-stone-800 p-1 rounded-lg text-[10px] font-bold shrink-0">
                                  {[
                                    { id: "bilingual", name: "⚖️ Bilingual / ثنائي" },
                                    { id: "english", name: "🇺🇸 English Only" },
                                    { id: "arabic", name: "🇮🇶 Iraq / العربي" }
                                  ].map((mode) => (
                                    <button
                                      key={mode.id}
                                      type="button"
                                      onClick={() => {
                                        setCertLayoutMode(mode.id as any);
                                        triggerToast(`🔄 View set to ${mode.id.toUpperCase()} layout.`);
                                      }}
                                      className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-bold ${certLayoutMode === mode.id ? "bg-amber-500 text-stone-950 shadow" : "text-stone-400 hover:text-stone-200"}`}
                                    >
                                      {mode.name}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* High Quality Digital Certificate Render on A4 paper simulation */}
                              <div className="relative w-full overflow-x-auto p-4 bg-stone-900 border border-stone-800 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[500px]" id="a4-certified-stage">
                                <CertificatePreview 
                                  certificate={selectedCertificate} 
                                  certificateMode={certLayoutMode} 
                                  zoom={95} 
                                />
                              </div>
                            </>
                          );
                        } else {
                          return (
                            <div className="no-print bg-stone-900 border border-stone-805 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center space-y-6 animate-fade-in" id="certified-document-envelope-gate">
                              {/* Glowing security lock envelope */}
                              <div className="w-20 h-20 bg-stone-950 border-2 border-amber-500 rounded-full flex items-center justify-center shadow-2xl relative select-none">
                                <Lock className="w-8 h-8 text-amber-500 animate-pulse" />
                                <div className="absolute inset-0 rounded-full border border-stone-800 animate-spin-slow"></div>
                              </div>

                              <div className="space-y-2 max-w-md">
                                <span className="text-[10px] font-mono text-amber-500 font-extrabold uppercase tracking-widest block font-sans">Security Authentication Gate</span>
                                <h3 className="text-sm font-black text-stone-100 uppercase tracking-tight">
                                  OFFICIAL A4 REGISTRATION CERTIFICATE SEALED
                                </h3>
                                <p className="text-xs text-stone-400 font-serif leading-normal" dir="rtl">
                                  شهادة تسجيل العلامة الفارقة الرسمية بحجم A4 مـؤمـنة بالكامل لحماية سـرية السجلات ضد الاستنساخ غير المصرح به.
                                </p>
                                <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                                  The official stamped, signed high-fidelity Certificate of Registration is restricted to the registered Brand Proprietor / Agent. To unlock and view the printable document envelope, verify with the 4-digit passkey.
                                </p>
                              </div>

                              {/* PIN Verification Input and Buttons */}
                              <div className="bg-stone-950/60 p-4 rounded-xl border border-stone-800 w-full max-w-sm space-y-3">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-mono text-stone-500 uppercase tracking-widest text-left font-bold font-sans">
                                    Enter Proprietor/Admin Code
                                  </label>
                                  <div className="flex gap-2 relative">
                                    <input 
                                      type="password" 
                                      maxLength={10}
                                      value={lockPinInput}
                                      onChange={(e) => setLockPinInput(e.target.value)}
                                      placeholder="••••••••"
                                      className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-center tracking-widest text-xs font-mono focus:outline-none focus:border-amber-500 font-black text-white"
                                    />
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        const queryPin = lockPinInput.trim();
                                        const appDigits = selectedCertificate.applicationNumber.replace(/[^0-9]/g, "");
                                        const certDigits = selectedCertificate.certificateNumber.replace(/[^0-9]/g, "");
                                        const appLast2 = appDigits.slice(-2);
                                        const certLast2 = certDigits.slice(-2);
                                        
                                        const brandRaw = selectedCertificate.trademarkNameEn.trim();
                                        const brandLast2 = brandRaw.replace(/[^a-zA-Z0-9]/g, "").slice(-2).toUpperCase();
                                        const brandLast2Lower = brandLast2.toLowerCase();
                                        
                                        const validPins = [
                                          "1234",
                                          `${appLast2}1234`,
                                          `1234${appLast2}`,
                                          `${certLast2}1234`,
                                          `1234${certLast2}`,
                                          appLast2,
                                          certLast2,
                                          brandLast2,
                                          brandLast2Lower
                                        ];
                                        
                                        if (validPins.includes(queryPin) && queryPin.length > 0) {
                                          setPinUnlockOverride(selectedCertificate.certificateNumber);
                                          setLockPinInput("");
                                          triggerToast("🔓 Passcode Verified! Original A4 Certificate unlocked successfully.");
                                        } else {
                                          triggerToast(`❌ Incorrect Passcode. Use Admin '1234' or team last 2 letters '${brandLast2}'.`);
                                        }
                                      }}
                                      className="px-4 bg-amber-500 text-stone-950 hover:bg-amber-600 text-xs font-bold rounded-lg cursor-pointer transition-all shrink-0 active:scale-95"
                                    >
                                      Unlock
                                    </button>
                                  </div>
                                </div>
                                <div className="text-[9px] text-stone-400 flex flex-col gap-1 text-left font-sans">
                                  <div className="flex items-center justify-between">
                                    <span>Clue: <strong className="text-amber-500 font-black">{selectedCertificate.trademarkNameEn.replace(/[^a-zA-Z0-9]/g, "").slice(-2).toUpperCase()}</strong> or <strong className="text-stone-300">1234</strong></span>
                                    <span>Verification Keys</span>
                                  </div>
                                  <p className="text-[8.5px] leading-relaxed text-stone-500 italic">
                                    * Unlock options: Admin "1234" or the last 2 characters of the brand trademark name.
                                  </p>
                                </div>
                              </div>

                              <div className="text-[10px] text-stone-500 font-serif leading-relaxed">
                                * To view public trade parameters or scan the live QR code, please select the <strong className="text-amber-500 underline cursor-pointer" onClick={() => setCertificateDetailTab("uspto")}>USPTO TSDR Case Sheet</strong> tab.
                              </div>
                            </div>
                          );
                        }
                      })()}

                    </div>
                  )}

                </div>
              ) : (
                <div className={`w-full flex flex-col items-center justify-center text-center p-12 rounded-xl border space-y-4 transition-all ${themeMode === "light" ? "bg-white border-stone-200" : "bg-stone-900 border-stone-800"}`}>
                  <Globe className={`w-12 h-12 ${themeMode === "light" ? "text-stone-300" : "text-stone-750"}`} />
                  <p className={`${themeMode === "light" ? "text-stone-500" : "text-stone-400"} text-xs font-semibold`}>
                    Please select a trademark record on the left to show certified details.
                  </p>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ================= OPTION B: REGISTER INTAKE FORM ================= */}
        {activeTab === "register" && (
          <div className="lg:col-span-12 max-w-3xl mx-auto w-full space-y-6 animate-fadeIn" id="intake-form-layout">
            
            <div className={`p-6 rounded-2xl border shadow-xl space-y-4 transition-all ${
              themeMode === "light" ? "bg-white border-stone-200 text-stone-900" : "bg-stone-900 border-stone-800 text-stone-100"
            }`} id="register-panel">
              
              <div className={`flex justify-between items-center pb-3 border-b ${themeMode === "light" ? "border-stone-200" : "border-stone-800"}`}>
                <div>
                  <h2 className="text-base font-display font-extrabold text-amber-500 tracking-wide flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-amber-500" /> National Trademark Registration Intake
                  </h2>
                  <p className={`text-[11px] mt-0.5 ${themeMode === "light" ? "text-stone-500" : "text-stone-400"}`}>تسجيل العلامات التجارية - وزارة الصناعة والمعادن العراقية</p>
                </div>
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded border font-bold ${
                  themeMode === "light" ? "bg-stone-100 border-stone-200 text-stone-600" : "bg-stone-950 border-stone-800 text-stone-400"
                }`}>
                  AUTOMATED REGISTRY
                </span>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                
                {/* Auto-pilot interactive toggle */}
                <div className={`p-4 rounded-xl border space-y-1.5 transition-all ${themeMode === "light" ? "bg-amber-500/10 border-amber-500/30 text-amber-950" : "bg-amber-500/10 border-amber-500/20 text-stone-200"}`} id="autopilot-alert-box">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-500 mt-0.5 shrink-0 animate-bounce" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-amber-600">⚡ Auto-Pilot Registration Enabled (অটো-পायलট সক্রিয়)</h4>
                      <p className={`text-[11px] leading-normal ${themeMode === "light" ? "text-stone-700" : "text-stone-300"}`}>
                        Provide only the <strong className="text-amber-600">Trademark Brand Name</strong> and <strong className="text-amber-600">Owner Name</strong>. The federal government registry will automatically configure international Nice classification, registered addresses, certificate numbers, filing timelines and digital seals!
                      </p>
                    </div>
                  </div>
                </div>

                {/* TWO COMPULSORY INPUTS */}
                <div className={`space-y-4 p-5 rounded-2xl border transition-all ${themeMode === "light" ? "bg-stone-50 border-stone-200 text-stone-900" : "bg-stone-950/20 border-stone-800 text-stone-200"}`}>
                  
                  {/* FIELD 1: Trademark Brand Name */}
                  <div className="space-y-1">
                    <label className={`block text-xs font-bold uppercase tracking-wide ${themeMode === "light" ? "text-stone-700" : "text-amber-400"}`}>
                      1. Trademark Brand Name / اسم العلامة التجارية (Required)
                    </label>
                    <input 
                      type="text"
                      required
                      value={newTrademark.trademarkNameEn}
                      onChange={(e) => setNewTrademark({ 
                        ...newTrademark, 
                        trademarkNameEn: e.target.value,
                        trademarkNameAr: e.target.value 
                      })}
                      placeholder="e.g., SINDIBAD SWEETS & BAKERY"
                      className={`w-full p-3 rounded-lg text-xs font-semibold focus:outline-none transition-colors ${
                        themeMode === "light" 
                          ? "bg-white border border-stone-300 text-stone-900 focus:border-amber-500 placeholder-stone-400" 
                          : "bg-stone-950 border border-stone-800 text-white focus:border-amber-500 placeholder-stone-700 font-mono"
                      }`}
                    />
                  </div>

                  {/* FIELD 2: Owner/Proprietor Name */}
                  <div className="space-y-1">
                    <label className={`block text-xs font-bold uppercase tracking-wide ${themeMode === "light" ? "text-stone-700" : "text-amber-400"}`}>
                      2. Owner's Full Name / الاسم الكامل للمالك (Required)
                    </label>
                    <input 
                      type="text"
                      required
                      value={newTrademark.proprietorNameEn}
                      onChange={(e) => setNewTrademark({ 
                        ...newTrademark, 
                        proprietorNameEn: e.target.value,
                        proprietorNameAr: e.target.value 
                      })}
                      placeholder="e.g., AL-SINDIBAD HOLDINGS CO. LTD."
                      className={`w-full p-3 rounded-lg text-xs font-semibold focus:outline-none transition-colors ${
                        themeMode === "light" 
                          ? "bg-white border border-stone-300 text-stone-900 focus:border-amber-500 placeholder-stone-400" 
                          : "bg-stone-950 border border-stone-800 text-white focus:border-amber-500 placeholder-stone-700 font-mono"
                      }`}
                    />
                  </div>

                  {/* FIELD 3: Nice Class International Classification Selection */}
                  <div className="space-y-1">
                    <label className={`block text-xs font-bold uppercase tracking-wide ${themeMode === "light" ? "text-stone-700" : "text-amber-400"}`}>
                      3. International Nice Class Category / التصنيف الدولي للسلع والخدمات (Selectable Option)
                    </label>
                    <select
                      value={NICE_CLASSES.find(c => newTrademark.classNumber?.includes(`Class ${c.number}`))?.number || "custom"}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "custom") {
                          setNewTrademark({
                            ...newTrademark,
                            classNumber: "Class "
                          });
                        } else {
                          const cls = NICE_CLASSES.find(c => c.number === val);
                          if (cls) {
                            setNewTrademark({
                              ...newTrademark,
                              classNumber: `Class ${cls.number} (${cls.nameEn})`,
                              goodsServicesEn: cls.descriptionEn,
                              goodsServicesAr: cls.descriptionAr
                            });
                          }
                        }
                      }}
                      className={`w-full p-3 rounded-lg text-xs font-bold focus:outline-none transition-colors cursor-pointer ${
                        themeMode === "light" 
                          ? "bg-amber-100/30 border border-stone-300 text-stone-900 focus:border-amber-500" 
                          : "bg-amber-500/10 border border-stone-800 text-amber-200 focus:border-amber-500"
                      }`}
                    >
                      {NICE_CLASSES.map((cls) => (
                        <option key={cls.number} value={cls.number} className={themeMode === "light" ? "text-stone-900" : "text-stone-900"}>
                          Class {cls.number} - {cls.nameEn} ({cls.nameAr})
                        </option>
                      ))}
                      <option value="custom" className={themeMode === "light" ? "text-stone-900" : "text-stone-900"}>Custom Class / تصنيف مخصص</option>
                    </select>
                  </div>

                  {/* FIELD 4: Customize class name / title text directly */}
                  <div className="space-y-1">
                    <label className={`block text-[10px] font-bold uppercase tracking-wide ${themeMode === "light" ? "text-stone-600" : "text-stone-400"}`}>
                      Customize Nice Class Text Label / تعديل اسم فئة التصنيف يدوياً
                    </label>
                    <input 
                      type="text"
                      value={newTrademark.classNumber}
                      onChange={(e) => setNewTrademark({ ...newTrademark, classNumber: e.target.value })}
                      placeholder="e.g., Class 35 (Advertising & Office Functions)"
                      className={`w-full p-3 rounded-lg text-xs font-semibold focus:outline-none transition-colors ${
                        themeMode === "light" 
                          ? "bg-white border border-stone-300 text-stone-900 focus:border-amber-500" 
                          : "bg-stone-950 border border-stone-800 text-white focus:border-amber-500 font-mono"
                      }`}
                    />
                  </div>

                  {/* FIELD 4.5: Trademark Current Status Option */}
                  <div className="space-y-1">
                    <label className={`block text-[10px] font-bold uppercase tracking-wide ${themeMode === "light" ? "text-stone-600" : "text-stone-400"}`}>
                      Trademark Status / حالة العلامة التجارية
                    </label>
                    <select
                      value={newTrademark.status || "REGISTERED"}
                      onChange={(e) => {
                        const sVal = e.target.value as "REGISTERED" | "PENDING";
                        setNewTrademark({
                          ...newTrademark,
                          status: sVal,
                          statusAr: sVal === "REGISTERED" ? "سجل نظامي رسمي - نشطة" : "طلب قيد الفحص والمراجعة الرسمية"
                        });
                      }}
                      className={`w-full p-2.5 rounded-lg text-xs font-bold focus:outline-none transition-colors cursor-pointer ${
                        themeMode === "light" 
                          ? "bg-white border border-stone-300 text-stone-900 focus:border-amber-500" 
                          : "bg-stone-950 border border-stone-800 text-amber-200 focus:border-amber-500 font-mono"
                      }`}
                    >
                      <option value="REGISTERED" className="text-stone-900">REGISTERED (نشطة - سجل نظامي رسمي)</option>
                      <option value="PENDING" className="text-stone-900">PENDING (تحت الدراسة والفحص)</option>
                    </select>
                  </div>

                  {/* FIELD 5: Goods & Services Descriptions (English and Arabic) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={`block text-[10px] font-bold uppercase tracking-wide ${themeMode === "light" ? "text-stone-600" : "text-stone-400"}`}>
                        Goods/Services (English) / بيان السلع بالإنجليزية
                      </label>
                      <textarea
                        rows={2}
                        value={newTrademark.goodsServicesEn}
                        onChange={(e) => setNewTrademark({ ...newTrademark, goodsServicesEn: e.target.value })}
                        placeholder="Define protected goods detail in English"
                        className={`w-full p-2.5 rounded-lg text-xs font-semibold focus:outline-none transition-colors leading-normal ${
                          themeMode === "light" 
                            ? "bg-white border border-stone-300 text-stone-900 focus:border-amber-500" 
                            : "bg-stone-950 border border-stone-800 text-white focus:border-amber-500"
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={`block text-[10px] font-bold uppercase tracking-wide ${themeMode === "light" ? "text-stone-600" : "text-stone-400"}`}>
                        Goods/Services (Arabic) / بيان المنتجات والسلع بالعربية
                      </label>
                      <textarea
                        rows={2}
                        value={newTrademark.goodsServicesAr}
                        onChange={(e) => setNewTrademark({ ...newTrademark, goodsServicesAr: e.target.value })}
                        placeholder="تحديد المنتجات والخدمات المحمية باللغة العربية"
                        className={`w-full p-2.5 rounded-lg text-xs font-semibold focus:outline-none transition-colors text-right leading-normal ${
                          themeMode === "light" 
                            ? "bg-white border border-stone-300 text-stone-900 focus:border-amber-500" 
                            : "bg-stone-950 border border-stone-800 text-white focus:border-amber-500 font-serif font-bold"
                        }`}
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo and Seal customisation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Custom File Upload Box */}
                  <div className={`space-y-2 p-4 rounded-xl border-2 border-dashed transition-all ${
                    themeMode === "light" 
                      ? "bg-white border-stone-300 hover:border-amber-500/50" 
                      : "bg-stone-950/20 border-stone-800 hover:border-amber-500/50"
                  }`}>
                    <label className="block text-[11px] font-bold text-amber-600 uppercase tracking-wide text-center flex items-center justify-center gap-1.5 font-sans">
                      <Upload className="w-3.5 h-3.5" /> Optional: Upload Brand Logo Device
                    </label>
                    
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => { setIsDragOver(false); }}
                      onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files[0]) handleLogoUpload(e.dataTransfer.files[0]); }}
                      onClick={() => document.getElementById("intake-logo-field")?.click()}
                      className={`text-center py-5 px-2 rounded-lg cursor-pointer transition-all ${
                        isDragOver ? "bg-amber-500/10" : themeMode === "light" ? "bg-stone-50 hover:bg-stone-100" : "bg-stone-950/50 hover:bg-stone-900/40"
                      }`}
                    >
                      {uploadedLogo ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <img src={uploadedLogo} alt="Preview" className="w-12 h-12 rounded object-contain border border-stone-200 bg-white shadow-sm" />
                          <span className="text-emerald-600 font-bold text-[10px]">✓ Brand Logomark uploaded</span>
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setUploadedLogo(undefined); }}
                            className="text-[9px] text-red-500 underline cursor-pointer"
                          >
                            Reset upload
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <p className={`text-[10px] ${themeMode === "light" ? "text-stone-500" : "text-stone-400"}`}>Drag & drop your PNG/JPG image here, or click to browse.</p>
                          <span className="text-[8.5px] text-stone-400 block font-semibold">Accepts clear or transparent backgrounds</span>
                        </div>
                      )}
                    </div>
                    <input 
                      id="intake-logo-field"
                      type="file" 
                      accept="image/*"
                      onChange={(e) => { if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]); }}
                      className="hidden"
                    />
                  </div>

                  {/* Fallback preset vector selections */}
                  <div className={`p-4 rounded-xl border flex flex-col justify-center transition-all ${
                    themeMode === "light" ? "bg-white border-stone-200 text-stone-900" : "bg-stone-950/20 border-stone-800 text-stone-100"
                  }`}>
                    <label className={`block text-[11px] font-bold uppercase tracking-wide mb-2 ${themeMode === "light" ? "text-stone-700" : "text-stone-400"}`}>
                      {uploadedLogo ? "Uploaded Logo Selected" : "Or use High Quality Representative Device"}
                    </label>
                    {uploadedLogo ? (
                      <p className={`text-[10px] italic leading-relaxed ${themeMode === "light" ? "text-stone-500" : "text-stone-400"}`}>
                        Your uploaded custom logo will take precedence and will represent the graphic mark device on the legal A4 Certificate of Registration.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "mesopotamia-palm-shield", name: "Al-Mesopotamia Palm" },
                          { id: "mesopotamia-cuneiform", name: "Al-Rafidain Star" },
                          { id: "crescent-tech", name: "Industrial Crescent" },
                          { id: "islamic-geometry", name: "Islamic Mesh" }
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setNewTrademark({ ...newTrademark, presetLogoId: m.id })}
                            className={`p-2 rounded text-[10px] font-semibold text-center border capitalize transition-transform cursor-pointer ${
                              newTrademark.presetLogoId === m.id 
                                ? "bg-amber-500/10 border-amber-500 text-amber-500" 
                                : themeMode === "light" 
                                  ? "bg-stone-50 border-stone-300 text-stone-605 hover:bg-stone-100" 
                                  : "bg-stone-950 border-stone-800 text-stone-400 hover:bg-stone-900"
                            }`}
                          >
                            {m.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-stone-950/35 p-3 rounded-xl border border-stone-800 text-[11px] text-stone-400 leading-normal flex gap-1.5">
                  <span className="text-amber-500">🛡️</span>
                  <p>
                    <strong>Automatic Legal Compliance validation:</strong> Registrations automatically backdate standard filing records dynamically up to any year from 2020 onward, granting exactly 10 Gregorian years protection parameters before automatic expiry rules trigger.
                  </p>
                </div>

                {/* Validate Submit Action Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-750 hover:from-emerald-500 hover:to-emerald-655 font-extrabold text-white rounded-xl shadow-lg hover:shadow-emerald-950/20 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer border-t border-emerald-500/30"
                >
                  <Sparkles className="w-4.5 h-4.5 animate-pulse text-amber-300" /> PUBLISH TRADEMARK TO REGISTER & DATABASE
                </button>

              </form>
            </div>

          </div>
        )}

        {/* ================= OPTION C: TRADEMARK CONFLICTS & DISPUTE REPORT (TTAB) ================= */}
        {activeTab === "disputes" && (
          <div className="lg:col-span-12 max-w-3xl mx-auto w-full space-y-6 animate-fadeIn" id="dispute-form-layout">
            
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-xl space-y-4" id="dispute-panel">
              <div className="flex justify-between items-center pb-3 border-b border-stone-800">
                <div>
                  <h2 className="text-base font-display font-extrabold text-amber-400 tracking-wide flex items-center gap-2">
                    <Scale className="w-5 h-5 text-amber-400" /> Federal Trademark Dispute & Opposition Filing (TTAB)
                  </h2>
                  <p className="text-[11px] text-stone-500 mt-0.5">مجلس الاستئناف والاعتراضات - وزارة الصناعة والمعادن العراقية</p>
                </div>
                <span className="bg-stone-950 text-stone-400 font-mono text-[10px] px-2 py-0.5 rounded border border-stone-800 font-bold">
                  OFFICIAL OPPOSITION
                </span>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!disputeForm.targetCertNumber) {
                  triggerToast("⚠️ Please select a registered trademark to report/oppose.");
                  return;
                }
                if (!disputeForm.reporterName || !disputeForm.conflictingBrandName) {
                  triggerToast("⚠️ Please fill in all required dispute fields.");
                  return;
                }

                // Load databases
                const db = getStoredCertificates();
                const updated = db.map((item) => {
                  if (item.certificateNumber === disputeForm.targetCertNumber) {
                    const currentOps = item.oppositions || [];
                    const newOp = {
                      id: `TTAB-OP-${Math.floor(100000 + Math.random() * 900000)}`,
                      reporterName: disputeForm.reporterName,
                      reporterEmail: disputeForm.reporterEmail || "legal@iraqip-council.org",
                      reason: disputeForm.reason,
                      conflictingBrandName: disputeForm.conflictingBrandName,
                      statusOfOpposition: "PENDING" as const,
                      dateFiled: new Date().toISOString().split("T")[0],
                      description: disputeForm.description || "Official adverse claim filed regarding trademark overlap."
                    };
                    return {
                      ...item,
                      status: "PENDING",
                      statusAr: "قيد المراجعة القانونية - معترض عليها",
                      oppositions: [...currentOps, newOp]
                    };
                  }
                  return item;
                });

                localStorage.setItem("iraq_trademarks_db", JSON.stringify(updated));
                
                // Live reload inside Search tab
                const loaded = queryTrademarkDatabase(searchQuery);
                setSearchResults(loaded);
                const updatedSelected = updated.find(u => u.certificateNumber === disputeForm.targetCertNumber);
                if (updatedSelected) {
                  setSelectedCertificate(updatedSelected);
                }

                triggerToast("⚖️ Opposition / Infringement report submitted successfully in the database!");
                
                // Clear state
                setDisputeForm({
                  targetCertNumber: "",
                  reporterName: "",
                  reporterEmail: "",
                  conflictingBrandName: "",
                  reason: "Likelihood of Confusion / تداخل وتشابه العلامات",
                  description: ""
                });
                
                // Redirect back to search so they can view their opposition
                setActiveTab("search");
                setCertificateDetailTab("uspto");
              }} className="space-y-4 text-stone-300">
                
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl space-y-1">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 animate-pulse" /> USPTO-Compliant Database Submission (অনলাইন ডাটাবেজ সাবমিট)
                  </h4>
                  <p className="text-[11px] text-stone-400 leading-normal">
                    Submit a formal report or appeal against any registered brand in our electronic database. The case file will instantly update with red flags and record all filed adverse claims under Case Parameters.
                  </p>
                </div>

                {/* Target Registered Trademark Dropdown */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                    Select Target Registered Trademark to Report/Oppose (required)
                  </label>
                  <select
                    required
                    value={disputeForm.targetCertNumber}
                    onChange={(e) => setDisputeForm({ ...disputeForm, targetCertNumber: e.target.value })}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-500 text-white cursor-pointer"
                  >
                    <option value="">-- Choose a Trademark from Registered Database --</option>
                    {getStoredCertificates().map((item) => (
                      <option key={item.certificateNumber} value={item.certificateNumber}>
                        {item.trademarkNameEn} ({item.certificateNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Two Column details: Reporter and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                      Reporter Full Name / Law Firm (required)
                    </label>
                    <input 
                      type="text"
                      required
                      value={disputeForm.reporterName}
                      onChange={(e) => setDisputeForm({ ...disputeForm, reporterName: e.target.value })}
                      placeholder="e.g., Al-Saeidi Legal Counsel Co."
                      className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-500 text-white placeholder-stone-700 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                      Contact Email
                    </label>
                    <input 
                      type="email"
                      value={disputeForm.reporterEmail}
                      onChange={(e) => setDisputeForm({ ...disputeForm, reporterEmail: e.target.value })}
                      placeholder="e.g., counsel@al-saeidilaw.iq"
                      className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-500 text-white placeholder-stone-700 font-mono"
                    />
                  </div>
                </div>

                {/* Conflicting Brand Name & Nice Classification Reason */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                      Your Conflicting Brand Name (required)
                    </label>
                    <input 
                      type="text"
                      required
                      value={disputeForm.conflictingBrandName}
                      onChange={(e) => setDisputeForm({ ...disputeForm, conflictingBrandName: e.target.value })}
                      placeholder="e.g., SINDIBAD SWEETS CLASSIC"
                      className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-500 text-white placeholder-stone-700 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                      Select Ground of Opposition
                    </label>
                    <select
                      value={disputeForm.reason}
                      onChange={(e) => setDisputeForm({ ...disputeForm, reason: e.target.value })}
                      className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-500 text-white cursor-pointer"
                    >
                      <option value="Likelihood of Confusion / تداخل وتشابه العلامات">Likelihood of Confusion / تداخل وتعارض علامات تجارية</option>
                      <option value="Merely Descriptive / وصفية بحتة دون تفرد">Merely Descriptive / علامة وصفية عامة تفتقر للتميز</option>
                      <option value="Dilution or Unfair Competition / منافسة غير مشروعة">Dilution or Unfair Competition / منافسة تجارية غير عادلة</option>
                      <option value="Bad-faith Filing / تسجيل بسوء نية ومحاكاة">Bad-faith Filing / تقديم بسوء نية وتقليد متعمد للتصميم</option>
                    </select>
                  </div>
                </div>

                {/* Large Description of claim */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                    Legal Grievance & Evidence Description
                  </label>
                  <textarea 
                    rows={4}
                    value={disputeForm.description}
                    onChange={(e) => setDisputeForm({ ...disputeForm, description: e.target.value })}
                    placeholder="Describe exactly why this registered trademark conflicts with your existing prior rights (such as same Class, phonetic similarity, logo shapes overlap, or prior local market use)."
                    className="w-full p-3 bg-stone-950 border border-stone-800 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-500 text-white placeholder-stone-700 leading-relaxed"
                  />
                </div>

                <div className="bg-stone-950/30 p-3 rounded-xl border border-stone-800 text-[11px] text-stone-400 flex gap-2">
                  <span className="text-amber-500">⚖️</span>
                  <p>
                    <strong>TTAB Submission Notice:</strong> Upon clicking file, the metadata is registered, status is adjusted to PENDING REVIEW status, and details display publicly in examiner lookups instantly.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-600 hover:to-amber-600 font-extrabold text-white rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer border-t border-red-500/30"
                >
                  <Scale className="w-4.5 h-4.5 text-white" /> SUBMIT LEGAL REPORT TO CENTRAL IP REGISTRY
                </button>

              </form>
            </div>

          </div>
        )}

      </main>

      {/* ================= REGISTER COMPLETED SUCCESS MODAL SYSTEM ================= */}
      {showRegSuccess && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="success-intake-dialog">
          <div className="bg-stone-905 border border-stone-800 max-w-lg w-full p-6 rounded-2xl shadow-2xl relative overflow-hidden text-center space-y-4">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500" />
            <div className="w-14 h-14 bg-emerald-950 border border-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 text-emerald-450">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-black text-emerald-400 text-base">REGISTRATION SUCCESSFUL!</h3>
              <p className="text-xs text-stone-400">The Trademark has been fully recorded in the national database pipeline.</p>
            </div>

            {/* Generated links container */}
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
              <div className="text-left space-y-1 text-xs">
                <span className="text-[10px] text-stone-500 font-mono block">LIVE SHARABLE LOOKUP URL (Facebook Form Safe)</span>
                <div className="flex bg-stone-900 p-2 rounded border border-stone-800 text-stone-300 font-mono text-[10.5px] items-center justify-between select-all">
                  <span className="truncate pr-4 select-all text-emerald-400">{showRegSuccess}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(showRegSuccess || "");
                      triggerToast("✓ Shared Verification Link Copied!");
                    }}
                    className="p-1.5 hover:bg-stone-850 text-amber-500 rounded select-none font-bold cursor-pointer"
                    title="Copy Link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-stone-400 text-left leading-normal font-sans space-y-2">
                <p>
                  ℹ️ <strong>System Tip:</strong> You can copy and submit this live URL in Facebook applications or custom verification portals. Anyone clicking the link is redirected directly to the official Ministry Database retrieval portal displaying active examiner status, case notes, and high-fidelity seal records.
                </p>
                <p className="font-serif text-[11px] text-amber-500 text-right text-sm" dir="rtl">
                  تنبيه النظام: يمكنك مشاركة هذا الرابط للتحقق الفوري والمباشر في أي متصفح أو نموذج رسمي. الضغط على الرابط سيعرض بيانات العلامة المسجلة مع الشعار والختم الرقمي المصدق في قاعدة البيانات الرسمية.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowRegSuccess(null);
                  setActiveTab("search");
                }}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Go to Active Preview & print Certificate
              </button>
              <button
                type="button"
                onClick={() => setShowRegSuccess(null)}
                className="py-2 px-4 bg-stone-800 hover:bg-stone-750 text-stone-200 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= NOTIFICATION SYSTEM (TOASTS) ================= */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 bg-amber-500 text-stone-950 px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce z-50 border border-amber-400" id="notification-msg">
          <span className="text-sm">✓</span>
          {toastMessage}
        </div>
      )}

      {/* ================= FOOTER NOTE ================= */}
      <footer className="no-print text-center py-6 border-t border-stone-900 mt-12 text-stone-500 text-xs" id="app-disclaimer-footer">
        <p>© {new Date().getFullYear()} Republic of Iraq Ministerial Commercial Registry Portal (iraqgovtrademark.org). Scalable single-screen case lookups.</p>
      </footer>

    </div>
  );
}
