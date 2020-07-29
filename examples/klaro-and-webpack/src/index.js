
// you can also import Klaro without styles
import * as Klaro from "klaro/dist/klaro-no-css";
import "klaro/dist/klaro.css"

// we define a minimal configuration
const config = {
    translations: {
        en: {
            googleAnalytics: {
                title: "Google Analytics",
                description: "The analytics service ran by a most definitely non-evil company.",
            },
            purposes: {
                analytics: "Analytics",
            }
        }
    },
    apps: [
        {
            name: "googleAnalytics",
            purposes: ["analytics"],
        },
    ],
    privacyPolicy: "",
};

// we assign the Klaro module to the window, so that we can access it in JS
window.klaro = Klaro;
window.config = config;