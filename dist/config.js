window.consentConfig = {
    privacyPolicy: '/privacy.html',
    appDefault: true,
//    required: true,
//    optOut: true,
    translations: {
        googleAnalytics : {
            description : {
                de : 'Sammeln von Besucherstatistiken',
                en : 'Collecting of visitor statistics',
            },
        },
        adsense : {
            description : {
                de : 'Anzeigen von Werbeanzeigen',
                en : 'Displaying of advertisements',
            },
        },
        matomo : {
            description : {
                de : 'Sammeln von Besucherstatistiken',
                en : 'Collecting of visitor statistics',
            },
        },
        intercom : {
            description : {
                de : 'Chat Widget & Sammeln von Besucherstatistiken',
                en : 'Chat widget & collecting of visitor statistics',
            },            
        },
        mouseflow : {
            description : {
                de : 'Echtzeit-Benutzeranalyse',
                en : 'Real-Time user analytics',
            },            
        },
        purposes: {
            analytics : {
                en : 'Analytics',
                de : 'Besucher-Statistiken',
            },
            security : {
                de : 'Sicherheit',
                en : 'Security',
            },
            livechat : {
                de : 'Livechat',
                en : 'Live Chat',
            },
            advertising : {
                de : 'Anzeigen von Werbung',
                en : 'Advertising',
            },
        },    
    },
    apps : [
        {
            name : 'googleAnalytics',
            default: true,
            title : 'Google Analytics',
            purposes : ['analytics'],
            
            cookies : [/^ga_/i],
            callback : function(consent, app){
                //this is an example callback function...
            },
        },
        {
            name : 'matomo',
            title : 'Matomo/Piwik',
            purposes : ['analytics'],
        },
        {
            name : 'intercom',
            title : 'Intercom',
            purposes : ['livechat'],
        },
        {
            name : 'mouseflow',
            title : 'Mouseflow',
            cookies : [/mouseflow/i],
            purposes : ['analytics']
        },
        {
            name : 'adsense',
            title : 'Google AdSense',
            cookies : [/adsense/i],
            purposes : ['advertising']
        },
    ],
}