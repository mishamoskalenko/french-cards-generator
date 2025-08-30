"use client"

import styles from "./page.module.css";
import { setCount, setLanguage, setTheme } from "../../store/features/cards/cardsSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";


export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoaded, setIsLoaded] = useState(false);
  const countValue = useSelector((state: RootState) => state.cards.count);
  const themeValue = useSelector((state: RootState) => state.cards.theme);
  const languageValue = useSelector((state: RootState) => state.cards.language);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "English";
    dispatch(setLanguage(savedLanguage));
    setIsLoaded(true)
  }, [])

  const handleChangeCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = Number(e.target.value);
    dispatch(setCount(number));
  };

  const handleChangeTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTheme(e.target.value));
  };

  const handleChangeLanguage = (lang: string) => {
    dispatch(setLanguage(lang));
    localStorage.setItem("language", lang);
  };

  const toggleLocale = () => {
    const locales = ["en", "fr", "es", "de", "uk"];
    const currentIndex = locales.indexOf(locale);
    const nextLocale = locales[(currentIndex + 1) % locales.length];
    router.replace(pathname, { locale: nextLocale });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (themeValue.trim()) {
      router.push('/cards');
    }
  };

  if (!isLoaded) {
    return null
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <button className={styles.language} onClick={toggleLocale}>
          <Image src="/language.svg" width={30} height={30} alt="language" />
          <span className={styles.languageText}>{t(`lang.${locale}`)}</span>
        </button>
        <h1 className={styles.title}>{t('home.title')}</h1>
        <Link href="/learned" className={styles.learnedLink}>{t('home.viewLearned')}</Link>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('home.chooseCount')}</label>
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
          <label className={styles.label}>{t('home.selectLanguage')}</label>
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
            <label className={styles.label}>{t('home.chooseTopic')}</label>
            <input
              required
              type="text"
              className={styles.textInput}
              value={themeValue}
              onChange={handleChangeTheme}
              placeholder={t('home.placeholder')}
            />
            <button type="submit" className={styles.link}>{t('home.go')}</button>
          </div>
        </form>
        <p className={styles.labelAi}>{t('home.aiNote')}</p>
      </div>
    </div>
  );
}