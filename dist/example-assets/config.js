window.orejimeConfig = {
    appElement: "#app",
    privacyPolicy: "#privacyPolicy",
    translations: {
        en: {
            consentModal: {
                description: "Here is an example of Orejime. View the source code to see how everything is done.",
            },
            "inline-tracker": {
                description: "Example of an inline tracking script that sets a dummy cookie",
            },
            "external-tracker": {
                description: "Example of an external tracking script that sets a dummy cookie",
            },
            "always-on": {
                description: "this example app will not set any cookie",
            },
            "disabled-by-default": {
                description: "this example app will not set any cookie",
            },
            purposes: {
                analytics: "Analytics",
                security: "Security",
                ads: "Ads"
            }
        },
    },
    apps: [
        {
            name: "inline-tracker",
            title: "Inline Tracker",
            purposes: ["analytics"],
            cookies: ["inline-tracker"]
        },
        {
            name: "external-tracker",
            title: "External Tracker",
            purposes: ["analytics", "security"],
            cookies: ["external-tracker"],
        },
        {
            name: "disabled-by-default",
            title: "Something disabled by default",
            purposes: ["ads"],
            default: false
        },
        {
            name: "always-on",
            title: "Required app",
            purposes: [],
            required: true
        }
    ],
}
