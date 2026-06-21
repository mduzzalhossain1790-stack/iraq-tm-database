import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs, getDoc, query, where } from "firebase/firestore";
import { TrademarkCertificate } from "./types";

// Firebase App Configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyA7b40WZwR6KXtEPM6GgjUNXriCIp2HKVg",
  authDomain: "friendly-autonomy-5dpgw.firebaseapp.com",
  projectId: "friendly-autonomy-5dpgw",
  storageBucket: "friendly-autonomy-5dpgw.firebasestorage.app",
  messagingSenderId: "133798324636",
  appId: "1:133798324636:web:cf83e11e1323d9bba34059"
};

// Initialize Firebase Application
const app = initializeApp(firebaseConfig);

// Initialize Firestore targeting the specific database ID as configured
export const db = getFirestore(app, "ai-studio-211736ba-0ee6-4da0-a610-e86be90224e2");

const COLLECTION_NAME = "trademarks";

/**
 * Save or update a trademark certificate to the real, online Firebase database.
 * This makes it a real USPTO-style synchronized online ledger!
 */
export async function saveTrademarkToFirebase(cert: TrademarkCertificate): Promise<void> {
  try {
    const docId = cert.certificateNumber.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
    const docRef = doc(db, COLLECTION_NAME, docId);
    
    // Maintain a clean serializable object
    const serializableCert = {
      ...cert,
      isVerified: true,
      lastUpdated: new Date().toISOString()
    };
    
    await setDoc(docRef, serializableCert, { merge: true });
    console.log(`[Firebase] Successfully uploaded trademark: ${cert.certificateNumber}`);
  } catch (err) {
    console.error("[Firebase] Error saving trademark", err);
  }
}

/**
 * Fetch all trademark certificates registered globally from the Firestore database.
 */
export async function fetchTrademarksFromFirebase(): Promise<TrademarkCertificate[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const list: TrademarkCertificate[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as TrademarkCertificate);
    });
    return list;
  } catch (err) {
    console.error("[Firebase] Error fetching trademarks", err);
    return [];
  }
}

/**
 * Retrieve a specific trademark certificate by certificate number directly from Firestore (real-time verification check).
 * Perfect for deep links and QR verification without relying on local storage index.
 */
export async function fetchTrademarkByCertificateNumber(certNum: string): Promise<TrademarkCertificate | null> {
  if (!certNum) return null;
  try {
    const docId = certNum.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
    const docRef = doc(db, COLLECTION_NAME, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as TrademarkCertificate;
    }
  } catch (err) {
    console.error("[Firebase] Query error", err);
  }
  return null;
}
