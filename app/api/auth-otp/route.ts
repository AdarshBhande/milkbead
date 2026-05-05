import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_SENDER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function otpEmailHtml(otp: string, name: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Verify Your Email – Milkbead</title></head>
<body style="margin:0;padding:0;background:#f9f0f5;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f0f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(248,200,220,0.2);">

        <tr>
          <td style="background:linear-gradient(135deg,#F8C8DC 0%,#EFD9FF 100%);padding:36px 32px;text-align:center;">
            <div style="font-size:52px;margin-bottom:10px;">✨</div>
            <h1 style="margin:0;font-size:26px;font-weight:900;color:#333;">Verify your email</h1>
            <p style="margin:8px 0 0;color:#666;font-size:14px;">Hi ${name}! Enter this code to complete your signup 🌸</p>
          </td>
        </tr>

        <tr>
          <td style="padding:36px 32px;text-align:center;">
            <p style="margin:0 0 20px;font-size:14px;color:#666;">Your one-time verification code is:</p>

            <!-- OTP Box -->
            <div style="display:inline-block;background:linear-gradient(135deg,#FDE8F2,#EFD9FF);border-radius:20px;padding:24px 48px;margin-bottom:24px;">
              <div style="font-size:44px;font-weight:900;color:#333;letter-spacing:10px;font-family:monospace;">${otp}</div>
            </div>

            <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">This code expires in <strong style="color:#333;">10 minutes</strong></p>
            <p style="margin:0;font-size:12px;color:#c4b5c0;">If you didn't request this, you can safely ignore this email.</p>
          </td>
        </tr>

        <tr>
          <td style="background:#fdf6fa;padding:20px 32px;text-align:center;border-top:1px solid #FDE8F2;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">Milkbead · Handmade with love in India 🇮🇳</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// POST /api/auth-otp  →  action: "send" | "verify"
export async function POST(req: NextRequest) {
  try {
    const { action, email, name, otp } = await req.json();

    if (action === "send") {
      // Generate & store OTP
      const code = generateOTP();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      await setDoc(doc(db, "otps", email), {
        code,
        expiresAt,
        createdAt: serverTimestamp(),
      });

      // Send email
      await transporter.sendMail({
        from: `"Milkbead 🌸" <${process.env.GMAIL_SENDER}>`,
        to: email,
        subject: "🌸 Your Milkbead Verification Code",
        html: otpEmailHtml(code, name || "there"),
      });

      return NextResponse.json({ success: true, message: "OTP sent" });
    }

    if (action === "verify") {
      const docRef = doc(db, "otps", email);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        return NextResponse.json({ success: false, error: "OTP not found. Please request a new one." }, { status: 400 });
      }

      const data = snap.data();

      if (Date.now() > data.expiresAt) {
        await deleteDoc(docRef);
        return NextResponse.json({ success: false, error: "OTP has expired. Please request a new one." }, { status: 400 });
      }

      if (data.code !== otp.trim()) {
        return NextResponse.json({ success: false, error: "Incorrect OTP. Please try again." }, { status: 400 });
      }

      // Valid — delete OTP so it can't be reused
      await deleteDoc(docRef);
      return NextResponse.json({ success: true, message: "OTP verified" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("OTP API error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
