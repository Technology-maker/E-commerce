import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const userSupportMail = async (name, email, subject, number, message) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Support Form" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER,
        replyTo: email,
        subject: subject,
        text: `
📩 New Support Message

👤 Name: ${name}
📧 Email: ${email}
📱 Number: ${number}

💬 Message: ${message}
        `,
    };

    await transporter.sendMail(mailOptions);
};

export default userSupportMail;
