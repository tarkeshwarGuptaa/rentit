import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ─── Async Thunks ─────────────────────────────────────────────────

export const fetchRoomById = createAsyncThunk(
  'roomDetail/fetch',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/rooms/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Room not found');
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────

const roomDetailSlice = createSlice({
  name: 'roomDetail',
  initialState: {
    room: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearRoomDetail(state) {
      state.room = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.room = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.room = action.payload;
        state.loading = false;
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRoomDetail } = roomDetailSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────
export const selectRoom = (state) => state.roomDetail.room;
export const selectRoomDetailLoading = (state) => state.roomDetail.loading;
export const selectRoomDetailError = (state) => state.roomDetail.error;

export default roomDetailSlice.reducer;
