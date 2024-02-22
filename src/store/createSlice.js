import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  songs: []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    add(state, action) {
     
      if (!state.songs) {
        state.songs = [];
      }
 
      state.songs.push(action.payload);
    },
    remove(state, action) {
    
      if (!state.songs) {
        state.songs = [];
      }
      state.songs = state.songs.filter((item) => item.id !== action.payload);
    },
  },
});

export const { add, remove } = cartSlice.actions;
export default cartSlice.reducer;
