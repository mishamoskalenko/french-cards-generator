"use client"
import { supabase } from "@/lib/supabaseClient";
import styles from "./page.module.css";
import { useEffect } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";


interface GoogleCredentialResponse {
    credential: string;
}

declare global {
    interface Window {
        google: any;
    }
}

export default function Welcome() {
    const t = useTranslations('welcome');
    const tLang = useTranslations('lang');
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const toggleLocale = () => {
        const locales = ["en", "fr", "es", "de", "uk"];
        const currentIndex = locales.indexOf(locale);
        const nextLocale = locales[(currentIndex + 1) % locales.length];
        router.replace(pathname, { locale: nextLocale });
    };

    useEffect(() => {
        const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
            });

            if (error) {
                console.error(error.message);
            }
            else {
                router.push('/generator')
            }
        };

        const initializeGoogleSignIn = () => {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: "544777769839-m26jn35rugh9tr8esjm4952efocdkkj1.apps.googleusercontent.com",
                    callback: handleCredentialResponse,
                    use_fedcm_for_prompt: true
                });

                const buttonDiv = document.getElementById("buttonDiv");
                if (buttonDiv) {
                    window.google.accounts.id.renderButton(
                        buttonDiv,
                        {
                            type: "standard",
                            shape: "pill",
                            theme: "outline",
                            text: "continue_with",
                            size: "large",
                            logo_alignment: "left"
                        }
                    );
                }
            }
        };

        if (window.google?.accounts) {
            initializeGoogleSignIn();
        } else {
            const interval = setInterval(() => {
                if (window.google?.accounts) {
                    initializeGoogleSignIn();
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, []);


    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <button className={styles.language} onClick={toggleLocale}>
                    <Image src="/language.svg" width={30} height={30} alt="language" />
                    <span className={styles.languageText}>{tLang(locale)}</span>
                </button>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>
                <div className={styles.loginContainer}>
                    <p className={styles.loginText}>{t('login')}</p>
                    <div id="buttonDiv" style={{ display: 'flex', justifyContent: 'center' }}></div>
                </div>
            </div>
        </div>
    );
}
