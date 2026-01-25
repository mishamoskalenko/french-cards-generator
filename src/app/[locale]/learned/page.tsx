"use client"

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Card } from '@/ui/Card/Card';
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabaseClient";

export default function Learned() {
  const t = useTranslations();
  const [learnedArray, setLearnedArray] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)
  const [confirmingReset, setConfirmingReset] = useState(false)

  useEffect(() => {
    const fetchLearnedCards = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLearnedArray([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('cards')
        .select('french_word')
        .eq('user_id', user.id);

      if (error) {
        console.error("Error loading cards:", error.message);
        setLearnedArray([]);
      }
      else if (data) {
        const frenchWords = data.map(card => card.french_word);
        setLearnedArray(frenchWords);
      }
      setLoading(false);
    };

    fetchLearnedCards();
  }, []);

  const resetProgress = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("User not authorized");
      return;
    }

    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error(error.message);
    } 
    else {
      setLearnedArray([]);
      setConfirmingReset(false);
    }
  };

  const handleResetClick = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
    } 
    else {
      resetProgress();
    }
  };

  return (
    <div className={styles.page}>
      <Link className={styles.link} href="/generator">{t('learned.goBack')}</Link>
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
                        <Card 
                          text={word} 
                          translateText={t('learned.knowTranslation')} 
                          initialLearned={true}
                        />
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
