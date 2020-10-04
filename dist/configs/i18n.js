var klaroI18nConfig = {
    version: 2,
    cookieName: 'klaro-i18n',
    elementID: 'klaro',
    lang: 'en',
    default: true,
    noNotice: true,
    poweredBy:
        'https://github.com/KIProtect/klaro/blob/master/dist/configs/i18n.js',
    translations: {
        // these values will overwrite the defaults. For a full list, have a look
        // at the `src/translations` directory of this repo:
        // https://github.com/KIProtect/klaro/tree/master/src/translations
        zz: {
            privacyPolicyUrl: '/#privacy',
        },
        de: {
            privacyPolicyUrl: '/#datenschutz',
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
    },
    services: [
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
