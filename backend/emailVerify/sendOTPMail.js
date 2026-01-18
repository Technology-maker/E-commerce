import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

export const sendOTPMail = async (otp, email) => {
    try {
        if (!email) {
            throw new Error("Email is missing");
        }

        const mailConfigurations = {
            from: `"Support Team" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Password Reset OTP",
            html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset Request</h2>
          <p>Your OTP for resetting your password is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for <b>10 minutes</b>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailConfigurations);

        console.log("✅ OTP sent successfully");
        console.log("📩 Message ID:", info.messageId);

        return info;
    } catch (error) {
        console.error("❌ OTP email error:", error.message);
        throw new Error("Failed to send OTP email");
    }
};
