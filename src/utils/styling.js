import { replaceCSSVariables } from "./compat"

export function injectStyles(config, themes, element){

    if (config.styling === undefined)
        return

    let styling = Object.assign({}, config.styling)

    if (styling.theme !== undefined){
        let styleThemes = styling.theme
        if (!(styleThemes instanceof Array)){
            styleThemes = [styleThemes]
        }

        // we reset the styling
        styling = {}

        for(const themeName of styleThemes){
            const theme = themes[themeName]
            if (theme !== undefined){
                // we use the theme as the basic styling
                for(const [key, value] of Object.entries(theme)){
                    if (key.startsWith('_'))
                        continue // private attribute e.g. used for compatibility checking
                    styling[key] = value
                }
            }
        }

        // we allow overriding of specific theme variables
        for(const [key, value] of Object.entries(config.styling)){
            if (key === 'theme')
                continue
            styling[key] = value
        }

    }

    if (element === undefined)
        element = document.documentElement;

    // in modern browsers we can just set the CSS variables
    for(const [key, value] of Object.entries(styling)){
        element.style.setProperty('--'+key, value)
    }

    if (window.document.documentMode && element === document.documentElement) {
        // we dynamically replace the CSS variables in the CSS files as IE
        // cannot handle them... Sigh.
        replaceCSSVariables(styling)
    }

}
