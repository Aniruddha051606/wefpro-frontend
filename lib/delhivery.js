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