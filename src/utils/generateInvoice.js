import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import JsBarcode from "jsbarcode"; // 🟢 1. Import Local Library

export const downloadInvoice = (order) => {
  if (!order) return alert("Error: Order data is missing!");

  try {
    const doc = new jsPDF();
    const brandRed = [220, 38, 38];
    const darkSlate = [15, 23, 42];
    const textGray = [100, 116, 139];

    // --- 🟢 2. LOCAL BARCODE GENERATION (No API needed) ---
    try {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, order.orderId, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 40,
        displayValue: true, // Show "ORD-123" text below bars
        background: "#ffffff"
      });
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, 'PNG', 140, 10, 50, 20); // x, y, width, height
    } catch (err) {
      console.error("Barcode generation failed:", err);
    }

    // --- STANDARD INVOICE DESIGN ---
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
    doc.text("INVOICE", 195, 35, { align: "right" });
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    doc.text(`${order.invoiceId || 'INV-GEN'}`, 195, 42, { align: "right" });
    doc.setTextColor(...textGray);
    doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`, 195, 47, { align: "right" });

    // Bill To
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

    // Items
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