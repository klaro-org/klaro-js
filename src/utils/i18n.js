const format = (str, ...rest) => {
    const t = typeof rest[0];
    let args;
    if (rest.length === 0) args = {};
    else
        args =
            t === 'string' || t === 'number'
                ? Array.prototype.slice.call(rest)
                : rest[0];

    const splits = [];

    let s = str.toString();
    while (s.length > 0) {
        const m = s.match(/\{(?!\{)([\w\d]+)\}(?!\})/);
        if (m !== null) {
            const left = s.substr(0, m.index);
            s = s.substr(m.index + m[0].length);
            const n = parseInt(m[1]);
            splits.push(left);
            // eslint-disable-next-line eqeqeq
            if (n != n) {
                // not a number
                splits.push(args[m[1]]);
            } else {
                // a numbered argument
                splits.push(args[n]);
            }
        } else {
            splits.push(s);
            s = '';
        }
    }
    return splits;
};

export function language(config) {
    // if a language is given in the config we always return that
    if (config !== undefined && config.lang !== undefined && config.lang !== 'zz') return config.lang;
    const lang = (
        (typeof window.language === 'string' ? window.language : null) ||
        document.documentElement.lang ||
        (config !== undefined && config.languages !== undefined && config.languages[0] !== undefined ? config.languages[0] : 'en')
    ).toLowerCase();
    const regex = new RegExp('^([\\w]+)-([\\w]+)$');
    const result = regex.exec(lang);
    if (result === null) {
        return lang;
    }
    return result[1];
}

function hget(d, key, defaultValue) {
    let kl = key;
    if (!Array.isArray(kl)) kl = [kl];
    let cv = d;
    for (let i = 0; i < kl.length; i++) {
        if (cv === undefined) return defaultValue;
        if (kl[i] !== undefined && kl[i].endsWith('?')) {
            const kle = kl[i].slice(0, kl[i].length - 1);
            let cvn;
            if (cv instanceof Map) cvn = cv.get(kle);
            else cvn = cv[kle];
            if (cvn !== undefined && typeof cvn === "string")
                // we only assign it if the value exists
                cv = cvn;
        } else {
            if (cv instanceof Map) cv = cv.get(kl[i]);
            else cv = cv[kl[i]];
        }
    }
    if (cv === undefined || !(typeof cv === "string")) return defaultValue;
    // we convert empty strings to 'undefined'
    if (cv === '') return undefined;
    return cv;
}

export function t(trans, lang, fallbackLang, key, ...params) {
    let kl = key;
    let returnUndefined = false;
    if (kl[0] === '!') {
        kl = kl.slice(1);
        returnUndefined = true;
    }
    if (!Array.isArray(kl)) kl = [kl];
    let value = hget(trans, [lang, ...kl]);
    // if a fallback language is defined, we try to look up the translation for
    // that language instead...
    if (value === undefined && fallbackLang !== undefined)
        value = hget(trans, [fallbackLang, ...kl]);
    if (value === undefined) {
        if (returnUndefined) return undefined;
        return [`[missing translation: ${lang}/${kl.join('/')}]`];
    }
    if (params.length > 0) return format(value, ...params);
    return value;
}
