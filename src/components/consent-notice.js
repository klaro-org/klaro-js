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
        const {config, manager, show, t, ns} = this.props

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

        const declineAndHide = (e) => {
            manager.declineAll()
            manager.saveAndApplyConsents()
            this.setState({modal: false})
        }

        if (manager.confirmed && !show)
            return <div />

        const modalProps = {t, ns, config, hide, declineAndHide, saveAndHide, manager}

        if (modal || (show && modal === undefined) || (config.mustConsent && !manager.confirmed))
            return <ConsentModal {...modalProps} isOpen={true} />

        if (!manager.confirmed && !config.noNotice)
            return <div className={ns('Notice')}>
                <div className={ns('Notice-body')}>
                    <p className={ns('Notice-description')}>
                        {t(['consentNotice', 'description'], {purposes: <strong className={ns('Notice-purposes')}>{purposesText}</strong>})}
                    </p>

                    {manager.changed
                        ? <p className={ns('Notice-changes')}>{t(['consentNotice', 'changeDescription'])}</p>
                        : ''}

                    <div className={ns('Notice-actions')}>
                        <button
                            className={ns('Button Button--save Notice-button Notice-saveButton')}
                            type="button"
                            onClick={saveAndHide}
                        >
                            {t(['accept'])}
                        </button>
                        <button
                            className={ns('Button Button--decline Notice-button Notice-declineButton')}
                            type="button"
                            onClick={declineAndHide}
                        >
                            {t(['decline'])}
                        </button>
                        <button
                            type="button"
                            className={ns('Button Button--info Notice-learnMoreButton')}
                            onClick={showModal}
                        >
                            {t(['consentNotice', 'learnMore'])}
                        </button>
                    </div>
                </div>
                <ConsentModal {...modalProps} isOpen={false} />
            </div>

        return <div />
    }
}
