import axios from 'axios';

const BASE_URL = process.env.DELHIVERY_MODE === 'production' 
  ? 'https://track.delhivery.com' 
  : 'https://staging-express.delhivery.com';

const API_KEY = process.env.DELHIVERY_API_KEY || "MOCK_KEY";

export const createShipment = async (order) => {
  if (API_KEY === "MOCK_KEY") {
    // 🟢 MOCK: Return a Fake AWB immediately
    return { success: true, awb: "DL" + Math.floor(Math.random() * 900000000 + 100000000) };
  }

  // ... (Real code hidden if mock) ...
  try {
    const payload = { /* ... payload ... */ };
    const res = await axios.post(`${BASE_URL}/cmu/creation/api/v1/`, payload, {
      headers: { 'Authorization': `Token ${API_KEY}` }
    });
    if (res.data.packages?.length > 0) return { success: true, awb: res.data.packages[0].waybill };
    return { success: false, error: "Booking Failed" };
  } catch (error) { return { success: false, error: error.message }; }
};

export const trackShipment = async (awb) => {
  if (!awb) return null;
  if (API_KEY === "MOCK_KEY" || awb.startsWith("DL")) {
    // 🟢 MOCK: Fake Timeline
    return [
        { date: new Date().toISOString(), location: "Mahabaleshwar", status: "Picked Up" },
        { date: new Date().toISOString(), location: "Pune Hub", status: "In Transit" }
    ];
  }
  
  try {
    const res = await axios.get(`${BASE_URL}/api/v1/packages/json/?waybill=${awb}&token=${API_KEY}`);
    return res.data.ShipmentData ? res.data.ShipmentData[0].Shipment.Scans : [];
  } catch (error) { return []; }
};

export const getShippingLabel = async (awb) => {
  if (API_KEY === "MOCK_KEY") {
    // 🟢 MOCK: Return a sample PDF URL (This is a public sample PDF for testing)
    return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  }

  try {
    const res = await axios.get(`${BASE_URL}/api/p/packing_slip?wbns=${awb}&pdf=true`, {
      headers: { 'Authorization': `Token ${API_KEY}` }
    });
    if (res.data?.packages?.[0]) return res.data.packages[0].pdf_download_link; 
    return null;
  } catch (error) { return null; }
};
// 4. 🟢 SMART RATE CALCULATOR (Weight + Zone)
export const checkShippingRate = async (pincode, weightKg = 0.4) => {
  // Round up to nearest 0.5kg slab (Standard Courier Rule)
  // e.g., 0.4kg -> 0.5kg, 0.8kg -> 1.0kg
  const chargedWeight = Math.ceil(weightKg * 2) / 2;
  
  // Base rate for first 0.5kg
  let baseRate = 0; 
  
  // Rate per EXTRA 0.5kg
  const slabRate = 30; 

  if (API_KEY === "MOCK_KEY") {
    // 🧪 SIMULATION LOGIC
    if (pincode.startsWith('4')) baseRate = 40;      // Local (MH)
    else if (pincode.startsWith('1')) baseRate = 60; // Metro (North)
    else if (pincode.startsWith('5')) baseRate = 60; // Metro (South)
    else if (pincode.startsWith('7')) baseRate = 90; // North East
    else baseRate = 70; // Rest of India
  } else {
    // 🌍 REAL API CHECK (Serviceability Only)
    try {
        const res = await axios.get(`${BASE_URL}/c/api/pin-codes/json/?filter_codes=${pincode}`, {
            headers: { 'Authorization': `Token ${API_KEY}` }
        });
        
        const pinData = res.data.delivery_codes.find(p => p.postal_code.code === pincode);
        if (!pinData || pinData.postal_code.pre_paid === "N") {
            return { service: false, error: "Not serviceable" };
        }

        // Map Zones to Base Rates (You can tweak these based on your contract)
        const state = pinData.postal_code.state_code;
        if (state === 'MH') baseRate = 40;
        else if (['DL', 'KA', 'TN', 'WB', 'TS'].includes(state)) baseRate = 60;
        else baseRate = 80;

    } catch (e) {
        return { service: false, error: "Invalid PIN" };
    }
  }

  // 🧮 FINAL CALCULATION: Base + (Extra Slabs * Slab Rate)
  // Example: 2 Jars (0.8kg) -> Charged 1.0kg.
  // First 0.5kg = Base Rate. Remaining 0.5kg = Slab Rate.
  const extraWeight = Math.max(0, chargedWeight - 0.5);
  const extraSlabs = extraWeight / 0.5;
  const totalCost = baseRate + (extraSlabs * slabRate);

  return { service: true, cost: totalCost };
};