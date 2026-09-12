import Room from '../models/Room.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../middleware/upload.js';

// @desc    Get all rooms (with filters, sort, pagination)
// @route   GET /api/rooms
// @access  Public
export const getRooms = asyncHandler(async (req, res) => {
  const {
    area,
    roomType,
    minPrice,
    maxPrice,
    amenities,
    search,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const query = { isAvailable: true };

  // Area filter
  if (area) {
    query.area = { $regex: area, $options: 'i' };
  }

  // Room type filter
  if (roomType) {
    query.roomType = roomType;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.rent = {};
    if (minPrice) query.rent.$gte = Number(minPrice);
    if (maxPrice) query.rent.$lte = Number(maxPrice);
  }

  // Amenities filter (room must have ALL selected amenities)
  if (amenities) {
    const amenityList = amenities.split(',');
    query.amenities = { $all: amenityList };
  }

  // Text search on title and description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { area: { $regex: search, $options: 'i' } },
    ];
  }

  // Sort options
  let sortOption = { createdAt: -1 }; // Default: newest first
  if (sort === 'price_asc') sortOption = { rent: 1 };
  else if (sort === 'price_desc') sortOption = { rent: -1 };
  else if (sort === 'newest') sortOption = { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [rooms, total] = await Promise.all([
    Room.find(query)
      .populate('landlord', 'name phone avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit)),
    Room.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: rooms,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
});

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
export const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate(
    'landlord',
    'name phone avatar email'
  );

  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  // Increment view count
  room.views += 1;
  await room.save();

  res.json({
    success: true,
    data: room,
  });
});

// @desc    Create room listing
// @route   POST /api/rooms
// @access  Private (Landlord)
export const createRoom = asyncHandler(async (req, res) => {
  // Handle photo uploads if files present
  let photoUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, 'roomnear/rooms')
    );
    photoUrls = await Promise.all(uploadPromises);
  }

  // Parse body fields (multipart form data sends strings)
  const roomData = {
    ...req.body,
    rent: Number(req.body.rent),
    amenities: req.body.amenities ? JSON.parse(req.body.amenities) : [],
    location: req.body.location ? JSON.parse(req.body.location) : undefined,
    photos: photoUrls.length > 0 ? photoUrls : (req.body.photos ? JSON.parse(req.body.photos) : []),
    landlord: req.user._id,
  };

  const room = await Room.create(roomData);

  const populated = await room.populate('landlord', 'name phone avatar');

  res.status(201).json({
    success: true,
    data: populated,
  });
});

// @desc    Update room listing
// @route   PUT /api/rooms/:id
// @access  Private (Landlord - owner only)
export const updateRoom = asyncHandler(async (req, res) => {
  let room = await Room.findById(req.params.id);

  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  // Check ownership
  if (room.landlord.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only edit your own listings');
  }

  // Handle new photo uploads
  let photoUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, 'roomnear/rooms')
    );
    photoUrls = await Promise.all(uploadPromises);
  }

  const updateData = { ...req.body };

  // Parse multipart form data strings
  if (updateData.rent) updateData.rent = Number(updateData.rent);
  if (updateData.amenities) updateData.amenities = JSON.parse(updateData.amenities);
  if (updateData.location) updateData.location = JSON.parse(updateData.location);

  if (photoUrls.length > 0) {
    // Merge with existing photos or replace
    const existingPhotos = req.body.existingPhotos ? JSON.parse(req.body.existingPhotos) : room.photos;
    updateData.photos = [...existingPhotos, ...photoUrls];
  }

  room = await Room.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate('landlord', 'name phone avatar');

  res.json({
    success: true,
    data: room,
  });
});

// @desc    Delete room listing
// @route   DELETE /api/rooms/:id
// @access  Private (Landlord - owner only)
export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  if (room.landlord.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only delete your own listings');
  }

  await room.deleteOne();

  res.json({
    success: true,
    message: 'Room listing deleted successfully',
  });
});

// @desc    Toggle room availability
// @route   PATCH /api/rooms/:id/availability
// @access  Private (Landlord - owner only)
export const toggleAvailability = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  if (room.landlord.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only modify your own listings');
  }

  room.isAvailable = !room.isAvailable;
  await room.save();

  res.json({
    success: true,
    data: room,
  });
});

// @desc    Get rooms by landlord (for dashboard)
// @route   GET /api/rooms/my-listings
// @access  Private (Landlord)
export const getMyListings = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ landlord: req.user._id })
    .sort({ createdAt: -1 })
    .populate('landlord', 'name phone avatar');

  res.json({
    success: true,
    data: rooms,
  });
});
