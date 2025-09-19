'use client'

import { useEffect, useState } from 'react';
import styles from './Card.module.css';
import { useTranslations } from 'next-intl';

interface CardProps {
    translateText: string;
    text: string;
    reversed?: boolean
}

export const Card = (props: CardProps) => {
    const { text, translateText, reversed } = props;
      const t = useTranslations();

    const [flipped, setFlipped] = useState(false);
    const [learned, setLearned] = useState(false);

    const handleFlip = () => setFlipped(!flipped);
    const handleLearn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const newLearned = !learned;
        setLearned(newLearned);

        const stored = localStorage.getItem("learnedCards");
        let learnedArray: string[] = stored ? JSON.parse(stored) : [];

        if (newLearned) {
            if (!learnedArray.includes(text)) {
                learnedArray.push(text);
            }
        }
        else {
            learnedArray = learnedArray.filter(item => item !== text);
        }

        localStorage.setItem("learnedCards", JSON.stringify(learnedArray));
    }

    useEffect(() => {
        const stored = localStorage.getItem("learnedCards");
        const learnedArray: string[] = stored ? JSON.parse(stored) : [];

        if (learnedArray.includes(text)) {
            setLearned(true);
        }
    }, [text]);

    const playSound = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        const ua = window.navigator.userAgent;
        const isIOS = /iP(hone|od|ad)/.test(ua);
        let iosVersion: number | null = null;

        if (isIOS) {
            const match = ua.match(/OS (\d+)_?(\d+)?_?(\d+)?/);
            if (match) iosVersion = parseInt(match[1], 10);
        }

        if (iosVersion !== null && iosVersion >= 18) {
            const alertShown = localStorage.getItem("iosAlert");
            if (!alertShown) {
                alert(t("IOS18Alert"));
                localStorage.setItem("iosAlert", "true");
            }
        }
        const synth = window.speechSynthesis;
        const textSpeech = new SpeechSynthesisUtterance(text);
        textSpeech.lang = "fr-FR";
        synth.speak(textSpeech);
    };

    const content = (
        <>
            <div className={`${styles.flipCardFront} ${learned ? styles.learned : ''}`}>
                {text}
                <button className={styles.sound} onClick={playSound}>🔊</button>
                <button className={styles.learnedText} onClick={handleLearn}>{learned ? "✅" : "❌"}</button>
            </div>
            <div className={styles.flipCardBack}>
                {translateText}
            </div>
        </>
    )

    const reversedContent = (
        <>
            <div className={`${styles.flipCardFront} ${styles.reversedCardFront}`}>
                {translateText}
            </div>
            <div className={`${styles.flipCardBack} ${learned ? styles.learned : ''} ${styles.reversedCardBack}`}>
                {text}
                <button className={styles.sound} onClick={playSound}>🔊</button>
                <button className={styles.learnedText} onClick={handleLearn}>{learned ? "✅" : "❌"}</button>
            </div>
        </>
    )

    return (
        <div className={styles.flipCard} onClick={handleFlip}>
            <div className={`${styles.flipCardInner} ${flipped ? styles.flipped : ''} ${learned ? styles.learned : ''}`}>
                {reversed ? reversedContent : content}
            </div>
        </div>
    );

};



