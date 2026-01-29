import nodemailer from "nodemailer"
import "dotenv/config"

export const verifyEmail = async (token, email) => {
    try {
        if (!token || !email) {
            throw new Error("Token or email is missing")
        }

        const verifyLink = `${process.env.CLIENT_URL}/verify/${token}`

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        const mailConfigurations = {
            from: `"Support Team" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Email Verification",
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6">
                <h2>Email Verification</h2>
                <p>Hi there 👋</p>
                <p>You recently signed up. Please verify your email by clicking the button below:</p>
                <a 
                  href="${verifyLink}" 
                  style="
                    display: inline-block;
                    padding: 10px 16px;
                    background-color: #ec4899;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 6px;
                    margin-top: 10px;
                  "
                >
                  Verify Email
                </a>
                <p style="margin-top: 20px; font-size: 12px; color: #666">
                  This link will expire in 10 minutes.
                </p>
              </div>
            `
        }

        const info = await transporter.sendMail(mailConfigurations)

        console.log("✅ Email sent successfully")
        console.log("📩 Message ID:", info.messageId)

        return info

    } catch (error) {
        console.error("❌ Error sending verification email:", error.message)
        throw new Error("Failed to send verification email")
    }
}
