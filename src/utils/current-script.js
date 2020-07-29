export function currentScript(name){
    // most browser support this (but alas, not IE11)
    if (document.currentScript !== undefined)
        return document.currentScript
    const scripts = document.getElementsByTagName('script');
    for(var i=0;i<scripts.length;i++){
        const script = scripts[i]
        // if the script src includes the given name (klaro) we return
        // the script and hope for the best
        if (script.src.includes(name))
            return script
    }
}