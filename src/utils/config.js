import React, {Fragment} from 'react';

export function getPurposes(config) {
    const purposes = new Set([]);
    for (let i = 0; i < config.services.length; i++) {
        const servicePurposes = config.services[i].purposes || [];
        for (let j = 0; j < servicePurposes.length; j++)
            purposes.add(servicePurposes[j]);
    }
    return Array.from(purposes);
}

export function getLinks(config, lang, t) {
    if (undefined === config.translations[lang].links) return {};
    return Object.keys(config.translations[lang].links).reduce((a, key) => {
        const linkUrl = t(['links', key, 'url']);
        const linkName= t(['links', key, 'name']);
        if (undefined === linkUrl) return a;
        if (undefined === linkName) return a;
        a[key] = (<a key={key} href={linkUrl}>{linkName}</a>);
        const linkText = t(['links', key, 'text'], a);
        if (undefined === linkText) return a;
        a[key + 'Text'] = (<Fragment key={key + 'Text'}>{linkText}</Fragment>);
        return a;
    }, {});
}

export function update(ed, d, overwrite) {
    if (overwrite === undefined) overwrite = true;
    const keys = Object.keys(d);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const vd = d[key];
        const ved = ed[key];
        if (typeof vd === 'string') {
            if (overwrite || ved === undefined) ed[key] = vd;
        } else if (typeof vd === 'object') {
            if (typeof ved === 'object') {
                update(ved, vd, overwrite);
            } else if (overwrite || ved === undefined) {
                ed[key] = vd;
            }
        }
    }
    return ed;
}
