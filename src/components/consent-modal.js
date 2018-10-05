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

    render() {
        const {hide, isOpen, saveAndHide, declineAndHide, config, manager, t, ns} = this.props

        let closeLink
        if (!config.mustConsent)
            closeLink = <button
                title={t(['close'])}
                className={ns('Modal-closeButton')}
                type="button"
                onClick={hide}
            >
                <Close t={t} ns={ns} />
            </button>

        return <ReactModal
            isOpen={isOpen}
            aria={{'labelledby': 'klaro-modal-title'}}
            portalClassName={ns('ModalPortal')}
            overlayClassName={ns('ModalOverlay')}
            className={ns('Modal Container')}
            parentSelector={() => document.getElementById(config.elementID || 'klaro')}
            onRequestClose={hide}
            bodyOpenClassName="klaroBody-WithModalOpen"
            role="dialog"
        >
            <div className={ns('Modal-header')}>
                {closeLink}
                <h1 className={ns('Modal-title')} id="klaro-modal-title">{t(['consentModal', 'title'])}</h1>
                <p className={ns('Modal-description')}>
                    {t(['consentModal','description'])} &nbsp;
                    {t(['consentModal','privacyPolicy','text'], {
                        privacyPolicy : <a
                            className={ns('Modal-privacyPolicyLink')}
                            onClick={(e) => {hide()}}
                            href={config.privacyPolicy}
                        >
                            {t(['consentModal','privacyPolicy','name'])}
                        </a>
                    })}
                </p>
            </div>
            <form className={ns('Modal-form')}>
                <div className={ns('Modal-body')}>
                    <Apps t={t} ns={ns} config={config} manager={manager} />
                </div>
                <div className={ns('Modal-footer')}>
                    <button
                        className={ns('Button Button--save Modal-saveButton')}
                        onClick={saveAndHide}
                        title={t(['saveData'])}
                    >
                        {t(['save'])}
                    </button>
                    <a
                        target="_blank"
                        className={ns('Modal-poweredByLink')}
                        href={config.poweredBy || 'https://klaro.kiprotect.com'}
                        title={`${t(['poweredBy'])} (${t(['newWindow'])})`}
                    >
                        {t(['poweredBy'])}
                    </a>
                </div>
            </form>
        </ReactModal>
    }
}
