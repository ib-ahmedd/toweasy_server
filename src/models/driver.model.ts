import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  isOnline: { type: Boolean, default: false },
  currentLocation: {
    latitude: Number,
    longitude: Number
  },
  lastUpdated: { type: Date, default: Date.now }
});

driverSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) { 
    ret.id = ret._id;
    delete ret._id; 
  }
});

export const Driver = mongoose.model('Driver', driverSchema);
