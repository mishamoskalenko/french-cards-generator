"use client"

import styles from "./page.module.css";
import { setCount, setLanguage, setTheme } from "../store/features/cards/cardsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useRouter } from "next/navigation";

export default function Cards() {
  const dispatch = useDispatch<AppDispatch>();
  const countValue = useSelector((state: RootState) => state.cards.count);
  const themeValue = useSelector((state: RootState) => state.cards.theme);
  const languageValue = useSelector((state: RootState) => state.cards.language);

  const handleChangeCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = Number(e.target.value);
    dispatch(setCount(number));
  };

  const handleChangeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTheme(e.target.value));
  };

  const handleChangeLanguage = (lang: string) => {
    dispatch(setLanguage(lang));
  };

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (themeValue.trim()) {
      router.push('/cards');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Hi! Welcome to the French Cards generator</h1>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Choose cards count</label>
          <div className={styles.rangeContainer}>
            <input
              type="range"
              className={styles.rangeInput}
              value={countValue}
              onChange={handleChangeCount}
              min="1"
              max="20"
            />
            <div className={styles.countDisplay}>{countValue}</div>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Select the translation language</label>
          <div className={styles.languages}>
            {["English", "Українська", "Deutsch", "Español"].map((lang) => (
              <button
                key={lang}
                className={languageValue === lang ? styles.activeButton : styles.textInput}
                onClick={() => handleChangeLanguage(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Write a topic for the cards</label>
            <input
              required
              type="text"
              className={styles.textInput}
              value={themeValue}
              onChange={handleChangeTheme}
              placeholder="Animals, Food, Travel..."
            />
            <button type="submit" className={styles.link}>Go</button>
          </div>
        </form>
        <p className={styles.label}>AI-generated content may contain errors. Please verify the information</p>
      </div>
    </div>
  );
}