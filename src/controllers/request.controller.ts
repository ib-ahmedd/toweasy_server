import type { Request, Response } from "express";
import { TowRequest } from "../models/request.model.js";

export const createRequest = async (req: Request, res: Response) => {
  try {
    const { vehicleType, location, userName, userEmail, userPhone } = req.body;
    if (
      !vehicleType ||
      !location ||
      !location.latitude ||
      !location.longitude ||
      !userName ||
      !userEmail ||
      !userPhone
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingActiveRequest = await TowRequest.findOne({
      userEmail,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingActiveRequest) {
      return res.status(400).json({
        error:
          "You already have an active towing request. Please wait for it to be completed or cancel it before making a new one.",
      });
    }

    const newRequest = new TowRequest({
      vehicleType,
      location,
      userName,
      userEmail,
      userPhone,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const requests = await TowRequest.find().populate('driverId').sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, driverId } = req.body;

    const updateData: any = { status };
    if (driverId) {
      updateData.driverId = driverId;
    }

    const updatedRequest = await TowRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('driverId');

    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ error: "Server error" });
  }
};
