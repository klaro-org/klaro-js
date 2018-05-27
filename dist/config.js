window.klaroConfig = {
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
        cloudflare : {
            description : {
                de : 'Schutz gegen DDoS-Angriffe',
                en : 'Protection against DDoS attacks',
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
            title : 'Google Analytics (just an example)',
            purposes : ['analytics'],
            
            cookies : [/^ga_/i],
            callback : function(consent, app){
                //this is an example callback function...
            },
        },
        {
            name : 'mouseflow',
            title : 'Mouseflow',
            cookies : [/mouseflow/i],
            purposes : ['analytics']
        },
        {
            name : 'matomo',
            title : 'Matomo/Piwik',
            purposes : ['analytics'],
        },
        {
            name : 'intercom',
            title : 'Intercom (just an example)',
            purposes : ['livechat'],
        },
        {
            name : 'adsense',
            title : 'Google AdSense (just an example)',
            cookies : [/adsense/i],
            purposes : ['advertising']
        },
        {
            name : 'cloudflare',
            title : 'Cloudflare',
            purposes : ['security'],
            required: true,
        },
    ],
}