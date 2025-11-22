import axios from "axios";

interface sendPlacingParams {
  firstName: string;
  ranking: 1 | 2 | 3;
  eventName: string;
  projectName: string;
  feedbackLink: string;
  email: string;
}

export default async function sendPlacingEmail({
  firstName,
  ranking,
  eventName,
  projectName,
  feedbackLink,
  email,
}: sendPlacingParams) {
  const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
  const LOOPS_PLACING_TEMPLATE_ID = process.env.LOOPS_PLACING_TEMPLATE_ID;
  const LOOPS_API_URL = "https://app.loops.so/api/v1/transactional";

  if (!LOOPS_API_KEY || !LOOPS_PLACING_TEMPLATE_ID) {
    throw new Error("Missing Loops configuration in environment variables");
  }

  try {
    await axios.post(
      LOOPS_API_URL,
      {
        email,
        transactionalId: LOOPS_PLACING_TEMPLATE_ID,
        dataVariables: {
          firstName,
          placement: ranking === 1 ? "1st" : ranking === 2 ? "2nd" : "3rd",
          eventName,
          projectName,
          feedbackLink,
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
