import type { Request, Response } from 'express';
import { Driver } from '../models/driver.model.js';
import jwt from 'jsonwebtoken';
import { DriverApplication } from '../models/application.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getLoggedInDriver = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as any as { id: string };

    const application = await DriverApplication.findById(decoded.id);
    if (!application) {
      return res.status(404).json({ error: 'Driver application not found' });
    }

    const driver = await Driver.findOne({ 
      $or: [
        { email: application.email },
        { name: application.fullName }
      ]
    });
    if (!driver) {
      return res.status(404).json({ error: 'Driver profile not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const updateDriverStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isOnline, currentLocation } = req.body;
    
    console.log(`[DriverStatusUpdate] ID: ${id}, isOnline: ${isOnline}, currentLocation:`, JSON.stringify(currentLocation));
    
    const updateFields: any = { isOnline, lastUpdated: new Date() };
    if (currentLocation) {
      updateFields.currentLocation = currentLocation;
    }
    
    const driver = await Driver.findByIdAndUpdate(id, updateFields, { new: true });
    console.log(`[DriverStatusUpdate] Successfully updated driver ${id}:`, JSON.stringify(driver));
    res.json(driver);
  } catch (error) {
    console.error(`[DriverStatusUpdate] Error updating driver ${id}:`, error);
    res.status(500).json({ error: 'Server error' });
  }
};
