# Klaro! A Simple Consent Manager

Klaro is a simple consent manager that helps you to be transparent about the
third-party applications on your website. It is designed to be extremely
simple, intuitive and easy to use while allowing you to be compliant will
all relevant regulations (notably GDPR and ePrivacy).

## Advantages

* **Free and Open Source**: No third-party content / subscriptions / fees etc.
* **Extremely easy to use**: Simply add a small JS snippet to your site and
  you're good to go!
* **Flexible and customizable**: Manage consent for arbitrary Javascript
  and/or HTML-based integrations.
* **Multilingual**: We already support English and German and it is very easy
  to add your own translations as well.
* **Small footprint**: The minified JS is only 18 kB and contains everything
  that is required, including styles.
* **Intuitive and responsive**: The widget is designed to blend in well with
  your website design and is also optimized for mobile users. And if you
  want, you can easily customize the style as well.
* **Secure and reliable**: The widget ensures that no third-party apps or
  integrations are executed without the consent of the user (even when
  Javascript is disabled).

## Goals

Klaro helps you to ensures compliance and builds trust by doing the following things:

* Ensure that no third-party apps/integrations are executing before the user
  has given explicit (or -if you dare- implicit) consent.
* Allow the user to easily withdraw consent and customize the use of
  third party apps.

## Getting Started

To use the widget on your website, simply download [dist/consent.js](dist/consent.js)
as well as the example config [dist/config.js](dist/config.js). Follow the
instructions below to adapt the configuration to your needs and then include
the two files in your website like this:

    <script defer type="text/javascript" src="config.js"></script>
    <script defer type="text/javascript" src="klaro.js"></script>

## Managing Third-Party Scripts

To manage third-party scripts and ensure they only run if the user consents
with their use, you simply replace the `src` attribute with `data-src`,
and add a data field containing the name of the app as given in your config:

    <script data-type="text/javascript" data-name="optimizely" data-src="https://cdn.optimizely.com/js/10196010078.js" type="opt-in"></script>

ConsentManager will then take care of only executing the scripts if consent was
given (or if you chose to execute them before getting explicit consent).

The same method applies for HTML-based apps/integrations like stylesheets or
tracking pixels. Simply replace `src` with `data-src`, `type` with `data-type`
and add a `data-name` attribute that matches with the name given in your
configuration and you're good to go!

### Configuration File

The consent manager is configured using a config dictionary, which you typically
define in a separate JS file. Example:

    window.cookieConfig = {
        privacyPolicy: '/privacy.html',
        apps : [
            {
                name : 'google-analytics',
                title : 'Google Analytics',
                purposes : ['statistics'],
                description : {
                    de : 'Besucherstatistiken',
                    en : 'Visitor Statistics',
                },
            },
            {
                name : 'matomo',
                title : 'Matomo/Piwik',
                description : {
                    de : 'Besucherstatistiken',
                    en : 'Visitor Statistics',
                },
            },
            {
                name : 'intercom',
                title : 'Intercom',
                description : {
                    de : 'Chat Widget & Besucherstatistiken',
                    en : 'Chat Widget & Visitor Statistics',
                },
            },
            {
                name : 'mouseflow',
                title : 'Mouseflow',
                description : {
                    de : 'Echtzeit-Benutzeranalyse',
                    en : 'Real-Time User Analytics',
                },
                cookies : [/mouseflow/i],
            },
        ],
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
    }

It contains the following sections:

* **privacyPolicy**: A link to your privacy policy.
* **apps**: A list of third party apps and integrations for which you want to
  ask consent from the user. Each entry contains a name (which you refer in
  the `data-name` attribute in your HTML), a title and (multilingual)
  descriptions for each app. It can also contain a list of cookie names or
  regular expressions, which the consent manager will then remove when the
  user withdraws consent.
* **purposes**: A map of names that contains the translated names for a given
  purpose, such as collecting anonymized visitor statistics.

## Compiling from Scratch

If you want to customize the widget, add your own stylesheets or extend it
you can also build it from scratch using the following commands:

    npm install
    npm run-script make-dev #will run a development server
    npm run-script make #will produce the production version

## License

This project is licensed under a BSD-3 license.