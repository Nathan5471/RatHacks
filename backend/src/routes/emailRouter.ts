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
  activateEmail,
  deactivateEmail,
  createEmailList,
  updateEmailList,
  deleteEmailList,
  getAllEmailLists,
  joinEmailList,
  leaveEmailList,
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

router.post("/create-list", authenticate, async (req: any, res: any) => {
  const { name, description } = req.body as {
    name: string;
    description?: string;
  };

  if (!name) {
    return res.status(400).json({ message: "Email list name is required" });
  }

  await createEmailList(req, res);
});

router.put("/update-list/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const { name } = req.body as {
    name: string;
    description?: string;
  };

  if (!id) {
    return res.status(400).json({ message: "Email list ID is required" });
  }
  if (!name) {
    return res.status(400).json({ message: "Email list name is required" });
  }

  await updateEmailList(req, res);
});

router.delete("/delete-list/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };

  if (!id) {
    return res.status(400).json({ message: "Email list ID is required" });
  }

  await deleteEmailList(req, res);
});

router.get("/lists", getAllEmailLists);

router.post("/join-list/:id", async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const { email, code } = req.body as {
    email: string;
    code: string;
  };

  if (!id) {
    return res.status(400).json({ message: "Email list ID is required" });
  }
  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required" });
  }

  await joinEmailList(req, res);
});

router.post("/leave-list/:id", async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const { email, code } = req.body as {
    email: string;
    code: string;
  };

  if (!id) {
    return res.status(400).json({ message: "Email list ID is required" });
  }
  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required" });
  }

  await leaveEmailList(req, res);
});

export default router;
