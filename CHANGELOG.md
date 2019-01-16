# CHANGELOG

## 1.0.2

- fix accessibility issue with Orejime not removing the app `aria-hidden="true"` at times
- replace default "powered by" url by the Orejime homepage

## 1.0.1

- add the version number in the built files
- tiny fix in modal text, remove a superfluous whitespace between description and privacy policy text

## Orejime 1.0.0

The project now has moved a lot from the original one. The way the lib can be consumed and the way the lib is authored are noticeably different from [Klaro!](https://github.com/KIProtect/klaro). **For these reasons, we decided to give our fork its own name: Orejime :cookie:.**

The main updates included in this version are:

- name change: all options with a default "klaro" value now have a default "orejime" value
- name change: README and demo have been totally revamped to match the changes between Klaro! and Orejime
- new feature: you can now configure Orejime to enable implicit consent via the `implicitConsent` config. Implicit consent means, if the user navigates on more than one page on your website, all the apps configured will be automatically accepted.
- new feature: if the user has saved his preferences and a new apps config is detected, the notice (or the modal, if `mustConsent` is set) should now appear again to let the user know of the changes.
- feature change: when toggling apps after the user already saved his preferences once: never save preference as soon as it is toggled (see https://github.com/KIProtect/klaro/issues/52).
- feature change: easier cookie deletion on app deactivation. When defining an app in your config file, now you shouldn't have to bother to describe the cookie domains anymore. Orejime should find them on its own (see https://github.com/KIProtect/klaro/issues/51).
- feature change: app toggle switchs: add a label below the switch to be 100% clear on the current state of the toggle
- feature change: the "toggle all" checkbox has been replaced by two distinct buttons, "enable all apps" and "disable all apps", for more clarity.
- feature change: if no element with the given *elementID* is in the DOM, it will now be inserted at the beginning of the body and not the end
- refactor: complete overhaul of the way the lib can be consumed. You can now consume Orejime via npm, with commonjs or es6 modules, in addition to the already existing umd build. More details in b868d7a.
- refactor: stop making a build with CSS included in the umd build. The css is now only available via its own css file.
- fix: better default CSS and JS behavior to prevent website scrolling when the modal is open.
- fix: support IE11 (assuming [some polyfills](https://polyfill.io/v2/docs/) are in the page)
- dev: use browser-sync as a dev server

## Klaro! fork 0.3.1

- "powered by" link: add "new window" title to warn user about the _blank target attribute
- a11y: when opening the consent modal via the "learn more" consent notice button, and exiting the consent modal via ESC or close button, the focus now correctly goes back to the "learn more" button
- fix: the small CSS reset was wrongly applied on the body when `mustContent = true`

## Klaro! fork 0.3.0

This version includes everything from the Klaro! original repo until commit [fce14a2](https://github.com/KIProtect/klaro/commits/fce14a280926da9ae474f7fee7333253ffc6430d).

This means, between original repo tag 0.2.1 and this version, the changes we made are:

- build: use only one webpack config, shared for all build environments *(merged in original repo)*
- build: new `make-watch` script to create a development build of klaro on disk everytime a file changes. Useful when using npm link *(merged in original repo)*
- npm config: you can easily publish the package on your own private npm repository if needed *(merged in original repo)*
- accessibility: klaro is now noticeably more accessible. Experience should be improved for sighted users, keyboard users, screen reader users *(soon to be merged)*
- :warning: new `appElement` config: for better accessibily, the lib must know what is the div wrapping your website
- build: when generating production build, generate two klaro files, one with and one without CSS
- :warning: CSS: reworked how CSS is authored as a whole. Now using BEM classes instead of ~generic classnames with heavy selectors
- apps list: do not show a "toggle all" switch if there is only one app listed
- consent notice: move the "learn more" button with other actions
