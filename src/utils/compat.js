export function currentScript(name) {
    // most browser support this (but alas, not IE11)
    if (document.currentScript !== null && document.currentScript !== undefined) return document.currentScript;
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        // if the script src includes the given name (klaro) we return
        // the script and hope for the best
        if (script.src.includes(name)) return script;
    }
    return null
}

export function dataset(element) {
    const dataset = {};
    for (let i = 0; i < element.attributes.length; i++) {
        const attribute = element.attributes[i];
        if (attribute.name.startsWith('data-')) {
            dataset[attribute.name.slice(5)] = attribute.value;
        }
    }
    return dataset;
}

export function applyDataset(ds, element) {
    const keys = Object.keys(ds);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = ds[key];
        if (element[key] === value) continue;
        else element.setAttribute('data-' + key, value);
    }
}

/*
This replaces CSS variables.
*/
export function replaceCSSVariables(variables){
    const klaroStyleElements = document.querySelectorAll('style[data-context=klaro-styles]')
    for(const element of klaroStyleElements){
        let css = element.innerText
        if (element.styleSheet !== undefined) // IE
            css = element.styleSheet.cssText
        for(const [key, value] of Object.entries(variables)){
            const regex = new RegExp("([a-z0-9-]+):[^;]+;[\\s\\n]*\\1:\\s*var\\(--"+key+",\\s*[^\\)]+\\)", 'g')
            css = css.replace(regex, (_, name) => `${name}: ${value}; ${name}: var(--${key}, ${value})`)
        }
        const newElement = document.createElement("style")
        newElement.setAttribute("type", "text/css")
        newElement.setAttribute("data-context", "klaro-styles")
        if (newElement.styleSheet !== undefined){
            newElement.styleSheet.cssText = css
        } else {
            newElement.innerText = css
        }
        // we remove the old element and insert the new one
        element.parentElement.appendChild(newElement)
        element.parentElement.removeChild(element)
    }
}
