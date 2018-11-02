import React from 'react'
import ReactModal from 'react-modal'
import {Close} from './icons'
import Apps from './apps'

export default class ConsentModal extends React.Component {
    constructor(props) {
        super()
        if (props.config.appElement) {
            ReactModal.setAppElement(props.config.appElement)
        }
    }

    render() {
        const {isOpen, onHideRequest, onSaveRequest, config, manager, t, ns} = this.props

        let closeLink
        if (!config.mustConsent || (manager.confirmed && !manager.changed))
            closeLink = <button
                title={t(['close'])}
                className={ns('Modal-closeButton')}
                type="button"
                onClick={onHideRequest}
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
            onRequestClose={onHideRequest}
            bodyOpenClassName="klaroBody-WithModalOpen"
            role="dialog"
        >
            <div className={ns('Modal-header')}>
                {closeLink}
                <h1 className={ns('Modal-title')} id="klaro-modal-title">{t(['consentModal', 'title'])}</h1>
                <p className={ns('Modal-description')}>
                    {manager.changed && (config.mustConsent || config.noNotice) &&
                        <p className={ns('Modal-description')}>
                            <strong className={ns('Modal-changes')}>{t(['consentNotice', 'changeDescription'])}</strong>
                        </p>
                    }
                    {t(['consentModal','description'])} &nbsp;
                    {t(['consentModal','privacyPolicy','text'], {
                        privacyPolicy : <a
                            key="privacyPolicyLink"
                            className={ns('Modal-privacyPolicyLink')}
                            onClick={(e) => {onHideRequest()}}
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
                        onClick={onSaveRequest}
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
