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
  <div style="
    max-width:520px;
    margin:0 auto;
    padding:32px 28px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background:#ffffff;
    color:#111827;
    border-radius:12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  ">

    <h2 style="
      margin:0 0 12px;
      font-size:24px;
      font-weight:600;
    ">
      Welcome to E-commerce 👋
    </h2>

    <p style="
      margin:0 0 20px;
      font-size:15px;
      line-height:1.6;
      color:#4b5563;
    ">
      We’re excited to have you on board.  
      Please confirm your email address to activate your account and get started.
    </p>

    <a 
      href="${verifyLink}" 
      style="
        display:inline-block;
        padding:14px 28px;
        background:linear-gradient(135deg, #ec4899, #db2777);
        color:#ffffff;
        text-decoration:none;
        font-size:15px;
        font-weight:600;
        border-radius:999px;
        margin:20px 0;
      "
    >
      Verify Email
    </a>

    <p style="
      margin:20px 0 0;
      font-size:13px;
      color:#6b7280;
    ">
      If you didn’t create an account, you can safely ignore this email.
    </p>

    <hr style="
      margin:28px 0;
      border:none;
      border-top:1px solid #e5e7eb;
    " />

    <p style="
      margin:0;
      font-size:12px;
      color:#9ca3af;
    ">
      This link will expire for security reasons.
      <br />
      © 2026 E-commerce. All rights reserved.
    </p>

  </div>
`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
