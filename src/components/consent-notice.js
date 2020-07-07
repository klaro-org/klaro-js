import React from 'react'
import ConsentModal from './consent-modal'
import {getPurposes} from 'utils/config'
import {language} from 'utils/i18n'

export default class ConsentNotice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            confirming: false,
        };
    }

    executeButtonClicked = (setChangedAll, changedAllValue) => {
        const { modal } = this.state;
        if (setChangedAll) this.props.manager.changeAll(changedAllValue);
        const confirmed = this.props.manager.confirmed;
        const saveAndHide = () => {
            this.setState({ confirming: false });
            this.props.manager.saveAndApplyConsents();
            this.props.hide();
        };
        if (
            setChangedAll &&
            !confirmed &&
            (modal || this.props.config.mustConsent)
        ) {
            this.setState({ confirming: true });
            setTimeout(saveAndHide, 1000);
        } else saveAndHide();
    };

    saveAndHide = () => {
        this.executeButtonClicked(false, false);
    };

    acceptAndHide = () => {
        this.executeButtonClicked(true, true);
    };

    declineAndHide = () => {
        this.executeButtonClicked(true, false);
    };

    render() {
        const { config, show, manager, t } = this.props;
        const { modal, confirming } = this.state;

        const purposes = getPurposes(config)
        const purposesText = purposes.map((purpose) => t(['purposes', purpose])).join(", ")
        const lang = config.lang || language()
        const ppUrl = (config.privacyPolicy && config.privacyPolicy[lang]) ||
            config.privacyPolicy.default ||
            config.privacyPolicy

        let changesText;

        const showModal = (e) => {
            e.preventDefault();
            this.setState({ modal: true });
        };

        const hideModal = () => {
            if (config.mustConsent && !config.acceptAll) return;
            if (manager.confirmed) this.props.hide();
            else this.setState({ modal: false });
        };

        if (manager.changed)
            changesText = (
                <p className="cn-changes">
                    {t(['consentNotice', 'changeDescription'])}
                </p>
            );

        if (!show) return <div />;

        const noticeIsModal = config.noticeIsModal;
        const noticeIsVisible =
            (!config.mustConsent || noticeIsModal) &&
            !manager.confirmed &&
            !config.noNotice;

        const declineButton = config.hideDeclineAll ? (
            ''
        ) : (
            <button
                className={'cm-btn cm-btn-danger cn-decline'}
                type="button"
                onClick={this.declineAndHide}
            >
                {t(['decline'])}
            </button>
        );

        const acceptButton = config.acceptAll ? (
            <button
                className={'cm-btn cm-btn-success'}
                type="button"
                onClick={this.acceptAndHide}
            >
                {t(['acceptAll'])}
            </button>
        ) : (
            <button
                className={'cm-btn cm-btn-success'}
                type="button"
                onClick={this.saveAndHide}
            >
                {t(['ok'])}
            </button>
        );           

        const ppLink = (
            <a onClick={hideModal} href={config.privacyPolicy}>
                {t(['consentNotice', 'privacyPolicy', 'name'])}
            </a>
       );    

        const learnMoreLink = noticeIsModal ? (
            <button
                className={'cm-btn cm-btn-learn-more cm-btn-info'}
                type="button"
                onClick={showModal}
            >
                {t(['consentNotice', 'configure'])}
            </button>
        ) : (
            config.hideLearnMore ? '' : <a className="cm-link cm-learn-more" href="#" onClick={showModal}>
                {t(['consentNotice', 'learnMore'])}
            </a>
        );

        if (
            modal ||
            manager.confirmed ||
            (!manager.confirmed && config.mustConsent && !noticeIsModal)
        )
            return (
                <ConsentModal
                    t={t}
                    confirming={confirming}
                    config={config}
                    hide={hideModal}
                    declineAndHide={this.declineAndHide}
                    saveAndHide={this.saveAndHide}
                    acceptAndHide={this.acceptAndHide}
                    manager={manager}
                />
            );
        const notice = !noticeIsModal ? (
            <div
                className={`cookie-notice ${
                    !noticeIsVisible ? 'cookie-notice-hidden' : ''
                } ${noticeIsModal ? 'cookie-modal-notice' : ''}`}
            >
                <div className="cn-body">
                    <p>
                        {t(['consentNotice', 'description'], {
                            purposes: <strong>{purposesText}</strong>,
                        })}
                    </p>
                    {changesText}
                    <div className="cn-ok">
                        {learnMoreLink}
                        <div className="cn-buttons">
                            {declineButton}
                            {acceptButton}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="cookie-modal cookie-modal-consent">
                <div className="cm-bg" />
                <div className="cm-modal">
                    <div className="cm-header">
                        <h1 className="title">
                            {t(['consentNotice', 'title'])}
                        </h1>
                            {t(['consentNotice', 'description'])} 
                            {t(['consentNotice', 'privacyPolicy', 'text'], { privacyPolicy: ppLink })}
                        
                    </div>
                    <div className="cm-body">
                        <div className="cn-ok">
                            {learnMoreLink}
                            {declineButton}
                            {acceptButton}
                        </div>
                    </div>
                </div>
            </div>
        );

        return notice;
    }
}
