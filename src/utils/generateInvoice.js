import html2pdf from 'html2pdf.js';

export const downloadInvoice = (order) => {
    // 1. Define the Invoice HTML Structure (Inline Styles for PDF consistency)
    const element = document.createElement('div');
    element.innerHTML = `
        <div style="padding: 40px; font-family: 'Helvetica', sans-serif; color: #333; background: #fff;">
            
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px;">
                <div>
                    <h1 style="font-size: 32px; margin: 0; color: #000;">INVOICE</h1>
                    <p style="font-size: 12px; color: #666; margin: 5px 0;">WefPro Foods Pvt Ltd.</p>
                    <p style="font-size: 12px; color: #666; margin: 0;">Mahabaleshwar, Maharashtra, 412806</p>
                    <p style="font-size: 12px; color: #666; margin: 0;">GSTIN: 27AABCU9603R1Z</p>
                </div>
                <div style="text-align: right;">
                    <h2 style="font-size: 18px; color: #dc2626; margin: 0;">#${order.invoiceId}</h2>
                    <p style="font-size: 12px; color: #666; margin: 5px 0;">Date: ${order.date}</p>
                </div>
            </div>

            <div style="margin-bottom: 40px;">
                <p style="font-size: 10px; text-transform: uppercase; color: #999; font-weight: bold; margin-bottom: 5px;">Billed To</p>
                <h3 style="font-size: 16px; margin: 0 0 5px 0;">${order.customerName}</h3>
                <p style="font-size: 14px; margin: 0; color: #555;">${order.address}, ${order.city} - ${order.pincode}</p>
                <p style="font-size: 14px; margin: 5px 0 0 0; color: #555;">Phone: ${order.phone}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background: #f9fafb; color: #666; font-size: 12px; text-transform: uppercase;">
                        <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee;">Item</th>
                        <th style="padding: 12px; text-align: center; border-bottom: 1px solid #eee;">Qty</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">Price</th>
                        <th style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px;">${item.name}</td>
                            <td style="padding: 12px; text-align: center; border-bottom: 1px solid #eee; font-size: 14px;">${item.qty}</td>
                            <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee; font-size: 14px;">₹${item.price}</td>
                            <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee; font-size: 14px;">₹${item.price * item.qty}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div style="display: flex; justify-content: flex-end;">
                <div style="width: 250px; text-align: right;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; color: #666;">
                        <span>Subtotal</span>
                        <span>₹${order.amount - (order.amount > 499 ? 0 : 40)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #666;">
                        <span>Shipping</span>
                        <span>${order.amount > 499 ? "Free" : "₹40"}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px;">
                        <span>Total</span>
                        <span>₹${order.amount}</span>
                    </div>
                </div>
            </div>

            <div style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; display: flex; justify-content: space-between;">
                <span>Thank you for choosing WefPro.</span>
                <span>Tracking Ref: <b>${order.awb}</b></span>
            </div>
        </div>
    `;

    // 2. Configure PDF Options
    const opt = {
        margin:       0,
        filename:     `Invoice_${order.invoiceId}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 3. Generate and Save
    html2pdf().from(element).set(opt).save();
};