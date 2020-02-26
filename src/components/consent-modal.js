import React from 'react'
import {Close} from './icons'
import Apps from './apps'
import {language} from 'utils/i18n'

export default class ConsentModal extends React.Component {

    render(){
        const {hide, saveAndHide, acceptAndHide, config, manager, t} = this.props
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
        let buttonRight =
            <button className="cm-btn cm-btn-success cm-btn-right" type="button" onClick={saveAndHide}>{t([manager.confirmed ? 'close' : 'save'])}</button>
        let buttonLeft
        if (config.acceptAll) {
            buttonLeft = <button className="cm-btn cm-btn-info" type="button" onClick={saveAndHide}>{t([manager.confirmed ? 'close' : 'save'])}</button>
            buttonRight = <button className="cm-btn cm-btn-success cm-btn-right" type="button" onClick={acceptAndHide}>{t(['acceptAll'])}</button>
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
                    <div className="cm-footer-buttons">
                        {buttonLeft}
                        {buttonRight}
                    </div>
                    <p className="cm-powered-by"><a target="_blank" href={config.poweredBy || 'https://klaro.kiprotect.com'} rel="noopener noreferrer">{t(['poweredBy'])}</a></p>
                </div>
            </div>
        </div>
    }
}
