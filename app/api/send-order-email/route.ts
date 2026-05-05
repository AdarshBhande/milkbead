import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ─── Gmail SMTP transporter ────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_SENDER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ─── Helpers ───────────────────────────────────────────────────────────────
function formatDate(iso?: string) {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function estimatedDelivery() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function itemsTable(items: any[]) {
  const rows = items
    .map(
      (item: any) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #FDE8F2;">
          <div style="font-family:sans-serif;font-weight:600;color:#333;font-size:14px;">${item.product?.name || "Product"}</div>
          <div style="font-family:sans-serif;color:#9ca3af;font-size:12px;">${item.product?.category || ""}</div>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #FDE8F2;text-align:center;font-family:sans-serif;color:#555;font-size:14px;">×${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #FDE8F2;text-align:right;font-family:sans-serif;font-weight:700;color:#333;font-size:14px;">₹${(item.product?.price ?? 0) * item.quantity}</td>
      </tr>`
    )
    .join("");
  return rows;
}

// ─── Customer confirmation email ───────────────────────────────────────────
function customerEmailHtml(data: any) {
  const { orderId, customerName, items, total, shipping, address, paymentMethod, paymentId, createdAt } = data;
  const orderDate = formatDate(createdAt);
  const delivery = estimatedDelivery();
  const subtotal = total - (shipping ?? 0);

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Order Confirmed – Milkbead</title></head>
<body style="margin:0;padding:0;background:#f9f0f5;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f0f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(248,200,220,0.15);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#F8C8DC 0%,#EFD9FF 100%);padding:40px 32px;text-align:center;">
            <div style="font-size:48px;margin-bottom:12px;">🌸</div>
            <h1 style="margin:0;font-size:28px;font-weight:900;color:#333;letter-spacing:-0.5px;">Order Confirmed!</h1>
            <p style="margin:8px 0 0;color:#666;font-size:15px;">Thank you for shopping with Milkbead 💖</p>
          </td>
        </tr>

        <!-- Success badge -->
        <tr>
          <td style="padding:0 32px;">
            <div style="margin:-20px auto 0;background:#fff;border:2px solid #F8C8DC;border-radius:16px;padding:16px 24px;display:flex;align-items:center;gap:12px;max-width:480px;box-shadow:0 2px 12px rgba(248,200,220,0.2);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;width:40px;">
                    <div style="width:40px;height:40px;background:#F8C8DC;border-radius:50%;text-align:center;line-height:40px;font-size:20px;">✓</div>
                  </td>
                  <td style="padding-left:12px;vertical-align:middle;">
                    <div style="font-weight:700;color:#333;font-size:14px;">Order #${orderId}</div>
                    <div style="color:#9ca3af;font-size:12px;">${orderDate}</div>
                  </td>
                  <td style="text-align:right;vertical-align:middle;">
                    <div style="background:${paymentMethod === "cod" ? "#FEF9C3" : "#DCFCE7"};color:${paymentMethod === "cod" ? "#854D0E" : "#166534"};font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;">
                      ${paymentMethod === "cod" ? "💵 Cash on Delivery" : "✅ Paid Online"}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:32px;">

          <!-- Hello message -->
          <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">
            Hey <strong style="color:#333;">${customerName}</strong>! 🎀<br>
            Your order has been placed successfully and is being prepared with love.<br>
            We'll notify you once it's on its way!
          </p>

          <!-- Items table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #FDE8F2;border-radius:12px;overflow:hidden;margin-bottom:20px;">
            <tr style="background:#FDE8F2;">
              <th style="padding:10px 12px;text-align:left;font-size:12px;color:#666;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Product</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;color:#666;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;color:#666;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Price</th>
            </tr>
            ${itemsTable(items)}
            <!-- Subtotal -->
            <tr style="background:#fafafa;">
              <td colspan="2" style="padding:10px 12px;font-size:13px;color:#666;font-family:sans-serif;">Subtotal</td>
              <td style="padding:10px 12px;text-align:right;font-size:13px;color:#555;font-family:sans-serif;">₹${subtotal}</td>
            </tr>
            <tr style="background:#fafafa;">
              <td colspan="2" style="padding:10px 12px;font-size:13px;color:#666;font-family:sans-serif;">Shipping</td>
              <td style="padding:10px 12px;text-align:right;font-size:13px;color:${shipping === 0 ? "#22c55e" : "#555"};font-family:sans-serif;">${shipping === 0 ? "FREE 🎉" : "₹" + shipping}</td>
            </tr>
            <tr style="background:#F8C8DC20;">
              <td colspan="2" style="padding:12px;font-size:16px;font-weight:900;color:#333;font-family:sans-serif;">Total</td>
              <td style="padding:12px;text-align:right;font-size:16px;font-weight:900;color:#333;font-family:sans-serif;">₹${total}</td>
            </tr>
          </table>

          <!-- Delivery address -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr>
              <td width="50%" style="padding-right:8px;vertical-align:top;">
                <div style="background:#f9f0f5;border-radius:12px;padding:16px;">
                  <div style="font-size:12px;font-weight:700;color:#F0A0C0;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">📦 Delivery Address</div>
                  <div style="font-size:13px;color:#333;font-weight:600;">${address.name}</div>
                  <div style="font-size:13px;color:#555;">${address.line1}${address.line2 ? ", " + address.line2 : ""}</div>
                  <div style="font-size:13px;color:#555;">${address.city}, ${address.state} – ${address.pincode}</div>
                  <div style="font-size:13px;color:#555;">📞 ${address.phone}</div>
                </div>
              </td>
              <td width="50%" style="padding-left:8px;vertical-align:top;">
                <div style="background:#f9f0f5;border-radius:12px;padding:16px;">
                  <div style="font-size:12px;font-weight:700;color:#F0A0C0;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">🚚 Estimated Delivery</div>
                  <div style="font-size:13px;color:#333;font-weight:600;">3–7 Business Days</div>
                  <div style="font-size:13px;color:#555;">By ${delivery}</div>
                  ${paymentId ? `<div style="font-size:11px;color:#9ca3af;margin-top:8px;">Payment ID: ${paymentId}</div>` : ""}
                </div>
              </td>
            </tr>
          </table>

          <!-- CTA -->
          <div style="text-align:center;margin:28px 0 8px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" style="background:linear-gradient(135deg,#F8C8DC,#EFD9FF);color:#333;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:16px;display:inline-block;">
              Continue Shopping 🛍️
            </a>
          </div>

        </td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#fdf6fa;padding:24px 32px;text-align:center;border-top:1px solid #FDE8F2;">
            <div style="font-size:24px;margin-bottom:8px;">🌸</div>
            <p style="margin:0;font-size:13px;color:#9ca3af;">
              Questions? Email us at 
              <a href="mailto:milkbeads.store@gmail.com" style="color:#F0A0C0;text-decoration:none;">milkbeads.store@gmail.com</a>
            </p>
            <p style="margin:8px 0 0;font-size:12px;color:#c4b5c0;">Handmade with love in India 🇮🇳 · Milkbead</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Admin notification email ──────────────────────────────────────────────
function adminEmailHtml(data: any) {
  const { orderId, customerName, customerEmail, items, total, shipping, address, paymentMethod, paymentId, createdAt } = data;
  const orderDate = formatDate(createdAt);

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New Order – Milkbead Admin</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e293b,#334155);padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="font-size:22px;font-weight:900;color:#fff;">🛍️ New Order Received</div>
                  <div style="font-size:13px;color:#94a3b8;margin-top:4px;">${orderDate}</div>
                </td>
                <td style="text-align:right;">
                  <div style="background:${paymentMethod === "cod" ? "#fbbf24" : "#22c55e"};color:#fff;font-size:12px;font-weight:700;padding:6px 14px;border-radius:20px;display:inline-block;">
                    ${paymentMethod === "cod" ? "💵 COD" : "✅ PAID"}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr><td style="padding:28px 32px;">

          <!-- Order ID banner -->
          <div style="background:#F8C8DC20;border:1px solid #F8C8DC;border-radius:12px;padding:14px 20px;margin-bottom:24px;">
            <span style="font-size:13px;color:#666;">Order ID: </span>
            <span style="font-size:15px;font-weight:900;color:#333;">#${orderId}</span>
          </div>

          <!-- Customer info -->
          <div style="margin-bottom:24px;">
            <div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Customer Details</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#666;">Name</td>
                <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#333;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#666;">Email</td>
                <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#333;">${customerEmail}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#666;">Phone</td>
                <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#333;">${address.phone}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;font-size:13px;color:#666;">Address</td>
                <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#333;">${address.line1}${address.line2 ? ", " + address.line2 : ""}, ${address.city}, ${address.state} – ${address.pincode}</td>
              </tr>
            </table>
          </div>

          <!-- Payment -->
          <div style="margin-bottom:24px;">
            <div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Payment</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#666;">Method</td>
                <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#333;">${paymentMethod === "cod" ? "Cash on Delivery" : "Online (Razorpay)"}</td>
              </tr>
              ${paymentId ? `
              <tr>
                <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#666;">Payment ID</td>
                <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:600;color:#333;font-family:monospace;">${paymentId}</td>
              </tr>` : ""}
              <tr>
                <td style="padding:10px 16px;font-size:13px;color:#666;">Total Charged</td>
                <td style="padding:10px 16px;font-size:15px;font-weight:900;color:#333;">₹${total}</td>
              </tr>
            </table>
          </div>

          <!-- Order items -->
          <div>
            <div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">Order Items</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <tr style="background:#f3f4f6;">
                <th style="padding:10px 14px;text-align:left;font-size:12px;color:#666;font-weight:700;">Product</th>
                <th style="padding:10px 14px;text-align:center;font-size:12px;color:#666;font-weight:700;">Qty</th>
                <th style="padding:10px 14px;text-align:right;font-size:12px;color:#666;font-weight:700;">Amount</th>
              </tr>
              ${itemsTable(items)}
              <tr style="background:#f9fafb;">
                <td colspan="2" style="padding:10px 14px;font-size:13px;color:#666;">Shipping</td>
                <td style="padding:10px 14px;text-align:right;font-size:13px;color:#555;">${shipping === 0 ? "FREE" : "₹" + shipping}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding:12px 14px;font-size:15px;font-weight:900;color:#333;">Total</td>
                <td style="padding:12px 14px;text-align:right;font-size:15px;font-weight:900;color:#333;">₹${total}</td>
              </tr>
            </table>
          </div>

        </td></tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1e293b;padding:20px 32px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#64748b;">Milkbead Admin Notification · Sent from milkbeads.store@gmail.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── API Route Handler ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      customerEmail,
      customerName,
      items,
      total,
      shipping,
      address,
      paymentMethod,
      paymentId,
      createdAt,
    } = body;

    // Validate required fields
    if (!customerEmail || !orderId || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailData = { orderId, customerEmail, customerName, items, total, shipping, address, paymentMethod, paymentId, createdAt };

    // ── Send both emails in parallel ──────────────────────────────────────
    const [customerResult, adminResult] = await Promise.allSettled([
      // 1. Customer confirmation
      transporter.sendMail({
        from: `"Milkbead 🌸" <${process.env.GMAIL_SENDER}>`,
        to: customerEmail,
        subject: `✅ Order Confirmed! #${orderId} – Milkbead`,
        html: customerEmailHtml(emailData),
      }),

      // 2. Admin notification
      transporter.sendMail({
        from: `"Milkbead Orders" <${process.env.GMAIL_SENDER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🛍️ New Order #${orderId} – ₹${total} (${paymentMethod === "cod" ? "COD" : "Paid"})`,
        html: adminEmailHtml(emailData),
      }),
    ]);

    const results = {
      customer: customerResult.status === "fulfilled" ? "sent" : "failed",
      admin: adminResult.status === "fulfilled" ? "sent" : "failed",
    };

    if (customerResult.status === "rejected") {
      console.error("Customer email failed:", customerResult.reason);
    }
    if (adminResult.status === "rejected") {
      console.error("Admin email failed:", adminResult.reason);
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error("Email API error:", err);
    return NextResponse.json({ error: err.message || "Failed to send emails" }, { status: 500 });
  }
}
