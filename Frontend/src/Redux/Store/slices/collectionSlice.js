import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCollections, createCollection, updateCollection, deleteCollection } from '../../../Services/api';

// Fetch collections
export const getCollections = createAsyncThunk('collections/getCollections',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCollections();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add a new collection
export const addCollection = createAsyncThunk('collections/addCollection',
  async (data, { rejectWithValue }) => {
    try {
      return await createCollection(data); // Expecting the full new collection object
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update a collection
export const updateCollectionById = createAsyncThunk('collections/updateCollection',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateCollection(id, data); // Expecting the updated collection object
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a collection
export const deleteCollectionById = createAsyncThunk('collections/deleteCollection',
  async (id, { rejectWithValue }) => {
    try {
      await deleteCollection(id);
      return id; // Return the id of the deleted collection
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const collectionsSlice = createSlice({
  name: 'collections',
  initialState: {
    collections: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle Fetch
      .addCase(getCollections.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getCollections.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.collections = action.payload;
      })
      .addCase(getCollections.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Handle Add
      .addCase(addCollection.fulfilled, (state, action) => {
        state.collections.push(action.payload);
      })
      .addCase(addCollection.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Handle Update
      .addCase(updateCollectionById.fulfilled, (state, action) => {
        const index = state.collections.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
      })
      .addCase(updateCollectionById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Handle Delete
      .addCase(deleteCollectionById.fulfilled, (state, action) => {
        state.collections = state.collections.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCollectionById.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default collectionsSlice.reducer;
