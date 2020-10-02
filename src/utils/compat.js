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
