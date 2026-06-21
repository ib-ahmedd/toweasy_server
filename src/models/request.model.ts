import mongoose from 'mongoose';

const towRequestSchema = new mongoose.Schema({
  vehicleType: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  status: { 
    type: String, 
    enum: [
      'pending', 
      'accepted', 
      'driver_enroute', 
      'with_customer', 
      'towing_vehicle', 
      'at_destination', 
      'completed', 
      'cancelled', 
      'waiting_confirmation', 
      'disputed'
    ], 
    default: 'pending' 
  },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  createdAt: { type: Date, default: Date.now }
});

// Ensure 'id' is available in JSON output to maintain frontend compatibility
towRequestSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc: any, ret: any) { 
    ret.id = ret._id;
    delete ret._id; 
  }
});

export const TowRequest = mongoose.model('TowRequest', towRequestSchema);
