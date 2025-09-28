import axios from "axios";

interface sendEmailVerificationEmailParams {
  email: string;
  token: string;
  firstName: string;
}

export default async function sendEmailVerificationEmail({
  email,
  token,
  firstName,
}: sendEmailVerificationEmailParams) {
  const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
  const LOOPS_EMAIL_VERIFICATION_TEMPLATE_ID =
    process.env.LOOPS_EMAIL_VERIFICATION_TEMPLATE_ID;
  const LOOPS_API_URL = "https://app.loops.so/api/v1/transactional";
  const FRONTEND_URL = process.env.FRONTEND_URL;

  if (!LOOPS_API_KEY || !LOOPS_EMAIL_VERIFICATION_TEMPLATE_ID) {
    throw new Error("Missing Loops configuration in environment variables");
  }

  if (!FRONTEND_URL) {
    throw new Error("Missing frontend URL in environment variables");
  }

  try {
    await axios.post(
      LOOPS_API_URL,
      {
        email,
        transactionalId: LOOPS_EMAIL_VERIFICATION_TEMPLATE_ID,
        dataVariables: {
          firstName,
          verificationLink: `${FRONTEND_URL}/verify-email?email=${encodeURIComponent(
            email
          )}&token=${encodeURIComponent(token)}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${LOOPS_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("Error sending verification email:", error);
  }
}
