# Klaro! A Simple Consent Manager

Klaro [klɛro] is a simple consent manager that helps you to be transparent about the
third-party applications on your website. It is designed to be extremely
simple, intuitive and easy to use while allowing you to be compliant will
all relevant regulations (notably GDPR and ePrivacy).

# Demo

![Klaro in Action](dist/assets/demo.gif)

## Advantages

* **Free and Open Source**: No hidden fees, subscriptions or restrictions.
* **Easy to use**: Simply add a small JS snippet and config to your site and
  you're ready to go!
* **Flexible and customizable**: Manage consent for all possible types of
  third-party apps and easily customize the tool according to your needs.
* **Multilingual**: Full internationalization support with English and
  German translations included. New translations can be added in just a few
  lines of code. (Contributions welcome!)
* **Small footprint**: The minified+gzipped JS is only 18 kB and contains
  everything that is required, including stylesheets and images.
* **Intuitive and responsive**: Klaro is designed to blend in with
  your existing design and is optimized for desktop and mobile client. It is
  compatible with all modern browsers.
* **Secure and reliable**: Klaro ensures that no third-party apps or
  trackers are executed without the consent of the user, even when
  Javascript is disabled or the Klaro itself gets blocked.

## Goals

Klaro helps you to manage user consent and generate trust by doing the following things:

* Ensure that no third-party apps/integrations are executing before the user
  has given explicit (or -if you dare- implicit) consent.
* Allow the user to easily manage and customize consent decision.


## Getting Started

To use the widget on your website, simply download [dist/klaro.js](dist/klaro.js)
as well as the example config [dist/config.js](dist/config.js). Follow the
instructions below to adapt the config to your needs and then include
the two files in your website like this:

    <script defer type="text/javascript" src="config.js"></script>
    <script defer type="text/javascript" src="klaro.js"></script>

Do not forget to change your existing apps/trackers as outlined in the next
section as well.

## Managing Third-Party Apps/Trackers

To manage third-party scripts and ensure they only run if the user consents
with their use, you simply replace the `src` attribute with `data-src`,
change the `type` attribute to `opt-in` and add a `data-type` attribute with
the original type, and add a `data-name` field that matches the name of the app
as given in your config file. Example:

    <script type="opt-in"
            data-type="text/javascript"
            data-name="optimizely"
            data-src="https://cdn.optimizely.com/js/10196010078.js">
    </script>

Klaro will then take care of executing the scripts if consent was
given (you can chose to execute them before getting explicit consent as well).

The same method also works for images, stylesheets and other elements with
a `src` or `type` attribute.

### Configuration File

The consent manager is configured using a config dictionary, which you typically
define in a separate JS file. To learn more, simply read the
[annotated example config](dist/config.js), which contains descriptions of
all valid config options and parameters.

## Building Klaro from Scratch

If you want to customize Klaro or extend it,
you can build it from scratch using the following commands:

    npm install
    npm run-script make-dev #will run a development server
    npm run-script make #will build the production version

## Contributing

Want to contribute? We'd love that!

If you have a feature request or bug to report, please fill out [a 
GitHub Issue](https://github.com/KIProtect/klaro/issues) to begin the conversation.

If you want to help out, but don't know where to begin, check out [the open 
issues tagged "help wanted"](https://github.com/KIProtect/klaro/labels/help%20wanted).

If you are multilingual, consider contributing a translation we don't have yet. 

## License & Third-Party Libraries

This project is licensed under a BSD-3 license. A list of third-party libraries
can be found in the [package.js](package.js) file.

The accompanying website
uses [Bulma](https://bulma.io), [Bootstrap](https://getbootstrap.com)
and [Prism](http://prismjs.com/) and a [surveillance camera image](https://upload.wikimedia.org/wikipedia/commons/5/56/Surveillance-camera.png)
from Wikipedia.
