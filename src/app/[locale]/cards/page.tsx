"use client"

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Card } from '@/ui/Card/Card';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Cards() {
  const t = useTranslations();
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const reversed = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("isTranslationFirst") || "false") as boolean : false;
  const cardLength = useSelector((state: RootState) => state.cards.count);
  const cardTheme = useSelector((state: RootState) => state.cards.theme);
  const cardLanguage = useSelector((state: RootState) => state.cards.language);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        setError(false);
        const stored = typeof window !== "undefined" ? localStorage.getItem("learnedCards") : null;
        const cardStorage = stored ? JSON.parse(stored).slice(-200) : [];
        const res = await fetch("/api/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: cardLength, theme: cardTheme, language: cardLanguage, storage: cardStorage }),
        });
        if (!res.ok) {
          setError(true)
          return;
        }
        const data = await res.json();
        setResponse(data);
      }
      finally {
        setLoading(false);
      }
    };
    fetchResponse();
  }, [cardLength, cardTheme, cardLanguage]);

  return (
    <div className={styles.page}>
      <Link className={styles.link} href="/">{t('cards.goBack')}</Link>
      {error &&
        <p>{t('cards.error')}</p>
      }
      {loading ?
        (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingCard}>
              <div className={styles.loadingSpinner}></div>
              <div className={styles.loadingCardText}>
                {t('cards.generating')}
              </div>
            </div>
          </div>
        )
        :
        (
          <div className={styles.cards}>
            {response.map((word: any, index: number) => (
              <div key={index}>
                <Card text={word.french} translateText={word.translated} reversed={reversed} />
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
