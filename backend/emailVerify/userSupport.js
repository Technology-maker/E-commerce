import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const userSupportMail = async (name, email, subject, number, message) => {
    try {
        // Validate required environment variables
        if (!process.env.MAIL_USER) {
            console.error("❌ MAIL_USER environment variable is not set");
            throw new Error("Email sender address not configured in environment variables");
        }

        if (!process.env.MAIL_PASS) {
            console.error("❌ MAIL_PASS environment variable is not set");
            throw new Error("Email password not configured in environment variables");
        }

        console.log("✅ Email credentials found. Initializing transporter...");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            logger: true,
            debug: true,
        });

        const mailOptions = {
            from: `"Support Form" <${process.env.MAIL_USER}>`,
            to: process.env.MAIL_USER,
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
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully. Message ID:", result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error("❌ Email sending failed:", error.message);
        console.error("Error details:", error);
        throw error;
    }
};

export default userSupportMail;
