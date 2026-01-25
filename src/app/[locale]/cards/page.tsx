"use client"

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Card } from '@/ui/Card/Card';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabaseClient";

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
        const { data: { user } } = await supabase.auth.getUser();
        let cardStorage: string[] = [];

        if (user) {
          const { data: learnedData } = await supabase
            .from('cards')
            .select('french_word')
            .eq('user_id', user.id)
            .limit(200);

          if (learnedData) {
            cardStorage = learnedData.map(item => item.french_word);
          }
        }
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

        const newWords = data.map((item: any) => item.french);
        const learnedSet = new Set();

        if (user && newWords.length > 0) {
          const { data: existingCards } = await supabase
            .from('cards')
            .select('french_word')
            .eq('user_id', user.id)
            .in('french_word', newWords);

          if (existingCards) {
            existingCards.forEach((c: any) => learnedSet.add(c.french_word));
          }
        }

        const enrichedData = data.map((item: any) => ({
          ...item,
          isLearned: learnedSet.has(item.french)
        }));

        setResponse(enrichedData);
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
              <div key={word.french}>
                <Card 
                  text={word.french} 
                  translateText={word.translated} 
                  reversed={reversed}
                  initialLearned={word.isLearned}
                />
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
