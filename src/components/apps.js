import React from 'react'
import Switch from './switch'
import {getPurposes} from 'utils/config'

class AppGroup extends React.Component {
    render(){

    }
}

export default class Apps extends React.Component {

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
        const {config, t, manager} = this.props
        const {consents} = this.state
        const {apps} = config

        const toggle = (apps, value) => {
            apps.map((app)=>{
                manager.updateConsent(app.name, value)
            })
            if (manager.confirmed)
                manager.saveAndApplyConsents()
        }

        const toggleAll = (value) => {
            toggle(apps, value)
        }

        const appItems = apps.map((app) => {
            const toggleApp = (value) => {
                toggle([app], value)
            }
            const required = app.required || false
            const optOut = app.optOut || false
            const checked = consents[app.name]

            const purposesText = app.purposes.map((purpose) => t(['purposes', purpose])).join(", ")
            
            const optOutText = optOut ? <span class="cm-opt-out" title={t(['app', 'optOut', 'description'])}>{t(['app', 'optOut', 'title'])}</span> : ''
            const requiredText = required ? <span class="cm-required" title={t(['app', 'required', 'description'])}>{t(['app', 'required', 'title'])}</span> : ''
            return <li className="cm-app">
                <Switch disabled={required} checked={checked || required} onToggle={toggleApp} />
                <span className="cm-app-title">{app.title}</span>{requiredText}{optOutText}
                <p className="cm-app-description">{t([app.name, 'description'])}</p>
                <p className="purposes">{t([app.purposes.length > 1 ? 'purposes' : 'purpose'])}: {purposesText}</p>
            </li>
        })
        const allDisabled = apps.filter((app) => {
            const required = app.required || false
            if (required)
                return false
            return consents[app.name]
        }).length == 0 ? true : false

        const disableAllItem = <li className="cm-app cm-toggle-all">
            <Switch checked={!allDisabled} onToggle={toggleAll} />
            <span className="cm-app-title">{t(['app','disableAll','title'])}</span>
            <p className="cm-app-description">{t(['app', 'disableAll', 'description'])}</p>
        </li>
        return <ul className="cm-apps">
            {appItems}
            {disableAllItem}
        </ul>

    }
}
