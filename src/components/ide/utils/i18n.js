export function getValue(t, lang, key){
    let dt = t[lang]
    if (dt === undefined)
        return
    for(const k of key){
        if (dt === undefined)
            return
        dt = dt[k]
    }
    return dt
}

export function getFallbackValue(tv, lang, key){
    let dt = tv
    for(const k of key){
        if (dt === undefined)
            break
        dt = dt[k]
    }
    if (dt !== undefined)
        dt = dt[lang]
    return dt
}
