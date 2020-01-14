import React from 'react'
import {Close} from './icons'
import Apps from './apps'

export default class ConsentModal extends React.Component {

    render(){
        const {hide, saveAndHide, acceptAndHide, config, manager, t} = this.props

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
            <button className="cm-btn cm-btn-success cm-btn-right" type="button" onclick={saveAndHide}>{t([manager.confirmed ? 'close' : 'save'])}</button>
        let buttonLeft
        if (config.acceptAll) {
            buttonLeft = <button className="cm-btn cm-btn-info" type="button" onclick={saveAndHide}>{t([manager.confirmed ? 'close' : 'save'])}</button>
            buttonRight = <button className="cm-btn cm-btn-success cm-btn-right" type="button" onclick={acceptAndHide}>{t(['acceptAll'])}</button>
        }


        const ppLink = <a onClick={hide} href={config.privacyPolicy}>{t(['consentModal','privacyPolicy','name'])}</a>
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
                    <p className="cm-powered-by"><a target="_blank" href={config.poweredBy || 'https://klaro.kiprotect.com'}>{t(['poweredBy'])}</a></p>
                </div>
            </div>
        </div>
    }
}
