import nodemailer from "nodemailer"
import "dotenv/config"

export const verifyEmail = async (token, email) => {
    try {
        if (!token || !email) {
            throw new Error("Token or email is missing");

        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const mailConfigurations = {

            //Kon Bhej Raha h  
            from: `"Support Team" <${process.env.MAIL_USER}>`,

            //Kisko Bhej Raha h 
            to: email,

            // Subject of Email
            subject: 'Email Verification',

            // This would be the text of email body
            text: `
Hi! There, You have recently visited 
our website and entered your email.
Please follow the given link to verify your email
http://localhost:5173/verify/${token}
Thanks`
        };


        const info = await transporter.sendMail(mailConfigurations);

        console.log("✅ Email sent successfully");
        console.log("📩 Message ID:", info.messageId);

        return info;


    } catch (error) {
        console.error("❌ Error sending verification email:", error.message);

        // Re-throw so controller can handle it
        throw new Error("Failed to send verification email");
    }
}









