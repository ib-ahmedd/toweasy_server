import mongoose from 'mongoose';

const driverApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  licenseImage: { type: String }, // Base64 or URL
  vehicleInfo: { type: String, required: true },
  experience: { type: Number, required: true },
  applicationId: { type: String, unique: true, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'registered'], 
    default: 'pending' 
  },
  username: { type: String },
  password: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Ensure 'id' and 'applicationId' are friendly in JSON
driverApplicationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) { 
    ret.id = ret._id;
    delete ret._id; 
  }
});

export const DriverApplication = mongoose.model('DriverApplication', driverApplicationSchema);
