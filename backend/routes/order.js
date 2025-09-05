const express = require("express");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const { userAuth } = require("../middleware/auth");
require("dotenv").config();

const orderRouter = express.Router();
orderRouter.use(express.json());


orderRouter.post("/place", userAuth, async (req, res) => {
  try {
    const { items, total, userEmail } = req.body;

    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);

      // ✅ Send PDF response immediately
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=order.pdf");
      res.send(pdfBuffer);

      // ✅ Send Email in background
      sendInvoiceEmail(userEmail, pdfBuffer).catch((err) =>
        console.error("Email failed:", err)
      );
    });

    // ---------------- HEADER ----------------
    doc.fontSize(20).fillColor("#2E86C1").text("VegKart Invoice", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("black").text("Order Confirmation", { align: "center" });
    doc.moveDown(1);

    // Order Info
    const orderId = "ORD" + Date.now();
    const date = new Date().toLocaleDateString();
    doc.fontSize(12).text(`Order ID: ${orderId}`);
    doc.text(`Date: ${date}`);
    doc.moveDown(1);

    // ---------------- TABLE HEADERS ----------------
    const tableTop = doc.y;
    const startX = 50;
    const rowHeight = 25;

    doc.font("Helvetica-Bold");
    doc.text("Sl. No", startX, tableTop, { width: 50 });
    doc.text("Item", startX + 60, tableTop, { width: 200 });
    doc.text("Qty", startX + 270, tableTop, { width: 50 });
    doc.text("Price", startX + 330, tableTop, { width: 80 });
    doc.text("Total", startX + 420, tableTop, { width: 80 });

    doc.moveDown(0.5);
    doc.moveTo(startX, tableTop + 15).lineTo(500, tableTop + 15).stroke();

    // ---------------- TABLE ROWS ----------------
    doc.font("Helvetica");
    let currentY = tableTop + rowHeight;
    items.forEach((item, index) => {
      doc.text(index + 1, startX, currentY, { width: 50 });
      doc.text(item.name, startX + 60, currentY, { width: 200 });
      doc.text(item.quantity.toString(), startX + 270, currentY, { width: 50 });
      doc.text(`₹${item.price}`, startX + 330, currentY, { width: 80 });
      doc.text(`₹${item.price * item.quantity}`, startX + 420, currentY, { width: 80 });

      currentY += rowHeight;
    });

    // ---------------- GRAND TOTAL ----------------
    doc.moveTo(startX, currentY).lineTo(500, currentY).stroke();
    doc.font("Helvetica-Bold");
    doc.text("Grand Total", startX + 330, currentY + 10, { width: 80 });
    doc.text(`₹${total}`, startX + 420, currentY + 10, { width: 80 });

    // ---------------- FOOTER ----------------
    doc.moveDown(4);
    doc.fontSize(10).fillColor("gray").text(
      "Thank you for shopping with VegKart! For any queries, contact support@vegkart.com",
      { align: "center" }
    );

    doc.end();
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// 📌 Helper function: Send email with PDF
async function sendInvoiceEmail(userEmail, pdfBuffer) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "swapnasruthi2005@gmail.com",
    to: userEmail,
    subject: "Your VegKart Order Invoice",
    text: "Thanks for shopping with VegKart! Please find your invoice attached.",
    attachments: [{ filename: "order.pdf", content: pdfBuffer }],
  });
}

module.exports = orderRouter;
