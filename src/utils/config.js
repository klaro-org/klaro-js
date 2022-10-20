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

export function getLinks(t) {
    // First block is for retrocompatibility.
    if (undefined !== t(['!', 'privacyPolicyUrl'])) {
        const linkUrl = t(['!', 'privacyPolicyUrl']);
        const linkName = t(['!', 'consentModal', 'privacyPolicy', 'name']) || t(['!', 'consentNotice', 'privacyPolicy', 'name']) || t(['!', 'privacyPolicy', 'name']) || t(['!', 'links', 'privacyPolicy', 'name'], links);
        if (undefined === linkUrl || undefined === linkName) return {};
        let links = {privacyPolicy: (<a key='privacyPolicy' href={linkUrl}>{linkName}</a>)};
        const linkText = t(['!', 'consentModal', 'privacyPolicy', 'text'], links) || t(['!', 'privacyPolicy', 'text'], links) || t(['!', 'links', 'privacyPolicy', 'text'], links);
        if (undefined !== linkText) {
            links['privacyPolicyText'] = (<Fragment key='privacyPolicyText'>{linkText}</Fragment>)
        }
        return links;
    }
    return t(['#', 'links']).reduce((a, key) => {
        const linkUrl = t(['!', 'links', key, 'url']);
        const linkName= t(['!', 'links', key, 'name']);
        if (undefined === linkUrl) return a;
        if (undefined === linkName) return a;
        a[key] = (<a key={key} href={linkUrl}>{linkName}</a>);
        const linkText = t(['!', 'links', key, 'text'], a);
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
