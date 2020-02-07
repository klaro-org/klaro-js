var klaroI18nConfig = {
    cookieName: 'klaro-i18n',
    elementID: 'i18n',
    lang: 'en',
    noNotice: true,
    privacyPolicy: {
        default: '/#privacy',
        de: '/#datenschutz',
    },
    poweredBy:
        'https://github.com/KIProtect/klaro/blob/master/dist/configs/i18n.js',
    default: true,
    translations: {
        // these values will overwrite the defaults. For a full list, have a look
        // at the `src/translations` directory of this repo:
        // https://github.com/KIProtect/klaro/tree/master/src/translations
        de: {
            consentModal: {
                title: 'Dies ist der Titel des Zustimmungs-Dialogs',
                description:
                    'Dies ist die Beschreibung des Zustimmungs-Dialogs.',
                privacyPolicy: {
                    text:
                        'Dies ist der Text mit einem Link zu Ihrer {privacyPolicy}.',
                    name: 'Datenschutzerklärung (Name)',
                },
            },
            poweredBy: 'Konfiguration ansehen',
            ok: "Los geht's!",
            purposes: {
                analytics: 'Besucher-Statistiken',
                security: 'Sicherheit',
                livechat: 'Live-Chat',
                advertisting: 'Anzeigen von Werbung',
            },
            googleAnalytics: {
                description: 'Sammeln von Besucherstatistiken',
            },
            mouseflow: {
                description: 'Echtzeit-Benutzeranalyse',
            },
        },
        en: {
            consentModal: {
                title: 'This is the title of the consent modal',
                description: 'This is the description of the consent modal.',
                privacyPolicy: {
                    text: 'This is the text with a link to your {privacyPolicy}.',
                    name: 'privacy policy (the name)',
                },
            },
            poweredBy: 'view config',
            ok: 'Wohoo!',
            purposes: {
                analytics: 'Analytics',
                security: 'Security',
                livechat: 'Livechat',
            },
            googleAnalytics: {
                description: 'Collection of visitor statistics',
            },
            mouseflow: {
                description: 'Real-time user analytics',
            },
        },
        tr: {
            consentModal: {
                title: 'Bu, izin penceresinin başlığı',
                description: 'Bu, izin penceresi için açıklama.',
                privacyPolicy: {
                    text: 'Bu {privacyPolicy} için bir bağlantı.',
                    name: 'Gizlilik Politikası (isim)',
                },
            },
            poweredBy: 'Yapılandırmayı Görüntüle',
            ok: 'Wohoo!',
            purposes: {
                analytics: 'Analitik',
                security: 'Güvenlik',
                livechat: 'Canlı Sohbet',
            },
            googleAnalytics: {
                description: 'Ziyaretçi istatistiklerini toplama',
            },
            mouseflow: {
                description: 'Gerçek zamanlı kullanıcı istatistiği',
            },
        },
    },
    apps: [
        {
            name: 'googleAnalytics',
            title: 'Google Analytics',
            purposes: ['analytics'],
        },
        {
            name: 'mouseflow',
            title: 'Mouseflow',
            purposes: ['analytics'],
        },
    ],
};
