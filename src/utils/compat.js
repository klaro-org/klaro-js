export function currentScript(name){
    // most browser support this (but alas, not IE11)
    if (document.currentScript !== undefined)
        return document.currentScript
    const scripts = document.getElementsByTagName('script');
    for(let i=0;i<scripts.length;i++){
        const script = scripts[i]
        // if the script src includes the given name (klaro) we return
        // the script and hope for the best
        if (script.src.includes(name))
            return script
    }
}

export function dataset(element){
    const dataset = {}
    for(let i=0;i<element.attributes.length;i++){
        const attribute = element.attributes[i]
        if (attribute.name.startsWith('data-')){
            dataset[attribute.name.slice(5)] = attribute.value
        }
    }
    return dataset
}
