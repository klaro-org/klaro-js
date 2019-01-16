import React from 'react'
import {Close} from './icons'
import Apps from './apps'
import Dialog from './dialog'

export default class ConsentModal extends React.Component {
    render() {
        const {isOpen, onHideRequest, onSaveRequest, config, manager, t, ns} = this.props

        const isAlert = config.mustConsent && (!manager.confirmed || manager.changed)

        return <Dialog
            isOpen={isOpen}
            aria={{'labelledby': 'orejime-modal-title'}}
            portalClassName={ns('ModalPortal')}
            overlayClassName={ns('ModalOverlay')}
            appElement={config.appElement}
            parentSelector={() => document.getElementById(config.elementID || 'orejime')}
            className={ns('ModalWrapper')}
            onRequestClose={onHideRequest}
            htmlOpenClassName="orejimeHtml-WithModalOpen"
            bodyOpenClassName="orejimeBody-WithModalOpen"
            role={isAlert ? 'alertdialog' : 'dialog'}
        >
            <div className={ns('Modal')}>
                <div className={ns('Modal-header')}>
                    {!isAlert &&
                        <button
                            title={t(['close'])}
                            className={ns('Modal-closeButton')}
                            type="button"
                            onClick={onHideRequest}
                        >
                            <Close t={t} ns={ns} />
                        </button>
                    }

                    <h1 className={ns('Modal-title')} id="orejime-modal-title">{t(['consentModal', 'title'])}</h1>
                    <p className={ns('Modal-description')}>
                        {manager.changed && (config.mustConsent || config.noNotice) &&
                            <p className={ns('Modal-description')}>
                                <strong className={ns('Modal-changes')}>{t(['consentNotice', 'changeDescription'])}</strong>
                            </p>
                        }
                        {t(['consentModal','description'])}&nbsp;
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
                            href={config.poweredBy || 'https://github.com/empreinte-digitale/orejime'}
                            title={`${t(['poweredBy'])} (${t(['newWindow'])})`}
                        >
                            {t(['poweredBy'])}
                        </a>
                    </div>
                </form>
            </div>
        </Dialog>
    }
}
