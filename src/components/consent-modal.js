import React from 'react'
import {Close} from './icons'
import Apps from './apps'

export default class ConsentModal extends React.Component {

    constructor(props, context){
        super(props, context)
        props.manager.watch(this)
        this.state = {
            consents : props.manager.consents
        }
    }

    componentWillUnmount(){
        const {manager} = this.props
        manager.unwatch(this)
    }

    update(obj, type, data){
        const {manager} = this.props
        if (obj == manager && type == 'consents')
            this.setState({consents : data})
    }

    render(){
        const {hide, saveAndHide, declineAndHide, config, manager, t} = this.props
        const {consents} = this.state

        const toggle = (app, value) => {
            manager.updateConsent(app.name, value)
            if (manager.confirmed)
                manager.saveAndApplyConsents()
        }

        const toggleAll = (value) => {
            config.apps.map((app) => {
                if (app.required)
                    return
                manager.updateConsent(app.name, value)
            })
            if (manager.confirmed)
                manager.saveAndApplyConsents()
        }

        let closeLink
        if (!config.mustConsent)
            closeLink = <a className="hide" onClick={hide} href="#"><Close /></a>

        const ppLink = <a onClick={(e) => {hide()}} href={config.privacyPolicy}>{t(['consentModal','privacyPolicy','name'])}</a>
        return <div className="cookie-modal">
            <div className="cm-bg" onClick={hide}/>
            <div className="cm-modal">
                <div className="cm-header">
                    {closeLink}
                    <h1 className="title">{t(['consentModal', 'title'])}</h1>
                    <p>
                        {t(['consentModal','description'])} &nbsp;
                        {t(['consentModal','privacyPolicy','text'], {privacyPolicy : ppLink})}
                    </p>
                </div>
                <div className="cm-body">
                    <Apps t={t} consents={consents} config={config} toggleAll={toggleAll} toggle={toggle} manager={manager} />
                </div>
                <div className="cm-footer">
                    <a className="cm-btn cm-btn-success" href="#" onClick={saveAndHide}>{t(['ok'])}</a>
                    <a className="cm-btn cm-btn-danger" href="#" onClick={declineAndHide}>{t(['decline'])}</a>
                    <a target="_blank" className="cm-powered-by" href={config.poweredBy || 'https://klaro.kiprotect.com'}>{t(['poweredBy'])}</a>
                </div>
            </div>
        </div>
    }
}

