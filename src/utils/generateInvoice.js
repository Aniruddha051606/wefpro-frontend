import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const downloadInvoice = (order) => {
  const doc = new jsPDF();
  
  // Header - Brand Identity
  doc.setFontSize(22);
  doc.setTextColor(220, 38, 38); // Wefpro Red
  doc.text("WEFPRO", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Handcrafted in Mahabaleshwar", 14, 28);
  doc.text("FSSAI Lic No: 21525039001364", 14, 33); // Placeholder
  
  // Right Side - Invoice Info
  doc.setTextColor(0);
  doc.text(`Invoice No: ${order.invoiceId || 'INV-001'}`, 140, 20);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 25);
  doc.text(`Order ID: ${order.orderId}`, 140, 30);

  // Billing Details
  doc.line(14, 40, 195, 40);
  doc.setFont(undefined, 'bold');
  doc.text("BILL TO:", 14, 50);
  doc.setFont(undefined, 'normal');
  doc.text(order.customerName, 14, 55);
  doc.text(order.phoneNumber || order.phone, 14, 60);
  doc.text(order.address, 14, 65, { maxWidth: 80 });

  // Items Table
  const tableData = order.items.map(item => [
    item.name,
    `INR ${item.price}`,
    item.quantity || item.qty,
    `INR ${(item.price * (item.quantity || item.qty))}`
  ]);

  doc.autoTable({
    startY: 80,
    head: [['Product', 'Price', 'Qty', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38] }
  });

  // Summary
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont(undefined, 'bold');
  doc.text(`Grand Total: INR ${order.totalAmount || order.amount}`, 140, finalY);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Thank you for supporting handcrafted products!", 105, 280, { align: "center" });

  doc.save(`Invoice_${order.orderId}.pdf`);
};