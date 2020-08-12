import React from 'react'
import {Close} from './icons'
import Apps from './apps'
import Purposes from './purposes'
import {language} from 'utils/i18n'

export default class ConsentModal extends React.Component {

    constructor(props){
        super(props)
        const {manager} = props
        manager.restoreSavedConsents()
    }

    render(){
        const {hide, confirming, saveAndHide, acceptAndHide, declineAndHide, config, manager, t} = this.props
        const lang = config.lang || language()
        const groupByPurpose = config.groupByPurpose !== undefined ? config.groupByPurpose : true

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
        let declineButton


        const extraHTML = t(['!', 'consentModal', 'extraHTML'])

        if (!config.hideDeclineAll && ! manager.confirmed)
            declineButton = <button disabled={confirming} className="cm-btn cm-btn-decline cm-btn-right cm-btn-sm cm-btn-danger cn-decline" type="button" onClick={declineAndHide}>{t(['decline'])}</button>
        let acceptAllButton
        const acceptButton =
            <button disabled={confirming} className="cm-btn cm-btn-success cm-btn-info cm-btn-accept" type="button" onClick={saveAndHide}>{t([manager.confirmed ? 'save' : 'acceptSelected'])}</button>
        if (config.acceptAll && !manager.confirmed) {
            acceptAllButton = <button disabled={confirming} className="cm-btn cm-btn-success cm-btn-accept-all" type="button" onClick={acceptAndHide}>{t(['acceptAll'])}</button>
        }

        let ppUrl
        if (config.privacyPolicy !== undefined){
            if (typeof config.privacyPolicy === "string")
                ppUrl = config.privacyPolicy
            else if (typeof config.privacyPolicy === "object") {
                ppUrl = config.privacyPolicy[lang] || config.privacyPolicy.default
            }
        }
        let extraHTMLElement
        if (extraHTML !== undefined)
            extraHTMLElement = <div dangerouslySetInnerHTML={{__html: extraHTML}} />
        let ppLink
        if (ppUrl !== undefined)
            ppLink = <a onClick={hide} href={ppUrl} target="_blank" rel="noopener noreferrer">{t(['consentModal','privacyPolicy','name'])}</a>

        let appsOrPurposes

        if (groupByPurpose)
            appsOrPurposes = <Purposes t={t} config={config} manager={manager} />
        else
            appsOrPurposes = <Apps t={t} config={config} manager={manager} />

        return <div className="cookie-modal">
            <div className="cm-bg" onClick={hide}/>
            <div className="cm-modal">
                <div className="cm-header">
                    {closeLink}
                    <h1 className="title">{t(['consentModal', 'title'])}</h1>
                    <p>
                        {t(['consentModal','description'])} &nbsp;
                        {
                            ppLink &&
                            t(['consentModal','privacyPolicy','text'], {privacyPolicy : ppLink})
                        }
                    </p>
                    {extraHTMLElement}
                </div>
                <div className="cm-body">
                    {appsOrPurposes}
                </div>
                <div className="cm-footer">
                    <div className="cm-footer-buttons">
                        {acceptAllButton}
                        {acceptButton}
                        {declineButton}
                    </div>
                    <p className="cm-powered-by"><a target="_blank" href={config.poweredBy || 'https://klaro.kiprotect.com'} rel="noopener noreferrer">{t(['poweredBy'])}</a></p>
                </div>
            </div>
        </div>
    }
}
