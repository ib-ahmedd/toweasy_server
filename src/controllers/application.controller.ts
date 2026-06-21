import type { Request, Response } from "express";
import { DriverApplication } from "../models/application.model.js";
import { Driver } from "../models/driver.model.js";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

export const createApplication = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      licenseNumber,
      vehicleInfo,
      experience,
      licenseImage,
    } = req.body;

    const applicationId = nanoid(8).toUpperCase();

    const newApplication = new DriverApplication({
      fullName,
      email,
      phoneNumber,
      licenseNumber,
      vehicleInfo,
      experience,
      licenseImage,
      applicationId,
      status: "pending",
    });

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const applications = await DriverApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getApplicationByTrackingId = async (
  req: Request,
  res: Response
) => {
  try {
    const { trackingId } = req.params;
    if (typeof trackingId !== 'string') {
      return res.status(400).json({ error: "Invalid tracking ID" });
    }
    const application = await DriverApplication.findOne({
      applicationId: trackingId.toUpperCase(),
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, username, password } = req.body;

    const application = await DriverApplication.findById(id);
    if (!application)
      return res.status(404).json({ error: "Application not found" });

    application.status = status;
    if (username) application.username = username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      application.password = await bcrypt.hash(password, salt);
    }

    await application.save();

    // If finalizing registration, create the Driver record
    if (status === "registered") {
      const newDriver = new Driver({
        name: application.fullName,
        email: application.email,
        isOnline: false,
      });
      await newDriver.save();
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
