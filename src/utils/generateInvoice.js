import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadInvoice = (order) => {
  if (!order) return alert("Error: Order data is missing!");

  try {
    const doc = new jsPDF();
    
    // --- 🎨 DESIGN CONSTANTS ---
    const brandRed = [220, 38, 38];   // #dc2626
    const darkSlate = [15, 23, 42];   // #0f172a
    const lightGray = [248, 250, 252];// #f8fafc
    const textGray = [100, 116, 139]; // #64748b

    // 1. Top Border Line (Red Accent)
    doc.setDrawColor(...brandRed);
    doc.setLineWidth(2);
    doc.line(0, 0, 210, 0); // Full width line at top

    // 2. Header Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(...darkSlate);
    doc.text("WEFPRO", 14, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...textGray);
    doc.text("Handcrafted in Mahabaleshwar", 14, 32);
    doc.text("FSSAI Lic No: 215XXXXXXXXXXX", 14, 37);
    doc.text("support@wefpro.com", 14, 42);

    // 3. Invoice Details (Right Side)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...darkSlate);
    doc.text("INVOICE", 195, 25, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    doc.text(`${order.invoiceId || 'INV-PENDING'}`, 195, 32, { align: "right" });
    
    doc.setTextColor(...textGray);
    doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`, 195, 37, { align: "right" });
    doc.text(`Order Ref: ${order.orderId}`, 195, 42, { align: "right" });

    // 4. "Bill To" Box (Light Gray Background)
    doc.setFillColor(...lightGray);
    // x, y, width, height, style='F' (Fill)
    doc.rect(14, 55, 182, 35, 'F'); 

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...textGray);
    doc.text("BILL TO:", 20, 64); // Inside box

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(String(order.customerName || 'Guest').toUpperCase(), 20, 70);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...darkSlate);
    doc.text(String(order.phoneNumber || ''), 20, 75);
    
    // Address (Wrapped)
    const safeAddress = String(order.address || 'Address not provided');
    const addressLines = doc.splitTextToSize(safeAddress, 140);
    doc.text(addressLines, 20, 80);

    // 5. Items Table (Clean & Striped)
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
      theme: 'grid', // 'striped' or 'grid' or 'plain'
      styles: { 
        font: "helvetica", 
        fontSize: 10, 
        cellPadding: 6,
        lineColor: [230, 230, 230],
        lineWidth: 0.1,
      },
      headStyles: { 
        fillColor: brandRed, 
        textColor: 255, 
        fontStyle: 'bold',
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 'auto' }, // Item Name
        1: { halign: 'right', cellWidth: 30 }, // Price
        2: { halign: 'center', cellWidth: 20 }, // Qty
        3: { halign: 'right', cellWidth: 40, fontStyle: 'bold' } // Total
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250] // Very light gray stripe
      }
    });

    // 6. Totals Section
    const finalY = doc.lastAutoTable.finalY + 10;
    const safeTotal = parseFloat(order.totalAmount || order.amount || 0);
    
    // Draw a line above totals
    doc.setDrawColor(200, 200, 200);
    doc.line(120, finalY, 195, finalY);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    
    // Align Right logic
    doc.text(`Total Paid:   Rs. ${safeTotal.toLocaleString()}`, 195, finalY + 10, { align: "right" });

    // 7. Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(...textGray);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for your business!", 105, pageHeight - 20, { align: "center" });
    doc.text("For questions, email support@wefpro.com or visit wefpro.com", 105, pageHeight - 15, { align: "center" });

    // Save File
    doc.save(`Invoice_${order.orderId}.pdf`);
  } catch (err) {
    console.error("PDF Gen Error:", err);
    alert("Could not generate PDF. Check console for details.");
  }
};