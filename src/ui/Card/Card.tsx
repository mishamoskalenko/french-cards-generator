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
    const handleClick = () => setFlipped(!flipped);

    const playSound = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const synth = window.speechSynthesis;
        const textSpeech = new SpeechSynthesisUtterance(text);
        textSpeech.lang = "fr-FR";
        synth.speak(textSpeech);
    }

    return (
        <div className={styles.flipCard} onClick={handleClick}>
            <div className={`${styles.flipCardInner} ${flipped ? styles.flipped : ''}`}>
                <div className={styles.flipCardFront}>
                    {text}
                    <button className={styles.sound} onClick={playSound}>🔊</button>
                </div>
                <div className={styles.flipCardBack}>
                    {translateText}
                </div>
            </div>
        </div>
    );

};



