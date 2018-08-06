# CHANGELOG

The versions listed here are the ones of our fork, they differ from the original repo.
On each version, there a build metadata indicating the last commit from original repo included in this version.

For example, version `0.3.0+upstream.fce14a2` means the version 0.3.0 of our fork includes all commits of the original repo until the commit fce14a2 (included).

## 0.3.1

- "powered by" link: add "new window" title to warn user about the _blank target attribute
- a11y: when opening the consent modal via the "learn more" consent notice button, and exiting the consent modal via ESC or close button, the focus now correctly goes back to the "learn more" button
- fix: the small CSS reset was wrongly applied on the body when `mustContent = true`

## 0.3.0

This version includes everything from the original repo until commit [fce14a2](https://github.com/KIProtect/klaro/commits/fce14a280926da9ae474f7fee7333253ffc6430d).

This means, between original repo tag 0.2.1 and this version, the changes we made are:

- build: use only one webpack config, shared for all build environments *(merged in original repo)*
- build: new `make-watch` script to create a development build of klaro on disk everytime a file changes. Useful when using npm link *(merged in original repo)*
- npm config: you can easily publish the package on your own private npm repository if needed *(merged in original repo)*
- accessibility: klaro is now noticeably more accessible. Experience should be improved for sighted users, keyboard users, screen reader users *(soon to be merged)*
- :warning: new `appElement` config: for better accessibily, the lib must know what is the div wrapping your website
- build: when generating production build, generate two klaro files, one with and one without CSS
- :warning: CSS: reworked how CSS is authored as a whole. Now using BEM classes instead of ~generic classnames with heavy selectors
- apps list: do not show a "toggle all" switch if there is only one app listed
- constent notice: move the "learn more" button with other actions
