// By default, Klaro will load the config from  a global "klaroConfig" variable.
// You can change this by specifying the "data-config" attribute on your
// script take, e.g. like this:
// <script src="klaro.js" data-config="myConfigVariableName" />
var klaroConfig = {
    // With the 0.7.0 release we introduce a 'version' paramter that will make
    // it easier for us to keep configuration files backwards-compatible in the future.
    version: 1,

    // You can customize the ID of the DIV element that Klaro will create
    // when starting up. If undefined, Klaro will use 'klaro'.
    elementID: 'klaro',

    // You can override CSS style variables here. For IE11, Klaro will
    // dynamically inject the variables into the CSS. If you still consider
    // supporting IE9-10 (which you probably shouldn't) you need to use Klaro
    // with an external stylesheet as the dynamic replacement won't work there.
    styling: {
        theme: ['light', 'top', 'wide'],
    },

    // You can show a description in contextual consent overlays for store 
    // being empty. In that case the accept always button is omitted. 
    // The description contains a link for opening the consent manager. 
    showDescriptionEmptyStore: true,

    // Setting this to true will keep Klaro from automatically loading itself
    // when the page is being loaded.
    noAutoLoad: false,

    // Setting this to true will render the descriptions of the consent
    // modal and consent notice are HTML. Use with care.
    htmlTexts: true,

    // Setting 'embedded' to true will render the Klaro modal and notice without
    // the modal background, allowing you to e.g. embed them into a specific element
    // of your website, such as your privacy notice.
    embedded: false,

    // You can group services by their purpose in the modal. This is advisable
    // if you have a large number of services. Users can then enable or disable
    // entire groups of services instead of having to enable or disable every service.
    groupByPurpose: true,

    // You can make the consent notice autofocused by enabling the following option
    autoFocus: false,

    // You can show a title in the consent notice by enabling the following option
    showNoticeTitle: false,

    // How Klaro should store the user's preferences. It can be either 'cookie'
    // (the default) or 'localStorage'.
    storageMethod: 'cookie',

    // You can customize the name of the cookie that Klaro uses for storing
    // user consent decisions. If undefined, Klaro will use 'klaro'.
    cookieName: 'klaro',

    // You can also set a custom expiration time for the Klaro cookie.
    // By default, it will expire after 120 days.
    cookieExpiresAfterDays: 365,

    // You can change to cookie domain for the consent manager itself.
    // Use this if you want to get consent once for multiple matching domains.
    // If undefined, Klaro will use the current domain.
    //cookieDomain: '.github.com',

    // You can change to cookie path for the consent manager itself.
    // Use this to restrict the cookie visibility to a specific path.
    // If undefined, Klaro will use '/' as cookie path.
    //cookiePath: '/',

    // Defines the default state for services (true=enabled by default).
    default: false,

    // If "mustConsent" is set to true, Klaro will directly display the consent
    // manager modal and not allow the user to close it before having actively
    // consented or declines the use of third-party services.
    mustConsent: false,

    // Show "accept all" to accept all services instead of "ok" that only accepts
    // required and "default: true" services
    acceptAll: true,

    // replace "decline" with cookie manager modal
    hideDeclineAll: false,

    // hide "learnMore" link
    hideLearnMore: false,

    // show cookie notice as modal
    noticeAsModal: false,

    // You can also remove the 'Realized with Klaro!' text in the consent modal.
    // Please don't do this! We provide Klaro as a free open source tool.
    // Placing a link to our website helps us spread the word about it,
    // which ultimately enables us to make Klaro! better for everyone.
    // So please be fair and keep the link enabled. Thanks :)
    //disablePoweredBy: true,

    // you can specify an additional class (or classes) that will be added to the Klaro `div`
    //additionalClass: 'my-klaro',

    // You can define the UI language directly here. If undefined, Klaro will
    // use the value given in the global "lang" variable. If that does
    // not exist, it will use the value given in the "lang" attribute of your
    // HTML tag. If that also doesn't exist, it will use 'en'.
    //lang: 'en',

    // You can overwrite existing translations and add translations for your
    // service descriptions and purposes. See `src/translations/` for a full
    // list of translations that can be overwritten:
    // https://github.com/KIProtect/klaro/tree/master/src/translations

    // Example config that shows how to overwrite translations:
    // https://github.com/KIProtect/klaro/blob/master/src/configs/i18n.js
    translations: {
        // translationsed defined under the 'zz' language code act as default
        // translations.
        zz: {
            privacyPolicyUrl: '/#privacy',
        },
        // If you erase the "consentModal" translations, Klaro will use the
        // bundled translations.
        de: {
            privacyPolicyUrl: '/#datenschutz',
            consentModal: {
                description:
                    'Hier können Sie einsehen und anpassen, welche Information wir über Sie sammeln. Einträge die als "Beispiel" gekennzeichnet sind dienen lediglich zu Demonstrationszwecken und werden nicht wirklich verwendet.',
            },
            inlineTracker: {
                description: 'Beispiel für ein Inline-Tracking Skript',
            },
            externalTracker: {
                description: 'Beispiel für ein externes Tracking Skript',
            },
            adsense: {
                description: 'Anzeigen von Werbeanzeigen (Beispiel)',
                title: 'Google AdSense Werbezeugs',
            },
            matomo: {
                description: 'Sammeln von Besucherstatistiken',
            },
            camera: {
                description:
                    'Eine Überwachungskamera (nur ein Beispiel zu IMG-Tags)',
            },
            cloudflare: {
                description: 'Schutz gegen DDoS-Angriffe',
            },
            intercom: {
                description:
                    'Chat Widget & Sammeln von Besucherstatistiken (nur ein Beispiel)',
            },
            mouseflow: {
                description: 'Echtzeit-Benutzeranalyse (nur ein Beispiel)',
            },
            googleFonts: {
                description: 'Web-Schriftarten von Google gehostet',
            },
            purposes: {
                analytics: 'Besucher-Statistiken',
                security: 'Sicherheit',
                livechat: 'Live Chat',
                advertising: 'Anzeigen von Werbung',
                styling: 'Styling',
            },
        },
        en: {
            consentModal: {
                title: '<u>test</u>',
                description:
                    'Here you can see and customize the information that we collect about you. Entries marked as "Example" are just for demonstration purposes and are not really used on this website.',
            },
            inlineTracker: {
                description: 'Example of an inline tracking script',
            },
            externalTracker: {
                description: 'Example of an external tracking script',
            },
            adsense: {
                description: 'Displaying of advertisements (just an example)',
                title: 'Google Adsense Advertisement',
            },
            matomo: {
                description: 'Collecting of visitor statistics',
            },
            camera: {
                description:
                    'A surveillance camera (just an example for an IMG tag)',
            },
            cloudflare: {
                description: 'Protection against DDoS attacks',
            },
            intercom: {
                description:
                    'Chat widget & collecting of visitor statistics (just an example)',
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
            },
        },
    },

    // This is a list of third-party services that Klaro will manage for you.
    services: [
        {
            name: 'twitter',
            default: false,
            contextualConsentOnly: true,
            purposes: ['marketing'],
        },
        {
            name: 'youtube',
            default: true,
            purposes: ['marketing'],
        },
        {
            // Each service should have a unique (and short) name.
            name: 'matomo',

            // If "default" is set to true, the service will be enabled by default
            // Overwrites global "default" setting.
            // We recommend leaving this to "false" for services that collect
            // personal information.
            default: true,

            // The title of your service as listed in the consent modal.
            title: 'Matomo/Piwik',

            // The purpose(s) of this service. Will be listed on the consent notice.
            // Do not forget to add translations for all purposes you list here.
            purposes: ['analytics'],

            // A list of regex expressions or strings giving the names of
            // cookies set by this service. If the user withdraws consent for a
            // given service, Klaro will then automatically delete all matching
            // cookies.
            cookies: [
                // you can also explicitly provide a path and a domain for
                // a given cookie. This is necessary if you have services that
                // set cookies for a path that is not "/" or a domain that
                // is not the current domain. If you do not set these values
                // properly, the cookie can't be deleted by Klaro
                // (there is no way to access the path or domain of a cookie in JS)
                // Notice that it is not possible to delete cookies that were set
                // on a third-party domain! See the note at mdn:
                // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#new-cookie_domain
                [/^_pk_.*$/, '/', 'klaro.kiprotect.com'], //for the production version
                [/^_pk_.*$/, '/', 'localhost'], //for the local version
                'piwik_ignore',
            ],

            // An optional callback function that will be called each time
            // the consent state for the service changes (true=consented). Passes
            // the `service` config as the second parameter as well.
            callback: function(consent, service) {
                // This is an example callback function.
                console.log(
                    'User consent for service ' + service.name + ': consent=' + consent
                );
                // To be used in conjunction with Matomo 'requireCookieConsent' Feature, Matomo 3.14.0 or newer
                // For further Information see https://matomo.org/faq/new-to-piwik/how-can-i-still-track-a-visitor-without-cookies-even-if-they-decline-the-cookie-consent/
                /*
                if(consent==true){
                    _paq.push(['rememberCookieConsentGiven']);
                } else {
                    _paq.push(['forgetCookieConsentGiven']);
                }
                */
            },

            // If "required" is set to true, Klaro will not allow this service to
            // be disabled by the user.
            required: false,

            // If "optOut" is set to true, Klaro will load this service even before
            // the user gave explicit consent.
            // We recommend always leaving this "false".
            optOut: false,

            // If "onlyOnce" is set to true, the service will only be executed
            // once regardless how often the user toggles it on and off.
            onlyOnce: true,
        },

        // The services will appear in the modal in the same order as defined here.
        {
            name: 'inlineTracker',
            title: 'Inline Tracker',
            purposes: ['analytics'],
            cookies: ['inline-tracker'],
            optOut: false,
        },
        {
            name: 'externalTracker',
            title: 'External Tracker',
            purposes: ['analytics', 'security'],
            cookies: ['external-tracker'],
        },
        {
            name: 'intercom',
            title: 'Intercom',
            default: true,
            purposes: ['livechat'],
        },
        {
            name: 'mouseflow',
            title: 'Mouseflow',
            purposes: ['analytics'],
        },
        {
            name: 'adsense',
            // if you omit the title here Klaro will try to look it up in the
            // translations
            //title: 'Google AdSense',
            purposes: ['advertising'],
        },
        {
            name: 'camera',
            title: 'Surveillance Camera',
            purposes: ['security'],
        },
/*        {
            name: 'googleFonts',
            title: 'Google Fonts',
            purposes: ['styling'],
        },*/
        {
            name: 'cloudflare',
            title: 'Cloudflare',
            purposes: ['security'],
            required: true,
        },
    ],
};
