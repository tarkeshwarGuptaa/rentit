import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
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



const Room = mongoose.model('listing', listingSchema);
export default Room;
