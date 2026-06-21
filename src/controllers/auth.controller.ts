import type { Request, Response } from 'express';
import { DriverApplication } from '../models/application.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

export const loginDriver = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    const application = await DriverApplication.findOne({ username, status: 'registered' });
    if (!application) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, application.password!);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: application.id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token, driver: { name: application.fullName } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
