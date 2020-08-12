const format = (str, ...rest) => {
    const t = typeof rest[0];
    let args
    if (rest.length === 0)
        args = {}
    else
        args = (t === "string" || t === "number") ?
            Array.prototype.slice.call(rest)
            : rest[0];

    const splits = []

    let s = str.toString()
    while(s.length > 0){
        const m = s.match(/\{(?!\{)([\w\d]+)\}(?!\})/)
        if (m !== null){
            const left = s.substr(0, m.index)
            s = s.substr(m.index+m[0].length)
            const n = parseInt(m[1])
            splits.push(left)
            // eslint-disable-next-line eqeqeq
            if (n != n){ // not a number
                splits.push(args[m[1]])
            } else { // a numbered argument
                splits.push(args[n])
            }
        } else {
            splits.push(s)
            s = ""
        }
    }
    return splits
}

export function language(){
    const lang = ((typeof window.language === "string" ? window.language : null) || document.documentElement.lang || 'en').toLowerCase()
    const regex = new RegExp('^([\\w]+)-([\\w]+)$')
    const result = regex.exec(lang)
    if (result === null){
        return lang
    }
    return result[1]
}

function hget(d, key, defaultValue){
    let kl = key
    if (!Array.isArray(kl))
        kl = [kl]
    let cv = d
    for(let i=0;i<kl.length;i++){
        if (cv === undefined)
            return defaultValue
        if (kl[i].endsWith('?')){
            const kle = kl[i].slice(0, kl[i].length-1)
            let cvn
            if (cv instanceof Map)
                cvn = cv.get(kle)
            else
                cvn = cv[kle]
            if (cvn !== undefined) // we only assign it if the value exists
                cv = cvn
         } else {
            if (cv instanceof Map)
                cv = cv.get(kl[i])
            else
                cv = cv[kl[i]]
         }
    }
    if (cv === undefined)
        return defaultValue
    return cv
}

export function t(trans, lang, key, ...params){
    let kl = key
    let returnUndefined = false
    if (kl[0] === '!'){
        kl = kl.slice(1)
        returnUndefined = true
    }
    if (!Array.isArray(kl))
        kl = [kl]
    const value = hget(trans, [lang, ...kl])
    if (value === undefined){
        if (returnUndefined)
            return undefined
        return `[missing translation: ${lang}/${kl.join("/")}]`;
    }
    if (params.length > 0)
        return format(value, ...params)
    return value
}
