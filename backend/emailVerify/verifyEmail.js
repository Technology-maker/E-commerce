import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmail = async (token, email) => {
    if (!token || !email) {
        throw new Error("Token or email missing");
    }

    const verifyLink = `https://e-commerce-app-mu-flax.vercel.app/verify/${token}`;

    const { data, error } = await resend.emails.send({
        from: "Support <noreply@satenderyadav.xyz>", // works instantly
        to: email,
        subject: "Verify your email",
        html: `
      <h2>Welcome 👋</h2>
      <p>Please click the button below to verify your email:</p>
      <a 
        href="${verifyLink}" 
        style="
          display:inline-block;
          padding:12px 20px;
          background:#ec4899;
          color:white;
          text-decoration:none;
          border-radius:6px;
          margin-top:10px;
        "
      >
        Verify Email
      </a>
      <p>If you didn’t sign up, ignore this email.</p>
    `,
    });

    if (error) {
        console.error("RESEND FULL ERROR:", error);
        throw new Error(error.message);
    }


    console.log("✅ Email sent via Resend:", data);
    return data;
};
