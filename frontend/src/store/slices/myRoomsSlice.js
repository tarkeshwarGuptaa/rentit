import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ─── Async Thunks ─────────────────────────────────────────────────

export const fetchMyRooms = createAsyncThunk(
  'myRooms/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/rooms/my-listings');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load listings');
    }
  }
);

export const deleteMyRoom = createAsyncThunk(
  'myRooms/delete',
  async (roomId, { rejectWithValue }) => {
    try {
      await api.delete(`/rooms/${roomId}`);
      return roomId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete');
    }
  }
);

export const toggleMyRoomAvailability = createAsyncThunk(
  'myRooms/toggleAvailability',
  async (roomId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/rooms/${roomId}/availability`);
      return data.data; // { _id, isAvailable, ... }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update');
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────

const myRoomsSlice = createSlice({
  name: 'myRooms',
  initialState: {
    rooms: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchMyRooms
    builder
      .addCase(fetchMyRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRooms.fulfilled, (state, action) => {
        state.rooms = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // deleteMyRoom
    builder
      .addCase(deleteMyRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter((r) => r._id !== action.payload);
      });

    // toggleMyRoomAvailability
    builder
      .addCase(toggleMyRoomAvailability.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.rooms.findIndex((r) => r._id === updated._id);
        if (idx !== -1) {
          state.rooms[idx].isAvailable = updated.isAvailable;
        }
      });
  },
});

// ─── Selectors ─────────────────────────────────────────────────────
export const selectMyRooms = (state) => state.myRooms.rooms;
export const selectMyRoomsLoading = (state) => state.myRooms.loading;
export const selectMyRoomsError = (state) => state.myRooms.error;

export default myRoomsSlice.reducer;
