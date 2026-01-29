import nodemailer from "nodemailer"
import "dotenv/config"

export const verifyEmail = async (token, email) => {
    try {
        if (!token || !email) {
            throw new Error("Token or email is missing");

        }

        const verifyLink = `https://e-commerce-app-mu-flax.vercel.app/verify/${token}` || `https://e-commerce-app-git-main-technology-makers-projects.vercel.app/verify/${token}` || `http://localhost:5173/verify/${token}`

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            service: 'gmail',
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
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
${verifyLink}
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









