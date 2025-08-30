"use client"

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Card } from '@/ui/Card/Card';
import Link from 'next/link';

export default function Learned() {
  const [learnedArray, setLearnedArray] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("learnedCards");
    if (stored) {
      setLearnedArray(JSON.parse(stored));
    }
    else {
      setLearnedArray([]);
    }
    setLoading(false);
  }, []);


  return (
    <div className={styles.page}>
      <Link className={styles.link} href="/">Go back</Link>
      {loading ?
        (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingCard}>
              <div className={styles.loadingSpinner}></div>
              <div className={styles.loadingCardText}>
                Loading your cards...
              </div>
            </div>
          </div>
        )
        :
        (
          <div className={styles.cards}>
            {learnedArray.length > 0 ?
              (
                learnedArray.map((word: any, index: number) => (
                  <div key={index}>
                    <Card text={word} translateText="you should know the translation :)" />
                  </div>
                ))
              )
              :
              (
                <p className={styles.warning}>You haven’t learned any words yet</p>
              )
            }
          </div>
        )}
    </div>
  );
}
