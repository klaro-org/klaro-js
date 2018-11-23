
// By default, Orejime will load the config from  a global "orejimeConfig" variable.
// You can change this by specifying the "data-config" attribute on your
// script take, e.g. like this:
// <script src="orejime.js" data-config="myConfigVariableName" />
// You can also disable auto-loading of the consent notice by adding
// data-no-auto-load=true to the script tag.
var orejimeConfig = {

    // You can customize the ID of the DIV element that Orejime will create
    // when starting up. If undefined, Orejime will use 'orejime'.
    elementID: 'orejime',

    // For accessibility's sake, the modal must know what is the element
    // containing your app or website
    appElement: '#app',

    // You can customize the name of the cookie that Orejime uses for storing
    // user consent decisions. If undefined, Orejime will use 'orejime'.
    cookieName: 'orejime',

    // You can also set a custom expiration time for the Orejime cookie.
    // By default, it will expire after 120 days.
    cookieExpiresAfterDays: 365,

    // You can customize the name of the cookie that Orejime will use to
    // store user consent. If undefined, Orejime will use 'orejime'.
 
    // Put a link to your privacy policy here (relative or absolute).
    privacyPolicy: '/#privacy',
    
    // Defines the default state for applications (true=enabled by default).
    default: true,

    // If "mustConsent" is set to true, Orejime will directly display the consent
    // manager modal and not allow the user to close it before having actively
    // consented or declines the use of third-party apps.
    mustConsent: false,

    // if "implicitConsent" is set to true, Orejime will automatically accept
    // cookies if the user continues his navigation on the website after the
    // first page. If you enable this, it's recommended to warn the user
    // of this behavior in the notice window.
    implicitConsent: false,

    // You can define the UI language directly here. If undefined, Orejime will
    // use the value given in the global "lang" variable. If that does
    // not exist, it will use the value given in the "lang" attribute of your
    // HTML tag. If that also doesn't exist, it will use 'en'.
    //lang: 'en',

    // You can overwrite existing translations and add translations for your
    // app descriptions and purposes. See `src/translations.yml` for a full
    // list of translations that can be overwritten:
    // https://github.com/DPKit/orejime/blob/master/src/translations.yml

    // Example config that shows how to overwrite translations:
    // https://github.com/DPKit/orejime/blob/master/src/configs/i18n.js
    translations: {
        // If you erase the "consentModal" translations, Orejime will use the
        // defaults as defined in translations.yml
        de: {
            consentModal: {
                description: 'Hier können Sie einsehen und anpassen, welche Information wir über Sie sammeln. Einträge die als "Beispiel" gekennzeichnet sind dienen lediglich zu Demonstrationszwecken und werden nicht wirklich verwendet.',
            },
            inlineTracker: {
                description: 'Beispiel für ein Inline-Tracking Skript',
            },
            externalTracker: {
                description: 'Beispiel für ein externes Tracking Skript',
            },
            adsense: {
                description: 'Anzeigen von Werbeanzeigen (Beispiel)',
            },
            matomo: {
                description: 'Sammeln von Besucherstatistiken',
            },
            camera: {
                description: 'Eine Überwachungskamera (nur ein Beispiel zu IMG-Tags)',
            },
            cloudflare: {
                description: 'Schutz gegen DDoS-Angriffe',
            },
            intercom: {
                description: 'Chat Widget & Sammeln von Besucherstatistiken (nur ein Beispiel)',
            },
            mouseflow: {
                description: 'Echtzeit-Benutzeranalyse (nur ein Beispiel)',
            },
            googleFonts: {
                description: 'Web-Schriftarten von Google gehostet'
            },
            purposes: {
                analytics: 'Besucher-Statistiken',
                security: 'Sicherheit',
                livechat: 'Live Chat',
                advertising: 'Anzeigen von Werbung',
                styling: 'Styling',
            }
        },
        en: {
            consentModal: {
                description: 'Here you can see and customize the information that we collect about you. Entries marked as "Example" are just for demonstration purposes and are not really used on this website.',
            },
            inlineTracker: {
                description: 'Example of an inline tracking script',
            },
            externalTracker: {
                description: 'Example of an external tracking script',
            },
            adsense: {
                description: 'Displaying of advertisements (just an example)',
            },
            matomo: {
                description: 'Collecting of visitor statistics',
            },
            camera: {
                description: 'A surveillance camera (just a silly example for an IMG tag)',
            },
            cloudflare: {
                description: 'Protection against DDoS attacks',
            },
            intercom: {
                description: 'Chat widget & collecting of visitor statistics (just an example)',
            },
            mouseflow: {
                description: 'Real-Time user analytics (just an example)',
            },
            googleFonts: {
                description: 'Web fonts hosted by Google',
            },
            purposes: {
                analytics: 'Analytics',
                security: 'Security',
                livechat: 'Livechat',
                advertising: 'Advertising',
                styling: 'Styling',
            }
        },
    },

    // This is a list of third-party apps that Orejime will manage for you.
    apps : [
        {
            // Each app should have a unique (and short) name.
            name : 'matomo',

            // If "default" is set to true, the app will be enabled by default
            // Overwrites global "default" setting.
            // We recommend leaving this to "false" for apps that collect
            // personal information.
            default: true,

            // The title of you app as listed in the consent modal.
            title : 'Matomo/Piwik',

            // The purpose(s) of this app. Will be listed on the consent notice.
            // Do not forget to add translations for all purposes you list here.
            purposes : ['analytics'],
            
            // A list of regex expressions or strings giving the names of
            // cookies set by this app. If the user withdraws consent for a
            // given app, Orejime will then automatically delete all matching
            // cookies.
            cookies : [
                // you can also explicitly provide a path and a domain for
                // a given cookie. This is necessary if you have apps that
                // set cookies for a path that is not "/" or a domain that
                // is not the current domain. If you do not set these values
                // properly, the cookie can't be deleted by Orejime
                // (there is no way to access the path or domain of a cookie in JS)
                [/^_pk_.*$/, '/', 'orejime.kiprotect.com'], //for the production version
                [/^_pk_.*$/, '/', 'localhost'], //for the local version
                'piwik_ignore'],
            
            // An optional callback function that will be called each time
            // the consent state for the app changes (true=consented). Passes
            // the `app` config as the second parameter as well.
            callback : function(consent, app){
                // This is an example callback function.
                console.log("User consent for app "+app.name+": consent="+consent)
            },

            // If "required" is set to true, Orejime will not allow this app to
            // be disabled by the user.
            required : false,

            // If "optOut" is set to true, Orejime will load this app even before
            // the user gave explicit consent.
            // We recommend always leaving this "false".
            optOut : false,

            // If "onlyOnce" is set to true, the app will only be executed
            // once regardless how often the user toggles it on and off.
            onlyOnce: true,
        },

        // The apps will appear in the modal in the same order as defined here.
        {
            name : 'inlineTracker',
            title : 'Inline Tracker',
            purposes : ['analytics'],
            cookies : ['inline-tracker'],
            optOut: false,
        },
        {
            name : 'externalTracker',
            title : 'External Tracker',
            purposes : ['analytics', 'security'],
            cookies : ['external-tracker'],
        },
        {
            name : 'intercom',
            title : 'Intercom',
            purposes : ['livechat'],
        },
        {
            name : 'mouseflow',
            title : 'Mouseflow',
            purposes : ['analytics'],
        },
        {
            name : 'adsense',
            title : 'Google AdSense',
            purposes : ['advertising']
        },
        {
            name : 'camera',
            title : 'Surveillance Camera',
            purposes : ['security']
        },
        {
            name : 'googleFonts',
            title : 'Google Fonts',
            purposes : ['styling']
        },
        {
            name : 'cloudflare',
            title : 'Cloudflare',
            purposes : ['security'],
            required: true,
        },
    ],
}