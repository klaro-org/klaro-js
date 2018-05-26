import React, { Component } from 'react'
import {t, tt} from 'i18n'
import {getPurposesNames, getCookies} from 'helpers'
import ConsentManager from 'consent-manager'

export default class App extends Component {

    render() {
        const {config} = this.props
        const consentManager = new ConsentManager(config)
        console.log(consentManager.loadConsent())
        consentManager.saveConsent()
        console.log(getCookies())
        return (
                <CookieNotice config={config} manager={consentManager} />
        )
    }
}

export class Switch extends Component {

    render(){
        var {checked} = this.props
        return <label className="switch">
            <input checked={checked} type="checkbox" />
            <span className="slider round active"></span>
        </label>
    }

}

class Apps extends Component {
    render(){
        const {apps, toggle} = this.props
        const appItems = apps.map((app) => {
            const toggleApp = (e) => {
                e.preventDefault()
                toggle(app)
            }
            const checked = false
            return <li>
                <Switch checked={checked} />
                <span onClick={toggleApp}><b>{app.title}</b></span>
                <p>{tt(['description'], app)}</p>
            </li>
        })
        return <ul className="apps">
            {appItems}
        </ul>

    }
}

export class CookieModal extends Component {

    render(){
        const {hide, apps, config} = this.props
        const toggle = (app) => {
//            this.setState({checked : !checked})
        }
        const ppLink = <a href={config.privacyPolicy}>{t(['consent-modal','privacy-policy','name'])}</a>
        return <div className="cookie-modal">
            <div className="cm-bg" onClick={hide}/>
            <div className="cm-modal">
                <div className="cm-header">
                    <a className="hide cm-btn cm-btn-close cm-btn-sm" onClick={hide} href="#">❌</a>
                    <h1 className="title">{t(['consent-modal', 'title'])}</h1>
                    <p>
                        {t(['consent-modal','description'])}
                    </p>
                </div>
                <div className="cm-body">
                    <Apps apps={config.apps} toggle={toggle} />
                    <p>
                        {t(['consent-modal','privacy-policy','text'],{privacyPolicy : ppLink})}
                    </p>
                </div>
                <div className="cm-footer">
                    <a className="cm-btn cm-btn-success" href="#" onClick={hide}>{t(['ok'])}</a>
                </div>
            </div>
        </div>
    }
}

const cookieConfig = window.cookieConfig

export class CookieNotice extends Component {
    render(){
        const {modal} = this.state
        const {config} = this.props

        const purposesNames = getPurposesNames(config).join(", ")

        const showModal = (e) => {
            e.preventDefault()
            this.setState({modal: true})
        }
        const hideModal = (e) => {
            e.preventDefault()
            this.setState({modal: false})
        }
        if (modal)
            return <CookieModal config={config} hide={hideModal} />
        else
            return <div className="cookie-notice">
                <div className="cn-body">
                    <p>
                        {t(['consent-notice', 'description'],{purposes: purposesNames})}
                        <a className="cn-learn-more" href="#test" onClick={showModal}>{t(['consent-notice', 'learn-more'])}</a>
                    </p>
                    <p className="cn-ok">
                        <a className="cm-btn cm-btn-sm cm-btn-success" href="#">{t(['ok'])}</a>
                    </p>
                </div>
            </div>
    }
}
