import React from 'react'
import Switch from './switch'
import {getPurposes} from 'utils/config'

export default class Apps extends React.Component {
    render(){
        const {config, toggle, manager, t} = this.props
        const {apps} = config
        const appItems = apps.map((app) => {
            const toggleApp = (value) => {
                toggle(app, value)
            }
            const required = app.required || config.required || false
            const optOut = app.optOut || config.optOut || false
            const checked = manager.getConsent(app.name)

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
        return <ul className="apps">
            {appItems}
        </ul>

    }
}
