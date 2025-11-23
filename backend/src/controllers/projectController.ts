import { User } from "@prisma/client";
import prisma from "../prisma/client";
import { resolveSoa } from "dns";

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
    if (team.project) {
      return res.status(400).json({ message: "Team already has a project" });
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
    await prisma.team.update({
      where: { id: team.id },
      data: {
        project: newProject.id,
      },
    });
    return res.status(201).json({
      message: "Project created successfully",
      projectId: newProject.id,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Failed to create project" });
  }
};

export const submitProject = async (req: any, res: any) => {
  const { projectId } = req.params as { projectId: string };
  const user = req.user as User;

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const team = await prisma.team.findUnique({
      where: { id: project.teamId },
    });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    if (!team.members.includes(user.id)) {
      return res
        .status(403)
        .json({ message: "User is not part of the team for this project" });
    }

    if (project.submittedAt) {
      return res.status(400).json({ message: "Project already submitteded" });
    }
    if (!project.codeURL || !project.screenshotPath || !project.videoPath) {
      return res.status(400).json({
        message: "Code URL, Screenshot, and Video are required to submit",
      });
    }

    await prisma.project.update({
      where: { id: project.id },
      data: {
        submittedAt: new Date(),
        submittedBy: user.id,
      },
    });
    await prisma.team.update({
      where: { id: team.id },
      data: {
        submittedProject: true,
      },
    });
    await prisma.event.update({
      where: { id: project.eventId },
      data: {
        projects: { push: project.id },
      },
    });
    return res.status(200).json({ message: "Successfully submitted project" });
  } catch (error) {
    console.error("Error submitting project:", error);
    return res.status(500).json({ message: "Failed to submit project" });
  }
};

export const leaveFeedback = async (req: any, res: any) => {
  const { projectId } = req.params as { projectId: string };
  const {
    creativityScore,
    functionalityScore,
    technicalityScore,
    interfaceScore,
    feedback,
  } = req.body as {
    creativityScore: number;
    functionalityScore: number;
    technicalityScore: number;
    interfaceScore: number;
    feedback: string;
  };
  const user = req.user as User;

  if (user.accountType !== "judge") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const event = await prisma.event.findUnique({
      where: { id: project.eventId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.releasedJudging) {
      return res
        .status(400)
        .json({ message: "Judging has already been released" });
    }
    const existingFeedback = await prisma.judgeFeedback.findMany({
      where: {
        judgeId: user.id,
        projectId,
      },
    });
    if (existingFeedback.length > 0) {
      existingFeedback.forEach(async (feedback) => {
        await prisma.judgeFeedback.delete({
          where: { id: feedback.id },
        });
      });
    }
    await prisma.judgeFeedback.create({
      data: {
        judgeId: user.id,
        projectId,
        creativityScore,
        functionalityScore,
        technicalityScore,
        interfaceScore,
        feedback,
        totalScore:
          creativityScore +
          functionalityScore +
          technicalityScore +
          interfaceScore,
      },
    });
    return res.status(201).json({ message: "Successfully left feedback" });
  } catch (error) {
    console.error("Error leaving feedback:", error);
    return res.status(500).json({ message: "Failed to leave feedback" });
  }
};

export const updateProject = async (req: any, res: any) => {
  const { projectId } = req.params as { projectId: string };
  const { name, description, codeURL, demoURL } = req.body as {
    name: string;
    description: string;
    codeURL: string | null;
    demoURL: string | null;
  };
  const screenshot = req.screenshot as string | null;
  const video = req.video as string | null;
  const user = req.user as User;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.submittedAt) {
      return res
        .status(400)
        .json({ message: "Project can't be editted after being submitted" });
    }
    const team = await prisma.team.findUnique({
      where: { id: project.teamId },
    });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    if (!team.members.includes(user.id)) {
      return res
        .status(403)
        .json({ message: "User is not part of the team for this project" });
    }
    await prisma.project.update({
      where: { id: project.id },
      data: {
        name,
        description,
        codeURL,
        demoURL,
      },
    });
    if (screenshot) {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          screenshotPath: screenshot,
        },
      });
    }
    if (video) {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          videoPath: video,
        },
      });
    }
    return res.status(200).json({ message: "Event upadted sucessfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ message: "Failed to update project" });
  }
};

export const getProjectById = async (req: any, res: any) => {
  const { projectId } = req.params as { projectId: string };

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({
      message: "Project loaded succesfully",
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        codeURL: project.codeURL,
        screenshotURL: project.screenshotPath
          ? `/api/uploads/${project.screenshotPath}`
          : null,
        videoURL: project.videoPath
          ? `/api/uploads/${project.videoPath}`
          : null,
        demoURL: project.demoURL,
        submittedAt: project.submittedAt,
      },
    });
  } catch (error) {
    console.error("Error getting project by event ID:", error);
    return res.status(500).json({ message: "Failed to get event" });
  }
};

