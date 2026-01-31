import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const userSupportMail = async (name, email, subject, number, message) => {
    try {
        // Validate required environment variables
        if (!process.env.RESEND_API_KEY) {
            console.error("❌ RESEND_API_KEY environment variable is not set");
            throw new Error("Resend API key not configured in environment variables");
        }

        console.log("✅ Resend API key found. Sending email...");

        const resend = new Resend(process.env.RESEND_API_KEY);

        const result = await resend.emails.send({
            from: process.env.MAIL_USER || "onboarding@resend.dev",
            to: process.env.MAIL_USER || "delivered@resend.dev",
            replyTo: email,
            subject: `[SUPPORT] ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                    <div style="background: white; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #333;">📩 New Support Message</h2>
                        <hr style="border: none; border-top: 1px solid #ddd;">
                        <p><strong>👤 Name:</strong> ${name}</p>
                        <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p><strong>📱 Number:</strong> ${number || 'Not provided'}</p>
                        <hr style="border: none; border-top: 1px solid #ddd;">
                        <p><strong>💬 Message:</strong></p>
                        <p style="white-space: pre-wrap; background: #f9f9f9; padding: 10px; border-left: 4px solid #007bff;">${message}</p>
                    </div>
                </div>
            `,
        });

        if (result.error) {
            console.error("❌ Resend API error:", result.error);
            throw new Error(result.error.message || "Failed to send email via Resend");
        }

        console.log("✅ Email sent successfully via Resend. ID:", result.data.id);
        return { success: true, messageId: result.data.id };
    } catch (error) {
        console.error("❌ Email sending failed:", error.message);
        console.error("Error details:", error);
        throw error;
    }
};

export default userSupportMail;
