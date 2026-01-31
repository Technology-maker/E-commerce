import { Resend } from "resend";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
    try {
        if (!email) {
            throw new Error("Email is missing");
        }

        if (!process.env.RESEND_API_KEY) {
            console.error("❌ RESEND_API_KEY environment variable is not set");
            throw new Error("Resend API key not configured in environment variables");
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        // Determine sender. If MAIL_USER is a common free domain, fallback to onboarding@resend.dev
        const configuredFrom = process.env.MAIL_USER;
        let fromEmail = configuredFrom || "onboarding@resend.dev";
        if (configuredFrom) {
            const domain = configuredFrom.split("@")[1] || "";
            const freeDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];
            if (freeDomains.includes(domain.toLowerCase())) {
                console.warn(`Unverified free email domain used as MAIL_USER (${configuredFrom}); using onboarding@resend.dev as sender.`);
                fromEmail = "onboarding@resend.dev";
            }
        }

        const result = await resend.emails.send({
            from: fromEmail,
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
        });

        if (result.error) {
            console.error("❌ Resend API error:", result.error);
            throw new Error(result.error.message || "Failed to send OTP via Resend");
        }

        console.log("✅ OTP sent successfully via Resend");
        console.log("📩 Message ID:", result.data?.id || result.id);

        return result;
    } catch (error) {
        console.error("❌ OTP email error:", error.message || error);
        throw new Error("Failed to send OTP email");
    }
};
