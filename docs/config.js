window.cookieConfig = {
    privacyPolicy: '/privacy.html',
    purposes: {
        'statistics' : {
            'en' : 'Statistics',
            'de' : 'Statistiken',
        },
        'security' : {
            'de' : 'Sicherheit',
            'en' : 'Security',
        }
    },
    apps : [
        {
            'name' : 'google-analytics',
            'title' : 'Google Analytics',
            'purposes' : ['statistics'],
            'description' : {
                'de' : 'Besucherstatistiken',
                'en' : 'Visitor Statistics',
            },
        },
        {
            'name' : 'matomo',
            'title' : 'Matomo/Piwik',
            'description' : {
                'de' : 'Besucherstatistiken',
                'en' : 'Visitor Statistics',
            },
        },
        {
            'name' : 'intercom',
            'title' : 'Intercom',
            'description' : {
                'de' : 'Chat Widget & Besucherstatistiken',
                'en' : 'Chat Widget & Visitor Statistics',
            },
        },
        {
            'name' : 'mouseflow',
            'title' : 'Mouseflow',
            'description' : {
                'de' : 'Echtzeit-Benutzeranalyse',
                'en' : 'Real-Time User Analytics',
            },
        },
    ],
}
