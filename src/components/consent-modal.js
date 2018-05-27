import React from 'react'
import {Close} from './icons'
import Apps from './apps'

export default class ConsentModal extends React.Component {

    render(){
        const {hide, saveAndHide, apps, config, manager, t} = this.props
        const toggle = (app, value) => {
            manager.updateConsent(app.name, value)
            if (manager.consented)
                manager.saveAndApplyConsents()
        }

        let closeLink
        if (!config.required)
            closeLink = <a className="hide" onClick={hide} href="#"><Close /></a>

        const ppLink = <a href={config.privacyPolicy}>{t(['consent-modal','privacy-policy','name'])}</a>
        return <div className="cookie-modal">
            <div className="cm-bg" onClick={hide}/>
            <div className="cm-modal">
                <div className="cm-header">
                    {closeLink}
                    <h1 className="title">{t(['consent-modal', 'title'])}</h1>
                    <p>
                        {t(['consent-modal','description'])} &nbsp;
                        {t(['consent-modal','privacy-policy','text'], {privacyPolicy : ppLink})}
                    </p>
                </div>
                <div className="cm-body">
                    <Apps t={t} apps={config.apps} toggle={toggle} manager={manager} />
                </div>
                <div className="cm-footer">
                    <a className="cm-btn cm-btn-success" href="#" onClick={saveAndHide}>{t(['ok'])}</a>
                </div>
            </div>
        </div>
    }
}

