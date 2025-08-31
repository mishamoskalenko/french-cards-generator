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
  const [confirmingReset, setConfirmingReset] = useState(false)

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

  const handleResetClick = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    resetProgress();
    setConfirmingReset(false);
  }

  return (
    <div className={styles.page}>
      <Link className={styles.link} href="/">{t('learned.goBack')}</Link>
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
          <>
            {learnedArray.length > 0 ?
              (
                <>
                  <h2 className={styles.warning}>{t('learned.count', { count: learnedArray.length })}</h2>
                  <p className={styles.note}>{t('home.repeatNote')}</p>
                  <button className={styles.progress} onClick={handleResetClick}>{confirmingReset ? t('learned.confirmReset') : t('learned.reset')}</button>
                  <div className={styles.cards}>
                    {learnedArray.map((word: any, index: number) => (
                      <div key={index}>
                        <Card text={word} translateText={t('learned.knowTranslation')} />
                      </div>
                    ))}
                  </div>
                </>
              )
              :
              (
                <p className={styles.warning}>{t('learned.empty')}</p>
              )
            }
          </>
        )}
    </div>
  );
}
