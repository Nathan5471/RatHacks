import { User } from "@prisma/client";
import prisma from "../prisma/client";

export const createWorkshop = async (req: any, res: any) => {
  const { name, description, startDate, endDate } = req.body as {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const workshop = await prisma.workshop.create({
    data: { name, description, startDate, endDate, organizer: user.id },
  });
  res
    .status(201)
    .json({ message: "Workshop created successfully", id: workshop.id });
};
