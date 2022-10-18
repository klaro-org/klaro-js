import React from 'react';
import { Close } from './icons';
import Services from './services';
import Purposes from './purposes';
import Text from './text';
import { getLinks } from '../utils/config';

export default class ConsentModal extends React.Component {
    componentDidMount() {
        this.consentModalRef.focus();
    }

    render() {
        const {
            hide,
            confirming,
            saveAndHide,
            acceptAndHide,
            declineAndHide,
            config,
            manager,
            lang,
            t,
        } = this.props;
        const { embedded } = config;
        const groupByPurpose =
            config.groupByPurpose !== undefined ? config.groupByPurpose : true;

        let closeLink;
        if (!config.mustConsent) {
            closeLink = (
                <button
                    title={t(['close'])}
                    aria-label={t(['close'])}
                    className="hide"
                    type="button"
                    onClick={hide}
                    tabIndex="0"
                    ref={(div) => {
                        this.consentModalRef = div;
                    }}
                >
                    <Close t={t} />
                </button>
            );
        }

        let declineButton;

        if (!config.hideDeclineAll && !manager.confirmed)
            declineButton = (
                <button
                    disabled={confirming}
                    className="cm-btn cm-btn-decline cm-btn-danger cn-decline"
                    type="button"
                    onClick={declineAndHide}
                >
                    {t(['decline'])}
                </button>
            );
        let acceptAllButton;
        const acceptButton = (
            <button
                disabled={confirming}
                className="cm-btn cm-btn-success cm-btn-info cm-btn-accept"
                type="button"
                onClick={saveAndHide}
            >
                {t([manager.confirmed ? 'save' : 'acceptSelected'])}
            </button>
        );
        if (config.acceptAll && !manager.confirmed) {
            acceptAllButton = (
                <button
                    disabled={confirming}
                    className="cm-btn cm-btn-success cm-btn-accept-all"
                    type="button"
                    onClick={acceptAndHide}
                >
                    {t(['acceptAll'])}
                </button>
            );
        }

        let servicesOrPurposes;

        if (groupByPurpose)
            servicesOrPurposes = (
                <Purposes t={t} config={config} manager={manager} lang={lang} />
            );
        else
            servicesOrPurposes = (
                <Services t={t} config={config} manager={manager} lang={lang} />
            );

        const innerModal = (
            <div className="cm-modal cm-klaro">
                <div className="cm-header">
                    {closeLink}
                    <h1 className="title">
                        <Text
                            config={config}
                            text={t(['consentModal', 'title'])}
                        />
                    </h1>
                    <p>
                        <Text
                            config={config}
                            text={t(['consentModal', 'description'], {
                                ...getLinks(config, lang, t)
                            })}
                        />
                    </p>
                </div>
                <div className="cm-body">{servicesOrPurposes}</div>
                <div className="cm-footer">
                    <div className="cm-footer-buttons">
                        {declineButton}
                        {acceptButton}
                        {acceptAllButton}
                    </div>
                    {!config.disablePoweredBy && (
                        <p className="cm-powered-by">
                            <a
                                target="_blank"
                                href={
                                    config.poweredBy ||
                                    'https://kiprotect.com/klaro'
                                }   
                                rel="noopener"
                            >
                                {t(['poweredBy'])}
                            </a>
                        </p>
                    )}
                </div>
            </div>
        );

        if (embedded)
            return <div id="cookieScreen" className="cookie-modal cm-embedded">{innerModal}</div>;

        return (
            <div id="cookieScreen" className="cookie-modal">
                <div className="cm-bg" onClick={hide} />
                {innerModal}
            </div>
        );
    }
}
