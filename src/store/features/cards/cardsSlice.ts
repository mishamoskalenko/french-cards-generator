import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CardsState {
  count: number;
  theme: string;
  language: string;
  isTranslationFirst: boolean
}

const initialState: CardsState = {
  count: 1,
  theme: "",
  language: "English",
  isTranslationFirst: true
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
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setShowTranslation: (state, action: PayloadAction<boolean>) => {
      state.isTranslationFirst = action.payload;
    },
  },
});

export const { setCount, setTheme, setLanguage, setShowTranslation } = cardsSlice.actions;
export default cardsSlice.reducer;
