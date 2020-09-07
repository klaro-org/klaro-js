import React from 'react'
import ConsentModal from './consent-modal'
import {getPurposes} from 'utils/config'
import Text from './text'
import {language} from 'utils/i18n'

export default class ConsentNotice extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            modal: props.modal,
            confirming: false
        }
    }

    componentDidUpdate(prevProps){
        if (prevProps.modal !== this.props.modal)
            this.setState({modal: this.props.modal})
    }

    executeButtonClicked = (setChangedAll, changedAllValue) => {
        const {modal} = this.state
        let changedApps = 0
        if (setChangedAll)
            changedApps = this.props.manager.changeAll(changedAllValue)
        const confirmed = this.props.manager.confirmed
        const saveAndHide = () => {
            this.setState({confirming: false})
            this.props.manager.saveAndApplyConsents()
            this.props.hide()
        }
        if (setChangedAll && !confirmed && (modal || this.props.config.mustConsent)){
            if (changedApps === 0)
                saveAndHide()
            else
                setTimeout(saveAndHide, 1000)
        }
        else
            saveAndHide()
    }

    saveAndHide = () => {
        this.executeButtonClicked(false, false)
    }

    acceptAndHide = () => {
        this.executeButtonClicked(true, true)
    }

    declineAndHide = () => {
        this.executeButtonClicked(true, false)
    }

    render(){
        const {config, show, manager, t} = this.props
        const { modal, confirming } = this.state
        const {embedded, noticeAsModal, hideLearnMore } = config

        const purposes = getPurposes(config)
        const purposesText = purposes.map((purpose) => t(['purposes', purpose, 'title?'])).join(", ")
        const lang = config.lang || language()

        let ppUrl
        if (config.privacyPolicy !== undefined){
            if (typeof config.privacyPolicy === "string")
                ppUrl = config.privacyPolicy
            else if (typeof config.privacyPolicy === "object") {
                ppUrl = config.privacyPolicy[lang] || config.privacyPolicy.default
            }
        }

        const showModal = (e) => {
            e.preventDefault()
            this.setState({modal: true})
        }

        const hideModal = () => {
            if (config.mustConsent && !config.acceptAll)
                return
            if (manager.confirmed)
                this.props.hide()
            else
                this.setState({modal: false})
        }

        let changesText
        if (manager.changed)
            changesText = <p className="cn-changes">{t(['consentNotice', 'changeDescription'])}</p>

        if (!show)
            return <div />

        const noticeIsVisible =
            (!config.mustConsent || noticeAsModal) && !manager.confirmed && !config.noNotice

        const declineButton = config.hideDeclineAll ?
            ''
            :
            <button className="cm-btn cm-btn-danger cn-decline" type="button" onClick={this.declineAndHide}>{t(['decline'])}</button>

        const acceptButton = config.acceptAll ?
            <button className="cm-btn cm-btn-success" type="button" onClick={this.acceptAndHide}>{t(['acceptAll'])}</button>
            :
            <button className="cm-btn cm-btn-success" type="button" onClick={this.saveAndHide}>{t(['ok'])}</button>

        const learnMoreLink = (extraText) => noticeAsModal ?
            <button className="cm-btn cm-btn-lern-more cm-btn-info" type="button" onClick={showModal}>{t(['consentNotice', 'configure'])}{extraText}</button>
            :
            <a className="cm-link cn-learn-more" href="#" onClick={showModal}>{t(['consentNotice', 'learnMore'])}{extraText}</a>

        let ppLink

        if (ppUrl !== undefined)
            ppLink = <a href={ppUrl}>{t(['consentNotice','privacyPolicy','name'])}</a>

        if (modal || manager.confirmed || (!manager.confirmed && config.mustConsent))
            return <ConsentModal t={t} confirming={confirming} config={config} hide={hideModal} declineAndHide={this.declineAndHide} saveAndHide={this.saveAndHide} acceptAndHide={this.acceptAndHide} manager={manager} />
        const notice = <div className={`cookie-notice ${!noticeIsVisible ? 'cookie-notice-hidden' : ''} ${noticeAsModal ? 'cookie-modal-notice' : ''} ${embedded ? 'cn-embedded' : ''}`}>
            <div className="cn-body">
                <Text config={config} text={t(['consentNotice', 'description'], {purposes: <strong>{purposesText}</strong>, privacyPolicy: ppLink, learnMoreLink: learnMoreLink() })} />
                {changesText}
                <div className="cn-ok">
                    {!hideLearnMore && learnMoreLink('...')}
       	   	        <div className="cn-buttons">
                        	{declineButton}
                        	{acceptButton}
        		    </div>
                </div>
            </div>
        </div>

        if (!noticeAsModal)
            return notice

        return <div className="cookie-modal">
            <div className="cm-bg" />
            {notice}
        </div>

    }
}
