import React from 'react'
import {Close} from './icons'
import Apps from './apps'
import {language} from 'utils/i18n'

export default class ConsentModal extends React.Component {

    render(){
        const {hide, saveAndHide, config, manager, t} = this.props
        const lang = config.lang || language()

        let closeLink
        if (!config.mustConsent) {
            closeLink = <button
                title={t(['close'])}
                className="hide"
                type="button"
                onClick={hide}
            >
                <Close t={t} />
            </button>
        }

        const ppUrl = (config.privacyPolicy && config.privacyPolicy[lang]) ||
            config.privacyPolicy.default ||
            config.privacyPolicy

        const ppLink = <a onClick={hide} href={ppUrl}>{t(['consentModal','privacyPolicy','name'])}</a>
        return <div className="cookie-modal">
            <div className="cm-bg" onClick={hide}/>
            <div className="cm-modal">
                <div className="cm-header">
                    {closeLink}
                    <h1 className="title">{t(['consentModal', 'title'])}</h1>
                    <p>
                        {t(['consentModal','description'])} &nbsp;
                        {t(['consentModal','privacyPolicy','text'], {privacyPolicy : ppLink})}
                    </p>
                </div>
                <div className="cm-body">
                    <Apps t={t} config={config} manager={manager} />
                </div>
                <div className="cm-footer">
                    <button className="cm-btn cm-btn-success" type="button" onClick={saveAndHide}>{t([manager.confirmed ? 'close' : 'save'])}</button>
                    <a target="_blank" rel="noopener noreferrer" className="cm-powered-by" href={config.poweredBy || 'https://klaro.kiprotect.com'}>{t(['poweredBy'])}</a>
                </div>
            </div>
        </div>
    }
}
