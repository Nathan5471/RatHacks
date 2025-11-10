import express from "express";
import {
  createWorkshop,
  joinWorkshop,
  leaveWorkshop,
  addGoogleMeetURL,
  endWorkshop,
  updateWorkshop,
  getAllWorkshops,
  organizerGetAllWorkshops,
  getWorkshopById,
  organizerGetWorkshopById,
  deleteWorkshop,
} from "../controllers/workshopController";

import authenticate from "../middleware/authenticate";
import {
  createEmail,
  organizerGetAllEmails,
  organizerGetEmailById,
  deleteEmail,
  updateEmail,
} from "../controllers/emailController";

const router = express.Router();

router.post("/create", authenticate, async (req: any, res: any) => {
  const { name, messageSubject, messageBody, sendAll, filterBy, subFilterBy } =
    req.body as {
      name: string;
      messageSubject: string;
      messageBody: string;
      sendAll: boolean;
      filterBy: string | null;
      subFilterBy: string | null;
    };

  if (!name || !messageSubject || !messageBody) {
    console.log("fields weren't filled");
    return res
      .status(400)
      .json({ message: "Verify message fields are filled" });
  }

  await createEmail(req, res);
});

router.put("/update/:id", authenticate, async (req: any, res: any) => {
  const { id } = req.params as { id: string };
  const { name, messageSubject, messageBody, sendAll, filterBy, subFilterBy } =
    req.body as {
      name: string;
      messageSubject: string;
      messageBody: string;
      sendAll: boolean;
      filterBy: string | null;
      subFilterBy: string | null;
    };

  if (!name || !messageSubject || !messageBody) {
    console.log("fields weren't filled");
    return res
      .status(400)
      .json({ message: "Verify message fields are filled" });
  }

  await updateEmail(req, res);
});

router.get("/all", authenticate, getAllWorkshops);

router.get("/organizer-all", authenticate, organizerGetAllEmails);

// router.get("/get/:id", authenticate, async (req: any, res: any) => {
//   const { id } = req.params as { id: string };

//   if (!id) {
//     return res.status(400).json({ message: "Email ID is required" });
//   }

//   await getEmailById(req, res);
// });

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
