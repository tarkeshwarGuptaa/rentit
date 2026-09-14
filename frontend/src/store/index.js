import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roomsReducer from './slices/roomsSlice';
import roomDetailReducer from './slices/roomDetailSlice';
import myRoomsReducer from './slices/myRoomsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    roomDetail: roomDetailReducer,
    myRooms: myRoomsReducer,
  },
});

export default store;
