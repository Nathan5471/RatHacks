import axios from "axios";
import { formatDate } from "date-fns";

interface sendOrganizerInviteEmailParams {
  token: string;
  email: string;
  expiration: Date;
}

export default async function sendOrganizerInviteEmail({
  token,
  email,
  expiration,
}: sendOrganizerInviteEmailParams) {
  const LOOPS_API_KEY = process.env.LOOPS_API_KEY;
  const LOOPS_ORGANIZER_INVITE_TEMPLATE_ID =
    process.env.LOOPS_ORGANIZER_INVITE_TEMPLATE_ID;
  const LOOPS_API_URL = "https://app.loops.so/api/v1/transactional";
  const FRONTEND_URL = process.env.FRONTEND_URL;

  if (!LOOPS_API_KEY || !LOOPS_ORGANIZER_INVITE_TEMPLATE_ID) {
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
        transactionalId: LOOPS_ORGANIZER_INVITE_TEMPLATE_ID,
        dataVariables: {
          token,
          expirationDate: `${formatDate(
            expiration,
            "EEEE, MMMM d yyyy h:mm a"
          )}`,
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
    console.error("Error sending organizer invitation email:", error);
  }
}