export const organizerGetProjectById = async (req: any, res: any) => {
  const { projectId } = req.params as { projectId: string };
  const user = req.user as User;

  if (user.accountType !== "organizer") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const event = await prisma.event.findUnique({
      where: { id: project.eventId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const team = await prisma.team.findUnique({
      where: { id: project.teamId },
    });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    const members = await Promise.all(
      team.members.map(async (memberId) => {
        const member = await prisma.user.findUnique({
          where: { id: memberId },
        });
        if (!member) return null;
        return {
          id: member.id,
          email: member.email,
          emailVerified: member.emailVerified,
          accountType: member.accountType,
          firstName: member.firstName,
          lastName: member.lastName,
          schoolDivision: member.schoolDivision,
          gradeLevel: member.gradeLevel,
          isGovSchool: member.isGovSchool,
          techStack: member.techStack,
          previousHackathon: member.previousHackathon,
          parentFirstName: member.parentFirstName,
          parentLastName: member.parentLastName,
          parentEmail: member.parentEmail,
          parentPhoneNumber: member.parentPhoneNumber,
          contactFirstName: member.contactFirstName,
          contactLastName: member.contactLastName,
          contactRelationship: member.contactRelationship,
          contactPhoneNumber: member.contactPhoneNumber,
          createdAt: member.createdAt,
        };
      })
    );
    const filteredMembers = members.filter((member) => member !== null);
    const judgeFeedback = await prisma.judgeFeedback.findMany({
      where: { projectId },
    });
    const filledJudgeFeedback = await Promise.all(
      judgeFeedback.map(async (feedback) => {
        const judge = await prisma.user.findUnique({
          where: { id: feedback.judgeId },
        });
        return {
          id: feedback.id,
          judge: `${judge?.firstName} ${judge?.lastName}`,
          creativityScore: feedback.creativityScore,
          functionalityScore: feedback.functionalityScore,
          technicalityScore: feedback.technicalityScore,
          interfaceScore: feedback.interfaceScore,
          totalScore: feedback.totalScore,
          feedback: feedback.feedback,
          createdAt: feedback.createdAt,
        };
      })
    );

    return res.status(200).json({
      message: "Project loaded succesfully",
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        codeURL: project.codeURL,
        screenshotURL: project.screenshotPath
          ? `/api/uploads/${project.screenshotPath}`
          : null,
        videoURL: project.videoPath
          ? `/api/uploads/${project.videoPath}`
          : null,
        demoURL: project.demoURL,
        submittedAt: project.submittedAt,
        team: {
          id: team.id,
          joinCode: team.joinCode,
          members: filteredMembers,
        },
        event: {
          id: event.id,
          name: event.name,
        },
        judgeFeedback: filledJudgeFeedback,
      },
    });
  } catch (error) {
    console.error("Error getting project by ID for organizer:", error);
    return res.status(500).json({ message: "Failed to get project" });
  }
};

export const judgeGetProjectById = async (req: any, res: any) => {
  const { projectId } = req.params as { projectId: string };
  const user = req.user as User;

  if (user.accountType !== "judge") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const event = await prisma.event.findUnique({
      where: { id: project.eventId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const team = await prisma.team.findUnique({
      where: { id: project.teamId },
    });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    const members = await Promise.all(
      team.members.map(async (memberId) => {
        const member = await prisma.user.findUnique({
          where: { id: memberId },
        });
        if (!member) return null;
        return `${member.firstName} ${member.lastName}`;
      })
    );
    const filteredMembers = members.filter((member) => member !== null);
    const judgeFeedback = await prisma.judgeFeedback.findFirst({
      where: { projectId, judgeId: user.id },
    });
    return res.status(200).json({
      message: "Project loaded succesfully",
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        codeURL: project.codeURL,
        screenshotURL: project.screenshotPath
          ? `/api/uploads/${project.screenshotPath}`
          : null,
        videoURL: project.videoPath
          ? `/api/uploads/${project.videoPath}`
          : null,
        demoURL: project.demoURL,
        submittedAt: project.submittedAt,
        team: filteredMembers,
        event: {
          id: event.id,
          name: event.name,
        },
        canBeJudged: !event.releasedJudging,
        judgeFeedback,
      },
    });
  } catch (error) {
    console.error("Error getting project by ID for judge:", error);
    return res.status(500).json({ message: "Failed to get project" });
  }
};
