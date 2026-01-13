import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // 1. Change this import

export const downloadInvoice = (order) => {
  // 🛡️ Safety: Stop if no data
  if (!order) return alert("Error: Order data is missing!");

  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(220, 38, 38); 
    doc.text("WEFPRO", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Handcrafted in Mahabaleshwar", 14, 28);
    doc.text("FSSAI Lic No: 215XXXXXXXXXXX", 14, 33); 
    
    // Invoice Info
    doc.setTextColor(0);
    doc.text(`Invoice No: ${order.invoiceId || 'INV-GEN'}`, 140, 20);
    doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`, 140, 25);
    doc.text(`Order ID: ${order.orderId}`, 140, 30);

    // Billing Details
    doc.line(14, 40, 195, 40);
    doc.setFont(undefined, 'bold');
    doc.text("BILL TO:", 14, 50);
    doc.setFont(undefined, 'normal');
    
    // 🛡️ Safe Strings
    doc.text(String(order.customerName || 'Guest'), 14, 55);
    doc.text(String(order.phoneNumber || order.phone || 'No Phone'), 14, 60);
    
    // Handle Address Wrapping safely
    const safeAddress = String(order.address || 'Address not provided');
    const addressLines = doc.splitTextToSize(safeAddress, 80);
    doc.text(addressLines, 14, 65);

    // Items Table
    const tableData = (order.items || []).map(item => [
      item.name,
      `INR ${item.price}`,
      item.quantity || item.qty || 1,
      `INR ${(item.price * (item.quantity || item.qty || 1))}`
    ]);

    // 2. 🟢 FIX: Call autoTable() directly instead of doc.autoTable()
    autoTable(doc, {
      startY: 85,
      head: [['Product', 'Price', 'Qty', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] }
    });

    // Summary
    // Note: use doc.lastAutoTable.finalY access via the imported object if needed, 
    // but usually the plugin attaches 'lastAutoTable' to doc state correctly.
    const finalY = (doc.lastAutoTable?.finalY || 85) + 10;
    
    doc.setFont(undefined, 'bold');
    doc.text(`Grand Total: INR ${order.totalAmount || order.amount || 0}`, 140, finalY);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Thank you for supporting handcrafted products!", 105, 280, { align: "center" });

    doc.save(`Invoice_${order.orderId}.pdf`);
  } catch (err) {
    console.error("PDF Gen Error:", err);
    alert("Could not generate PDF. Check console for details.");
  }
};