import { User } from "@prisma/client";
import prisma from "../prisma/client";

export const createProject = async (req: any, res: any) => {
  const { name, description, codeURL, demoURL, eventId } = req.body as {
    name: string;
    description: string;
    codeURL: string | null;
    demoURL: string | null;
    eventId: string;
  };
  const user = req.user as User;
  const screenshot = req.screenshot as string | null;
  const video = req.video as string | null;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const team = await prisma.team.findFirst({
      where: {
        members: { has: user.id },
        eventId: event.id,
      },
    });
    if (!team) {
      return res
        .status(403)
        .json({ message: "User is not part of any team for this event" });
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        codeURL,
        demoURL,
        screenshotPath: screenshot,
        videoPath: video,
        eventId: event.id,
        teamId: team.id,
      },
    });
    return res
      .status(201)
      .json({
        message: "Project created successfully",
        projectId: newProject.id,
      });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Failed to create project" });
  }
};
