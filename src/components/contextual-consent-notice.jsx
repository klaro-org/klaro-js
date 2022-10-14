import React, { useEffect, useState } from "react";
import { asTitle } from '../utils/strings';
import { t as tt } from '../utils/i18n';

const ContextualConsentNotice = ({manager, style, config, t, lang, service, id}) => {

    const [updateCnt, setUpdateCnt] = useState(0)

    const decline = () => {}
    const accept = () => {
        manager.updateConsent(service.name, true)
        if (manager.confirmed){ // we permanently save the consent state
            manager.saveConsents('contextual-accept')
            manager.applyConsents(false, true, service.name)
        } else // we only temporarily accept this
            manager.applyConsents(false, true, service.name)
    }
    const acceptOnce = () => {
        manager.updateConsent(service.name, true)
        manager.applyConsents(false, true, service.name)
        manager.updateConsent(service.name, false)
    }

    const { additionalClass, embedded, stylePrefix } = config;

    // we watch for changes in the manager, to display the correct buttons
    useEffect(() => {
        const watcher = {
            update: () => setUpdateCnt(updateCnt+1),
        }
        manager.watch(watcher)
        return () => {
            manager.unwatch(watcher)
        }
    })

    const title = tt(service.translations || {}, lang, 'zz', ['!', 'title']) || t(['!', service.name, 'title?']) || asTitle(service.name)
    const description = tt(config.translations || {}, lang, 'zz', ['!', service.name, 'contextualDescriptions', id]) || tt(config.translations || {}, lang, 'zz', ['!', service.name, 'contextualDescriptions', 'default']) || t(['contextualConsent','description'], {title: title})

    return <div
                lang={lang}
                className={
                    (stylePrefix || 'klaro') +
                    (additionalClass !== undefined ? ' ' + additionalClass : '') + ' cm-as-context-notice'
                }
            >
            <div className={"context-notice"+(style !== undefined ? ` cm-${style}` : "")}>
            <p>
                {description}
            </p>
            <p className="cm-buttons">
                <button
                    className="cm-btn cm-btn-success"
                    type="button"
                    onClick={acceptOnce}
                >
                    {t(['contextualConsent', 'acceptOnce'])}
                </button>
                <button
                    className="cm-btn cm-btn-success-var"
                    type="button"
                    onClick={accept}
                >
                    {t(['contextualConsent', 'acceptAlways'])}
                </button>
            </p>
        </div>
    </div>
}

export default ContextualConsentNotice

