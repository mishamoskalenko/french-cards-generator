import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CardsState {
  count: number;
  theme: string;
}

const initialState: CardsState = {
  count: 1,
  theme: ""
};

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
  },
});

export const { setCount, setTheme } = cardsSlice.actions;
export default cardsSlice.reducer;
