"use client"

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Card } from '@/ui/Card/Card';
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Learned() {
  const t = useTranslations();
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

  const resetProgress = () => {
    localStorage.removeItem("learnedCards");
    setLearnedArray([]);
  }

  return (
    <div className={styles.page}>
      <Link className={styles.link} href="/">{t('learned.goBack')}</Link>
      {learnedArray.length > 0 && <button className={styles.progress} onClick={resetProgress}>{t('learned.reset')}</button>}
      {loading ?
        (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingCard}>
              <div className={styles.loadingSpinner}></div>
              <div className={styles.loadingCardText}>
                {t('learned.loading')}
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
                    <Card text={word} translateText={t('learned.knowTranslation')} />
                  </div>
                ))
              )
              :
              (
                <p className={styles.warning}>{t('learned.empty')}</p>
              )
            }
          </div>
        )}
    </div>
  );
}
