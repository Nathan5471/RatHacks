import axios from "axios";

interface sendCustomEmailParams {
  messageBody: string;
  messageSubject: string;
  senderName: string;
  senderEmail: string;
  email: string;
}

export default async function sendCustomEmail({
  messageBody,
  messageSubject,
  senderName,
  senderEmail,
  email,
}: sendCustomEmailParams) {
  const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
  const LOOPS_CUSTOM_TEMPLATE_ID = process.env.LOOPS_CUSTOM_TEMPLATE_ID;
  const LOOPS_API_URL = "https://app.loops.so/api/v1/transactional";

  if (!LOOPS_API_KEY || !LOOPS_CUSTOM_TEMPLATE_ID) {
    throw new Error("Missing Loops configuration in environment variables");
  }

  try {
    await axios.post(
      LOOPS_API_URL,
      {
        email,
        transactionalId: LOOPS_CUSTOM_TEMPLATE_ID,
        dataVariables: {
          messageBody,
          messageSubject,
          senderName,
          senderEmail,
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
    console.log("Error sending workshop starting email:", error);
  }
}
