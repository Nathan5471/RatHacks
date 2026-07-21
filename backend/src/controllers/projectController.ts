import { User } from "@prisma/client";
import prisma from "../prisma/client";
import { AwsClient } from "aws4fetch";

export const createProject = async (req: any, res: any) => {
  const {
    name,
    description,
    codeURL,
    demoURL,
    screenshotURL,
    videoURL,
    eventId,
  } = req.body as {
    name: string;
    description: string;
    codeURL: string | null;
    demoURL: string | null;
    screenshotURL: string | null;
    videoURL: string | null;
    eventId: string;
  };
  const user = req.user as User;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const team = await prisma.team.findFirst({
      where: {
        members: { some: { id: user.id } },
        eventId: event.id,
      },
      include: {
        project: true,
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
        screenshotURL,
        videoURL,
        eventId: event.id,
        teamId: team.id,
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
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.team.members.some((member) => member.id === user.id)) {
      return res
        .status(403)
        .json({ message: "User is not part of the team for this project" });
    }

    if (project.submittedAt) {
      return res.status(400).json({ message: "Project already submitteded" });
    }
    if (!project.codeURL || !project.screenshotURL || !project.videoURL) {
      return res.status(400).json({
        message: "Code URL, Screenshot, and Video are required to submit",
      });
    }

    await prisma.project.update({
      where: { id: project.id },
      data: {
        submittedAt: new Date(),
        submittedBy: { connect: { id: user.id } },
      },
    });
    await prisma.team.update({
      where: { id: project.team.id },
      data: {
        submittedProject: true,
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
      include: {
        event: true,
        judgeFeedback: {
          where: { judgeId: user.id },
        },
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.event.releasedJudging) {
      return res
        .status(400)
        .json({ message: "Judging has already been released" });
    }
    if (project.judgeFeedback.length > 0) {
      return res
        .status(400)
        .json({ message: "Feedback already exists for this project" });
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
  const { name, description, codeURL, demoURL, screenshotURL, videoURL } =
    req.body as {
      name: string;
      description: string;
      codeURL: string | null;
      demoURL: string | null;
      screenshotURL: string | null;
      videoURL: string | null;
    };
  const user = req.user as User;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.submittedAt) {
      return res
        .status(400)
        .json({ message: "Project can't be editted after being submitted" });
    }
    if (!project.team.members.some((member) => member.id === user.id)) {
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
        screenshotURL,
        videoURL,
      },
    });
    return res.status(200).json({ message: "Event upadted sucessfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ message: "Failed to update project" });
  }
};

export const generateUploadLink = async (req: any, res: any) => {
  const { fileExtension } = req.params as { fileExtension: string };
  const filename = `user-upload-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const baseURL = process.env.R2_BASE_URL;
  const publicBaseURL = process.env.R2_PUBLIC_BASE_URL;
  if (!accessKeyId || !secretAccessKey || !baseURL || !publicBaseURL) {
    console.error("R2 credentials are not set in environment variables");
    return res.status(500).json({ message: "Failed to generate upload link" });
  }
  try {
    const r2 = new AwsClient({
      accessKeyId,
      secretAccessKey,
    });
    const url = new URL(`${baseURL}/${filename}`);
    url.searchParams.append("X-Amz_Expires", "3600");
    const signed = await r2.sign(new Request(url, { method: "PUT" }), {
      aws: { signQuery: true },
    });
    return res.status(200).json({
      uploadURL: signed.url,
      postUploadURL: `${publicBaseURL}/${filename}`,
    });
  } catch (error) {
    console.error("Error generating upload link:", error);
    return res.status(500).json({ message: "Failed to generate upload link" });
  }
};

export const getProjectById = async (req: any, res: any) => {
  const { projectId } = req.params as { projectId: string };
  const user = req.user as User | null;

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        event: true,
        team: {
          include: {
            members: true,
          },
        },
        judgeFeedback: {
          include: {
            judge: true,
          },
        },
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const members = project.team.members.map((member) => {
      return `${member.firstName} ${member.lastName}`;
    });
    const filteredMembers = members.filter((member) => member !== null);
    let projectFeedback = [];
    if (
      project.event.releasedJudging &&
      user &&
      project.team.members.some((member) => member.id === user.id)
    ) {
      for (const feedback of project.judgeFeedback) {
        projectFeedback.push({
          id: feedback.id,
          judge: `${feedback.judge?.firstName} ${feedback.judge?.lastName}`,
          creativityScore: feedback.creativityScore,
          functionalityScore: feedback.functionalityScore,
          technicalityScore: feedback.technicalityScore,
          interfaceScore: feedback.interfaceScore,
          totalScore: feedback.totalScore,
          feedback: feedback.feedback,
        });
      }
    }

    return res.status(200).json({
      message: "Project loaded succesfully",
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        codeURL: project.codeURL,
        screenshotURL: project.screenshotURL,
        videoURL: project.videoURL,
        demoURL: project.demoURL,
        members: filteredMembers,
        event: {
          id: project.event.id,
          name: project.event.name,
        },
        judgeFeedback: projectFeedback,
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
      include: {
        event: true,
        team: {
          include: {
            members: true,
          },
        },
        judgeFeedback: {
          include: {
            judge: true,
          },
        },
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const members = project.team.members.map((member) => {
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
    });
    const judgeFeedback = project.judgeFeedback.map((feedback) => {
      return {
        id: feedback.id,
        judge: `${feedback.judge?.firstName} ${feedback.judge?.lastName}`,
        creativityScore: feedback.creativityScore,
        functionalityScore: feedback.functionalityScore,
        technicalityScore: feedback.technicalityScore,
        interfaceScore: feedback.interfaceScore,
        totalScore: feedback.totalScore,
        feedback: feedback.feedback,
        createdAt: feedback.createdAt,
      };
    });

    return res.status(200).json({
      message: "Project loaded succesfully",
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        codeURL: project.codeURL,
        screenshotURL: project.screenshotURL,
        videoURL: project.videoURL,
        demoURL: project.demoURL,
        submittedAt: project.submittedAt,
        team: {
          id: project.team.id,
          joinCode: project.team.joinCode,
          members,
        },
        event: {
          id: project.event.id,
          name: project.event.name,
        },
        judgeFeedback: judgeFeedback,
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
      include: {
        event: true,
        team: {
          include: {
            members: true,
          },
        },
        judgeFeedback: {
          where: { judgeId: user.id },
        },
      },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const members = project.team.members.map((member) => {
      return `${member.firstName} ${member.lastName}`;
    });
    return res.status(200).json({
      message: "Project loaded succesfully",
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        codeURL: project.codeURL,
        screenshotURL: project.screenshotURL,
        videoURL: project.videoURL,
        demoURL: project.demoURL,
        submittedAt: project.submittedAt,
        team: members,
        event: {
          id: project.event.id,
          name: project.event.name,
        },
        canBeJudged: !project.event.releasedJudging,
        judgeFeedback: project.judgeFeedback.length > 0,
      },
    });
  } catch (error) {
    console.error("Error getting project by ID for judge:", error);
    return res.status(500).json({ message: "Failed to get project" });
  }
};
