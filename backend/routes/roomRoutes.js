import { Router } from 'express';
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  toggleAvailability,
  getMyListings,
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Public routes
router.get('/', getRooms);
router.get('/my-listings', protect, authorize('landlord'), getMyListings);
router.get('/:id', getRoom);

// Protected landlord routes
router.post(
  '/',
  protect,
  authorize('landlord'),
  upload.array('photos', 6),
  createRoom
);

router.put(
  '/:id',
  protect,
  authorize('landlord'),
  upload.array('photos', 6),
  updateRoom
);

router.delete('/:id', protect, authorize('landlord'), deleteRoom);
router.patch('/:id/availability', protect, authorize('landlord'), toggleAvailability);

export default router;
