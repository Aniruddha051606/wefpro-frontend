import axios from 'axios';

const BASE_URL = process.env.DELHIVERY_MODE === 'production' 
  ? 'https://track.delhivery.com' 
  : 'https://staging-express.delhivery.com';

const API_KEY = process.env.DELHIVERY_API_KEY || "MOCK_KEY";

// 1. Create Shipment (Book Pickup)
export const createShipment = async (order) => {
  if (API_KEY === "MOCK_KEY") {
    // Return Mock AWB for testing
    return { success: true, awb: "DL" + Math.floor(Math.random() * 900000000 + 100000000) };
  }

  const payload = {
    "format": "json",
    "data": {
      "shipments": [{
        "name": order.customerName,
        "add": order.address,
        "pin": order.pincode || "412806",
        "phone": order.phoneNumber,
        "order": order.orderId,
        "payment_mode": "Prepaid",
        "products_desc": "Handcrafted Jams",
        "cod_amount": 0
      }],
      "pickup_location": {
        "name": "WefPro Warehouse",
        "add": "Mahabaleshwar, Maharashtra",
        "pin": "412806",
        "phone": "9876543210"
      }
    }
  };

  try {
    const res = await axios.post(`${BASE_URL}/cmu/creation/api/v1/`, payload, {
      headers: { 'Authorization': `Token ${API_KEY}` }
    });
    
    if (res.data.packages && res.data.packages.length > 0) {
        return { success: true, awb: res.data.packages[0].waybill };
    }
    return { success: false, error: "Booking Failed" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 2. Track Shipment
export const trackShipment = async (awb) => {
  if (!awb) return null;
  if (API_KEY === "MOCK_KEY" || awb.startsWith("DL")) {
    return [{ date: new Date().toISOString(), location: "Mahabaleshwar", status: "Picked Up" }];
  }

  try {
    const res = await axios.get(`${BASE_URL}/api/v1/packages/json/?waybill=${awb}&token=${API_KEY}`);
    return res.data.ShipmentData ? res.data.ShipmentData[0].Shipment.Scans : [];
  } catch (error) {
    return [];
  }
};

// 3. 🟢 GET LABEL PDF
export const getShippingLabel = async (awb) => {
  if (API_KEY === "MOCK_KEY") return "https://www.delhivery.com/sample_label.pdf";

  try {
    // Fetch PDF Link from Delhivery
    const res = await axios.get(`${BASE_URL}/api/p/packing_slip?wbns=${awb}&pdf=true`, {
      headers: { 'Authorization': `Token ${API_KEY}` }
    });
    
    if (res.data && res.data.packages && res.data.packages[0]) {
        return res.data.packages[0].pdf_download_link; 
    }
    return null;
  } catch (error) {
    return null;
  }
};