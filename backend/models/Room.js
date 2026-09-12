import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: 20,
      maxlength: 2000,
    },
    rent: {
      type: Number,
      required: [true, 'Rent is required'],
      min: 500,
      max: 100000,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    area: {
      type: String,
      required: [true, 'Area/locality is required'],
      trim: true,
    },
    roomType: {
      type: String,
      enum: ['single', 'shared', '1BHK', '2BHK'],
      required: [true, 'Room type is required'],
    },
    amenities: {
      type: [String],
      enum: ['WiFi', 'AC', 'Food', 'Parking', 'Laundry', 'Geyser', 'Attached Bathroom'],
      default: [],
    },
    photos: {
      type: [String],
      default: [],
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    views: { // want to remove
      type: Number,
      default: 0,
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries want to delete
// roomSchema.index({ area: 1, rent: 1 });
// roomSchema.index({ roomType: 1 });
// roomSchema.index({ isAvailable: 1 });
// roomSchema.index({ landlord: 1 });

const Room = mongoose.model('Room', roomSchema);
export default Room;
