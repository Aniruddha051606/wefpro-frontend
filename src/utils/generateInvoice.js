import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadInvoice = async (order) => {
  if (!order) return alert("Error: Order data is missing!");

  try {
    const doc = new jsPDF();
    const brandRed = [220, 38, 38];
    const darkSlate = [15, 23, 42];
    const textGray = [100, 116, 139];

    // --- BARCODE GENERATION ---
    // We use a robust barcode API to generate a Code128 barcode image of the Order ID
    const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${order.orderId}&scale=3&height=10&includetext`;
    
    // Convert image URL to Base64 (Required for jsPDF)
    const getBase64ImageFromURL = async (url) => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    };

    // Add Barcode to Top Right
    try {
        const barcodeImg = await getBase64ImageFromURL(barcodeUrl);
        doc.addImage(barcodeImg, 'PNG', 150, 10, 45, 15); // x, y, width, height
    } catch (e) {
        console.warn("Barcode failed to load", e);
    }

    // --- EXISTING INVOICE DESIGN ---
    doc.setDrawColor(...brandRed);
    doc.setLineWidth(2);
    doc.line(0, 0, 210, 0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(...darkSlate);
    doc.text("WEFPRO", 14, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...textGray);
    doc.text("Handcrafted in Mahabaleshwar", 14, 32);
    doc.text("FSSAI Lic No: 215XXXXXXXXXXX", 14, 37);

    // Invoice Details
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkSlate);
    doc.text("INVOICE", 195, 35, { align: "right" }); // Moved down slightly for barcode
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    doc.text(`${order.invoiceId}`, 195, 42, { align: "right" });
    doc.setTextColor(...textGray);
    doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`, 195, 47, { align: "right" });

    // Bill To Section
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 55, 182, 35, 'F'); 

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...textGray);
    doc.text("BILL TO:", 20, 64);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(String(order.customerName || 'Guest').toUpperCase(), 20, 70);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...darkSlate);
    doc.text(String(order.phoneNumber || ''), 20, 75);
    
    const safeAddress = String(order.address || 'Address not provided');
    const addressLines = doc.splitTextToSize(safeAddress, 140);
    doc.text(addressLines, 20, 80);

    // Items Table
    const tableData = (order.items || []).map(item => [
      item.name,
      `Rs. ${item.price}`,
      item.quantity || item.qty || 1,
      `Rs. ${(item.price * (item.quantity || item.qty || 1)).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 100,
      head: [['ITEM DESCRIPTION', 'PRICE', 'QTY', 'AMOUNT']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: brandRed, textColor: 255, fontStyle: 'bold' },
      columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } },
      alternateRowStyles: { fillColor: [250, 250, 250] }
    });

    const finalY = (doc.lastAutoTable?.finalY || 100) + 10;
    const safeTotal = parseFloat(order.totalAmount || order.amount || 0);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(120, finalY, 195, finalY);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Paid:   Rs. ${safeTotal.toLocaleString()}`, 195, finalY + 10, { align: "right" });

    doc.save(`Invoice_${order.orderId}.pdf`);
  } catch (err) {
    console.error("PDF Gen Error:", err);
    alert("Could not generate PDF. Check console.");
  }
};