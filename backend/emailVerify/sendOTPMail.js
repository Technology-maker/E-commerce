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

        // Use configured MAIL_USER as sender when available (you verified satenderyadav.xyz).
        // If you still want to force the Resend onboarding sender, set FORCE_ONBOARDING_SEND=true.
        const configuredFrom = process.env.MAIL_USER ;
        let fromEmail = configuredFrom || "onboarding@resend.dev";
        if (configuredFrom && process.env.FORCE_ONBOARDING_SEND === "true") {
            console.warn("FORCE_ONBOARDING_SEND is true — using onboarding@resend.dev as sender instead of MAIL_USER.");
            fromEmail = "onboarding@resend.dev";
        }
        console.log(`Using sender: ${fromEmail}`);

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
