import React from 'react'
import ReactModal from 'react-modal'
import {Close} from './icons'
import Apps from './apps'

export default class ConsentModal extends React.Component {
    constructor(props) {
        super();
        if (props.config.appElement) {
            ReactModal.setAppElement(props.config.appElement);
        }
    }

    render(){
        const {hide, isOpen, saveAndHide, declineAndHide, config, manager, t} = this.props

        let closeLink
        if (!config.mustConsent)
            closeLink = <button title={t(['close'])} className="hide" type="button" onClick={hide}><Close t={t} /></button>

        const ppLink = <a onClick={(e) => {hide()}} href={config.privacyPolicy}>{t(['consentModal','privacyPolicy','name'])}</a>

        return <ReactModal
            isOpen={isOpen}
            aria={{'labelledby': 'klaro-modal-title'}}
            portalClassName="klaro klaro-modal-portal"
            overlayClassName="klaro-modal-overlay"
            className="cookie-modal"
            bodyOpenClassName="klaro-modal--open"
            role="dialog"
        >
            <div className="cm-bg" onClick={hide}/>
            <div className="cm-modal">
                <div className="cm-header">
                    {closeLink}
                    <h1 className="title" id="klaro-modal-title">{t(['consentModal', 'title'])}</h1>
                    <p>
                        {t(['consentModal','description'])} &nbsp;
                        {t(['consentModal','privacyPolicy','text'], {privacyPolicy : ppLink})}
                    </p>
                </div>
                <div className="cm-body">
                    <Apps t={t} config={config} manager={manager} />
                </div>
                <div className="cm-footer">
                    <button className="cm-btn cm-btn-success" type="button" onClick={saveAndHide}>{t(['save'])}</button>
                    <a target="_blank" className="cm-powered-by" href={config.poweredBy || 'https://klaro.kiprotect.com'}>{t(['poweredBy'])}</a>
                </div>
            </div>
        </ReactModal>
    }
}

