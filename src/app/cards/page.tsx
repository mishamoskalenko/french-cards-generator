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
  const cardLenght = useSelector((state: RootState) => state.cards.count);
  const cardTheme = useSelector((state: RootState) => state.cards.theme);

  useEffect(() => {
    const fetchResponse = async () => {
      setLoading(true);
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: cardLenght, theme: cardTheme }),
      });
      const data = await res.json();
      setResponse(data);
      setLoading(false);
    };
    fetchResponse();
  }, [cardLenght, cardTheme]);

  return (
    <div className={styles.page}>
      <Link className={styles.link} href="/">Go back</Link>
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
                <Card text={word.french} translateText={word.english} />
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
