import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const verifyEmail = async (token, email) => {
  if (!token || !email) {
    throw new Error("Token or email missing");
  }

  const verifyLink = `${process.env.CLIENT_URL}/verify/${token}`;

  const { data, error } = await resend.emails.send({
    from: "Support <onboarding@resend.dev>", // works instantly
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
    console.error("Resend error:", error);
    throw new Error("Failed to send verification email");
  }

  console.log("✅ Email sent via Resend:", data);
  return data;
};
