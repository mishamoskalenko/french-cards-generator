'use client'

import { useState } from 'react';
import styles from './Card.module.css';

interface CardProps {
    translateText: string;
    text: string;
}

export const Card = (props: CardProps) => {
    const { text, translateText } = props;

    const [flipped, setFlipped] = useState(false);
    const [learned, setLearned] = useState(false);

    const handleFlip = () => setFlipped(!flipped);
    const handleLearn = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setLearned(!learned);
    }

    const playSound = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const synth = window.speechSynthesis;
        const textSpeech = new SpeechSynthesisUtterance(text);
        textSpeech.lang = "fr-FR";
        synth.speak(textSpeech);
    }

    return (
        <div className={styles.flipCard} onClick={handleFlip}>
            <div className={`${styles.flipCardInner} ${flipped ? styles.flipped : ''} ${learned ? styles.learned : ''}`}>
                <div className={`${styles.flipCardFront} ${learned ? styles.learned : ''}`}>
                    {text}
                    <button className={styles.sound} onClick={playSound}>🔊</button>
                    <button className={styles.learnedText} onClick={handleLearn}>{learned ? "✅" : "❌"}</button>
                </div>
                <div className={styles.flipCardBack}>
                    {translateText}
                </div>
            </div>
        </div>
    );

};



