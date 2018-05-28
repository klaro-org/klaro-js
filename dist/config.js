
// By default, Klaro will load the config from  a global "klaroConfig" variable.
// You can change this by specifying the "data-config" attribute on your
// script take, e.g. like this:
// <script src="klaro.js" data-config="myConfigVariableName" />
// You can also disable auto-loading of the consent notice by adding
// data-no-auto-load=true to the script tag.
window.klaroConfig = {

    // You can customize the ID of the DIV element that Klaro will create
    // when starting up. If undefined, Klaro will use 'klaro'.
    elementID: 'klaro-manager',

    // You can customize the name of the cookie that Klaro uses for storing
    // user consent decisions. If undefined, Klaro will use 'klaro'.
    cookieName: 'klaro',

    // You can customize the name of the cookie that Klaro will use to
    // store user consent. If undefined, Klaro will use 'klaro'.
 
    // Put a link to your privacy policy here (relative or absolute).
    privacyPolicy: '/#privacy',
    
    // Defines the default state for applications (true=enabled by default).
    appDefault: true,

    // If "required" is set to true, Klaro will not allow the user to close
    // the modal before having actively consented.
    // Can be overwritten on a per-app basis.
    required: false,

    // If "optOut" is set to true, Klaro will enable all apps by default even
    // before the user actively consents (not recommended).
    // Can be overwritten on a per-app basis.
    optOut: true,

    // You can overwrite existing translations and add translations for your
    // app descriptions and purposes. See `src/translations.yml` for a full
    // list of translations that can be overwritten:
    // https://github.com/DPKit/klaro/blob/master/src/translations.yml

    // Example config that shows how to overwrite translations:
    // https://github.com/DPKit/klaro/blob/master/src/configs/i18n.js
    translations: {
        consentModal : {
            description : {
                de: 'Hier können Sie einsehen und anpassen, welche Information wir über Sie sammeln. Einträge die als "Beispiel" gekennzeichnet sind dienen lediglich zu Demonstrationszwecken und werden nicht wirklich verwendet.',
                en: 'Here you can see and customize the information that we collect about you. Entries marked as "Example" are just for demonstration purposes and are not really used on this website.',
            },
        },
        // Add an entry for each app that you define below, using the name of
        // the app that you chose.
        googleAnalytics : {

            // Add translations for the description of the app for all
            // languages that you want to support.
            description : {
                de : 'Sammeln von Besucherstatistiken (Beispiel)',
                en : 'Collecting of visitor statistics (Example)',
            },
        },
        adsense : {
            description : {
                de : 'Anzeigen von Werbeanzeigen (Beispiel)',
                en : 'Displaying of advertisements (Example)',
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
                de : 'Chat Widget & Sammeln von Besucherstatistiken (Beispiel)',
                en : 'Chat widget & collecting of visitor statistics (Example)',
            },            
        },
        mouseflow : {
            description : {
                de : 'Echtzeit-Benutzeranalyse (Beispiel)',
                en : 'Real-Time user analytics (Example)',
            },            
        },

        // The purposes will be displayed in the consent notice, make sure
        // to add translations for each purposes you give in the 'apps' section.
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

    // This is a list of third-party apps that Klaro will manage for you.
    apps : [
        {
            // Each app should have a unique (and short) name.
            name : 'googleAnalytics',

            // Tf "default" is set to true, the app will be enabled by default
            // (overwrites global "appDefault" setting).
            default: true,
            
            // The title of you app as listed in the consent modal.
            title : 'Google Analytics',

            // The purpose(s) of this app. Will be listed on the consent notice.
            // Do not forget to add translations for all purposes you list here.
            purposes : ['analytics'],
            
            // A list of regex expressions or strings giving the names of
            // cookies set by this app. If the user withdraws consent for a
            // given app, Klaro will then automatically delete all matching
            // cookies.
            cookies : [/^ga_/i],
            
            // An optional callback function that will be called each time
            // the consent state for the app changes (true=consented). Passes
            // the `app` config as the second parameter as well.
            callback : function(consent, app){
                // This is an example callback function.
            },

            // If "required" is set to true, Klaro will not allow this app to
            // be disabled by the user.
            required : false,

            // If "optOut" is set to true, Klaro will load this app even before
            // the user gave explicit consent. Not recommended.
            optOut : false,
        },

        // The apps will appear in the modal in the same order as defined here.
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
            title : 'Intercom',
            purposes : ['livechat'],
        },
        {
            name : 'adsense',
            title : 'Google AdSense',
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