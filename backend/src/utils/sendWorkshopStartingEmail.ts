import axios from "axios";

interface sendWorkshopStartingEmailParams {
  senderName: string;
  emailName: string;
  workshopName: string;
  email: string;
  firstName: string;
  meetingURL: string;
}

export default async function sendWorkshopStartingEmail({
  senderName,
  emailName,
  workshopName,
  email,
  firstName,
  meetingURL,
}: sendWorkshopStartingEmailParams) {
  const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
  const LOOPS_WORKSHOP_STARTING_TEMPLATE_ID =
    process.env.LOOPS_WORKSHOP_STARTING_TEMPLATE_ID;
  const LOOPS_API_URL = "https://app.loops.so/api/v1/transactional";

  if (!LOOPS_API_KEY || !LOOPS_WORKSHOP_STARTING_TEMPLATE_ID) {
    throw new Error("Missing Loops configuration in environment variables");
  }

  try {
    await axios.post(
      LOOPS_API_URL,
      {
        email,
        transactionalId: LOOPS_WORKSHOP_STARTING_TEMPLATE_ID,
        dataVariables: {
          senderName,
          emailName,
          workshopName,
          firstName,
          meetingURL,
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
