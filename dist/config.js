window.consentConfig = {
    privacyPolicy: '/privacy.html',
    appDefault: true,
//    required: true,
//    optOut: true,
    translations: {
        'google-analytics' : {
            description : {
                de : 'Besucherstatistiken',
                en : 'Visitor Statistics',
            },
        },
        matomo : {
            description : {
                de : 'Besucherstatistiken',
                en : 'Visitor Statistics',
            },
        },
        intercom : {
            description : {
                de : 'Chat Widget & Besucherstatistiken',
                en : 'Chat Widget & Visitor Statistics',
            },            
        },
        mouseflow : {
            description : {
                de : 'Echtzeit-Benutzeranalyse',
                en : 'Real-Time User Analytics',
            },            
        },
        purposes: {
            statistics : {
                en : 'Statistics',
                de : 'Statistiken',
            },
            security : {
                de : 'Sicherheit',
                en : 'Security',
            }
        },    
    },
    apps : [
        {
            name : 'google-analytics',
            default: true,
            title : 'Google Analytics',
            purposes : ['statistics'],
            
            cookies : [/^ga_/i],
            callback : function(consent, app){
                //this is an example callback function...
            },
        },
        {
            name : 'matomo',
            title : 'Matomo/Piwik',
        },
        {
            name : 'intercom',
            title : 'Intercom',
        },
        {
            name : 'mouseflow',
            title : 'Mouseflow',
            cookies : [/mouseflow/i],
        },
    ],
}