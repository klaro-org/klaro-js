var klaroConfig = {
    elementID: 'klaro',
    storageMethod: 'localStorage',
    cookieName: 'klaro',
    cookieExpiresAfterDays: 243,
    lang: 'de',
    noNotice: false,
    noFloating: false,
    hideDeclineAll: true,
    acceptAll: false,
    privacyPolicy: {
        de: '/datenschutz',
    },
    default: true,
    translations: {
        de: {
            consentModal: {
                title: 'Dies ist der Titel des Zustimmungs-Dialogs',
                description:
                    'Hier können Sie einsehen und anpassen, welche Information wir über Sie sammeln.',
                privacyPolicy: {
                    text:
                        'Dies ist der Text mit einem Link zu Ihrer {privacyPolicy}.',
                    name: 'Datenschutzseite',
                },
            },
            purposes: {
                analytics: 'Besucher-Statistiken',
                security: 'Sicherheit',
                accessability: 'Nutzerzugänglichkeit',
                content: 'Inhalte',
            },
            consentNotice: {
                changeDescription:
                    'Es gab Änderungen seit Ihrem letzten Besuch, bitte aktualisieren Sie Ihre Auswahl.',
                description:
                    'Wir speichern und verarbeiten Ihre personenbezogenen Informationen für folgende Zwecke: {purposes}. Ihre Einwilligung können Sie jederzeit auf unserer {privacyPolicy} widerrufen.',
                learnMore: 'Mehr erfahren',
            },
            ok: 'OK',
            save: 'Speichern',
            decline: 'Ablehnen',
            close: 'Schließen',
            acceptSelected: 'Empfohlene Cookies verwenden',
            acceptAll: 'Allen zustimmen',
            cookieSettings: 'Cookies bearbeiten',
            matomo: {
                description: 'Sammeln von Besucherstatistiken',
            },
            readspeaker: {
                description:
                    'Aufbewahrung des Kernjavascripts und Speichern der Nutzereinstellungen der Readpspeaker Vorlese-Funktion.',
            },
            soundcloud: {
                description: 'SoundCloud stellt Audioinhalte zur Verfügung.',
            },
            youtube: {
                description: 'Stellt Videoinhalte per iFrame zur Verfügung',
            },
            Vimeo: {
                description: 'Stellt Videoinhalte per iFrame bereit.',
            },
        },
    },
    apps: [
        {
            name: 'matomo',
            title: 'Matomo/Piwik',
            purposes: ['analytics'],
            cookies: [
                ['/^_pk_.*$/', '/'],
                ['/^mtm_.*$/', '/'],
            ],
            required: true,
            default: false,
        },
        {
            name: 'readspeaker',
            title: 'Readspeaker',
            purposes: ['accessability'],
            cookies: [
                ['/^_rspkr.*$/', '/'],
                ['/^ReadSpeaker.*$/', '/'],
            ],
            required: false,
            default: true,
        },
        {
            name: 'soundcloud',
            title: 'SoundCloud',
            purposes: ['content'],
            cookies: [],
            required: false,
            default: false,
        },
        {
            name: 'youtube',
            title: 'YouTube',
            purposes: ['content'],
            cookies: [],
            required: false,
            default: false,
        },
        {
            name: 'Vimeo',
            title: 'Vimeo',
            purposes: ['content'],
            cookies: [],
            required: false,
            default: false,
        },
    ],
};
