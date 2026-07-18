import express from "express";
import authenticate from "../middleware/authenticate";
import {
  createEmail,
  organizerGetAllEmails,
  organizerGetEmailById,
  deleteEmail,
  updateEmail,
  getRecipientsByFilter,
  getAllRecipients,
  sendEmail,
  sendEmailToCustomRecipients,
  sendTestEmail,
  activateEmail,
  deactivateEmail,
} from "../controllers/emailController";

const router = express.Router();

router.post("/create", authenticate, async (req: any, res: any) => {
  const {
    name,
    messageSubject,
    messageBody,
    sendAll,
    filterBy,
    subFilterBy,
    sendOnJoin,
  } = req.body as {
    name: string;
    messageSubject: string;
    messageBody: string;
    sendAll: boolean;
    filterBy: string | null;
    subFilterBy: string | null;
    sendOnJoin: boolean | null;
  };

  if (!name || !messageSubject || !messageBody) {
    return res
      .status(400)
      .json({ message: "Verify message fields are filled" });
  }

  if (!sendAll && filterBy && !subFilterBy && sendOnJoin === null) {
    return res
      .status(400)
      .json({ message: "Both filter fields must be filled" });
  }

  await createEmail(req, res);
});

router.put("/update/:id", authenticate, async (req: any, res: any) => {
  const {
    name,
    messageSubject,
    messageBody,
    sendAll,
    filterBy,
    subFilterBy,
    sendOnJoin,
  } = req.body as {
    name: string;
    messageSubject: string;
    messageBody: string;
    sendAll: boolean;
    filterBy: string | null;
    subFilterBy: string | null;
    sendOnJoin: boolean | null;
  };

  if (!name || !messageSubject || !messageBody) {
    return res
      .status(400)
      .json({ message: "Verify message fields are filled" });
  }

  if (!sendAll && filterBy && !subFilterBy && sendOnJoin === null) {
    return res
      .status(400)
      .json({ message: "Both filter fields must be filled" });
  }

  await updateEmail(req, res);
});

router.get("/organizer-all", authenticate, organizerGetAllEmails);

router.get("/receipient-all", authenticate, getAllRecipients);

router.get(
  "/receipient-by-filter/:filter/:id",
  authenticate,
  getRecipientsByFilter,
);

router.post("/send-email/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Email ID is required" });
  }

  await sendEmail(req, res);
});

router.post(
  "/send-email/:id/customRecipients",
  authenticate,
  async (req: any, res: any) => {
    const { id } = req.params as { id: string };
    const { recipients } = req.body as {
      recipients: { email: string; firstName: string; lastName: string }[];
    };

    if (!id) {
      return res.status(400).json({ message: "Email ID is required" });
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ message: "Recipients are required" });
    }

    let invalidRecipients = recipients.filter(
      (recipient) =>
        !recipient.email || !recipient.firstName || !recipient.lastName,
    );
    if (invalidRecipients.length > 0) {
      return res.status(400).json({
        message: "Each recipient must have an email, first name, and last name",
      });
    }

    await sendEmailToCustomRecipients(req, res);
  },
);

router.post("/send-test/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Email ID is required" });
  }

  await sendTestEmail(req, res);
});

router.post("/activate/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Email ID is required" });
  }

  await activateEmail(req, res);
});

router.post("/deactivate/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Email ID is required" });
  }

  await deactivateEmail(req, res);
});

router.get("/organizer/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Email ID is required" });
  }

  await organizerGetEmailById(req, res);
});

router.delete("/delete/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Email ID is required" });
  }

  await deleteEmail(req, res);
});

export default router;
