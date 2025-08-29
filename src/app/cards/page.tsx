"use client"

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Card } from '@/ui/Card/Card';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Link from 'next/link';

export default function Cards() {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const cardLength = useSelector((state: RootState) => state.cards.count);
  const cardTheme = useSelector((state: RootState) => state.cards.theme);
  const cardLanguage = useSelector((state: RootState) => state.cards.language);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        setError(false);
        setLoading(true);
        const res = await fetch("/api/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: cardLength, theme: cardTheme, language: cardLanguage }),
        });

        if (!res.ok) {
          setError(true)
          return;
        }

        const data = await res.json();
        console.log(data);
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
      <Link className={styles.link} href="/">Go back</Link>
      {error &&
        <p>Error has occured</p>
      }
      {loading ?
        (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingCard}>
              <div className={styles.loadingSpinner}></div>
              <div className={styles.loadingCardText}>
                Generating your cards...
              </div>
            </div>
          </div>
        )
        :
        (
          <div className={styles.cards}>
            {response.map((word: any, index: number) => (
              <div key={index}>
                <Card text={word.french} translateText={word[cardLanguage]} />
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
