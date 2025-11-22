import axios from "axios";

interface sendFeedbackParams {
  firstName: string;
  eventName: string;
  projectName: string;
  feedbackLink: string;
  email: string;
}

export default async function sendFeedbackEmail({
  firstName,
  eventName,
  projectName,
  feedbackLink,
  email,
}: sendFeedbackParams) {
  const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
  const LOOPS_FEEDBACK_TEMPLATE_ID = process.env.LOOPS_FEEDBACK_TEMPLATE_ID;
  const LOOPS_API_URL = "https://app.loops.so/api/v1/transactional";

  if (!LOOPS_API_KEY || !LOOPS_FEEDBACK_TEMPLATE_ID) {
    throw new Error("Missing Loops configuration in environment variables");
  }

  try {
    await axios.post(
      LOOPS_API_URL,
      {
        email,
        transactionalId: LOOPS_FEEDBACK_TEMPLATE_ID,
        dataVariables: {
          firstName,
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
