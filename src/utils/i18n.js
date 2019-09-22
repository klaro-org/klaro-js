String.prototype.format = function () {
    "use strict";
    var str = this.toString();

    var t = typeof arguments[0];
    var args
    if (arguments.length == 0)
        args = {}
    else
        args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];

    var splits = []

    var s = str
    while(s.length > 0){
        var m = s.match(/\{(?!\{)([\w\d]+)\}(?!\})/)
        if (m !== null){
            var left = s.substr(0, m.index)
            var sep = s.substr(m.index, m[0].length)
            s = s.substr(m.index+m[0].length)
            var n = parseInt(m[1])
            splits.push(left)
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
    let lang = ((typeof window.language === "string" ? window.language : null) || document.documentElement.lang || 'en').toLowerCase()
    let regex = new RegExp('^([\\w]+)-([\\w]+)$')
    let result = regex.exec(lang)
    if (result == null){
        return lang
    }
    return result[1]
}

function hget(d, key, defaultValue){
    var kl = key
    if (!Array.isArray(kl))
        kl = [kl]
    var cv = d
    for(var i=0;i<kl.length;i++){
        if (cv === undefined)
            return defaultValue
        if (cv instanceof Map)
            cv = cv.get(kl[i])
        else
            cv = cv[kl[i]]
    }
    if (cv === undefined)
        return defaultValue
    return cv
}

export function t(trans, lang, key){
    var kl = key
    if (!Array.isArray(kl))
        kl = [kl]
    const value = hget(trans, [lang, ...kl])
    if (value === undefined){
        return '[missing translation: {lang}/{key}]'.format({key: kl.join("/"), lang: lang}).join("")
    }
    const params = Array.prototype.slice.call(arguments, 3)
    if (params.length > 0)
        return value.format(...params)
    return value
}
