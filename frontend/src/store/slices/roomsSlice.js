import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ─── Async Thunks ─────────────────────────────────────────────────

export const fetchRooms = createAsyncThunk(
  'rooms/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/rooms', { params });
      return data; // { data: rooms[], pagination: {...} }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load rooms');
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────────

const defaultFilters = {
  search: '',
  area: '',
  roomType: '',
  minPrice: '',
  maxPrice: '',
  amenities: '',
  sort: 'newest',
  page: 1,
};

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    rooms: [],
    pagination: { total: 0, page: 1, pages: 1, limit: 12 },
    filters: defaultFilters,
    loading: false,
    error: null,
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage(state, action) {
      state.filters.page = action.payload;
    },
    resetFilters(state) {
      state.filters = defaultFilters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.rooms = action.payload.data;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, setPage, resetFilters } = roomsSlice.actions;

// ─── Selectors ─────────────────────────────────────────────────────
export const selectRooms = (state) => state.rooms.rooms;
export const selectRoomsPagination = (state) => state.rooms.pagination;
export const selectRoomsFilters = (state) => state.rooms.filters;
export const selectRoomsLoading = (state) => state.rooms.loading;
export const selectRoomsError = (state) => state.rooms.error;

export default roomsSlice.reducer;
