import React from 'react'
import {Close} from './icons'
import Apps from './apps'
import Purposes from './purposes'
import {language} from '../utils/i18n'
import Text from './text'

export default class ConsentModal extends React.Component {

    constructor(props){
        super(props)
        const {manager} = props
        manager.restoreSavedConsents()
    }

    render(){
        const {hide, confirming, saveAndHide, acceptAndHide, declineAndHide, config, manager, t} = this.props
        const {embedded} = config
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

        if (!config.hideDeclineAll && ! manager.confirmed)
            declineButton = <button disabled={confirming} className="cm-btn cm-btn-decline cm-btn-danger cn-decline" type="button" onClick={declineAndHide}>{t(['decline'])}</button>
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
        let ppLink
        if (ppUrl !== undefined)
            ppLink = <a href={ppUrl} target="_blank" rel="noopener noreferrer">{t(['consentModal','privacyPolicy','name'])}</a>

        let appsOrPurposes

        if (groupByPurpose)
            appsOrPurposes = <Purposes t={t} config={config} manager={manager} />
        else
            appsOrPurposes = <Apps t={t} config={config} manager={manager} />

        const innerModal = <div className="cm-modal cm-klaro">
            <div className="cm-header">
                {closeLink}
                <h1 className="title">{t(['consentModal', 'title'])}</h1>
                <Text config={config} text={[t(['consentModal','description'])].concat(ppLink && [' '].concat(t(['consentModal','privacyPolicy','text'], {privacyPolicy : ppLink})) || [])} />
            </div>
            <div className="cm-body">
                {appsOrPurposes}
            </div>
            <div className="cm-footer">
                <div className="cm-footer-buttons">
                    {declineButton}
                    {acceptButton}
                    {acceptAllButton}
                </div>
                <p className="cm-powered-by"><a target="_blank" href={config.poweredBy || 'https://kiprotect.com/klaro'} rel="noopener noreferrer">{t(['poweredBy'])}</a></p>
            </div>
        </div>

        if (embedded)
            return <div className="cookie-modal cm-embedded">
                {innerModal}
            </div>

        return <div className="cookie-modal">
            <div className="cm-bg" onClick={hide}/>
            {innerModal}
        </div>
    }
}
