import React from 'react'
import ConsentModal from './consent-modal'
import {getPurposes} from 'utils/config'

export default class ConsentNotice extends React.Component {

    componentWillReceiveProps(props){
        if (props.show)
            this.setState({modal : undefined})
    }

    render(){

        const {modal} = this.state
        const {config, manager, show, t} = this.props

        const purposes = getPurposes(config)
        const purposesText = purposes.map((purpose) => t(['purposes', purpose])).join(", ")

        const showModal = (e) => {
            if (e !== undefined)
                e.preventDefault()
            this.setState({modal: true})
        }
        const hide = (e) => {
            if (e !== undefined)
                e.preventDefault()
            this.setState({modal: false})
        }

        const saveAndHide = (e) => {
            if (e !== undefined)
                e.preventDefault()
            manager.saveAndApplyConsents()
            this.setState({modal: false})
        }

        const acceptAndHide = (e) => {
            manager.changeAll(true)
            manager.saveAndApplyConsents()
            this.setState({modal: false})
        }

        const declineAndHide = (e) => {
            manager.changeAll(false)
            manager.saveAndApplyConsents()
            this.setState({modal: false})
        }

        var changesText

        if (manager.changed)
            changesText = <p className="cn-changes">{t(['consentNotice', 'changeDescription'])}</p>

        if (manager.confirmed && !show)
            return <div />

        var managerLink
        if (!config.hideDeclineAll)
            managerLink = <p class="cn-modal"><a href="#" onclick={showModal}>{t(['consentNotice', 'learnMore'])}...</a></p>

        const secondButton = config.hideDeclineAll ?
            <button className="cm-btn cm-btn-sm cm-btn-danger cn-modal" type="button" onclick={showModal}>{t(['consentNotice','learnMore'])}</button>
            :
            <button className="cm-btn cm-btn-sm cm-btn-danger cn-decline" type="button" onclick={declineAndHide}>{t(['decline'])}</button>

        const acceptButton = config.acceptAll ?
            <button className="cm-btn cm-btn-sm cm-btn-success" type="button" onclick={acceptAndHide}>{t(['consentNotice', 'acceptAll'])}</button>
            :
            <button className="cm-btn cm-btn-sm cm-btn-success" type="button" onclick={saveAndHide}>{t(['ok'])}</button>

        const modalIsOpen =
            modal
            || (show && modal === undefined)
            || (config.mustConsent && !manager.confirmed)
        const noticeIsVisible =
            !config.mustConsent && !manager.confirmed && !config.noNotice
        const privacyPolicyLink = <a onClick={(e) => {hide()}} href={config.privacyPolicy}>{t(['consentModal','privacyPolicy','name'])}</a>

        if (modal || (show && modal === undefined) || (config.mustConsent && !manager.confirmed))
            return <ConsentModal t={t} config={config} hide={hide} declineAndHide={declineAndHide} saveAndHide={saveAndHide} manager={manager} />
        return <div className={`cookie-notice ${!noticeIsVisible ? 'cookie-notice-hidden' : ''}`}>
            <div className="cn-body">
                <p>
                    {t(['consentNotice', 'description'], {purposes: <strong>{purposesText}</strong>})}
                    {privacyPolicyLink}
                </p>
                {managerLink}
                {changesText}
                <p className="cn-ok">
                    {secondButton}
                    {acceptButton}
                </p>
            </div>
        </div>
    }
}
