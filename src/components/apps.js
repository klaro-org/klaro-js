import React from 'react'
import Switch from './switch'

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
            const optOutText = optOut ? <span class="cm-opt-out" title={t(['app', 'optOut', 'description'])}>{t(['app', 'optOut', 'title'])}</span> : ''
            const requiredText = required ? <span class="cm-required" title={t(['app', 'required', 'description'])}>{t(['app', 'required', 'title'])}</span> : ''
            return <li>
                <Switch disabled={required} checked={checked || required} onToggle={toggleApp} />
                <span><b>{app.title}{requiredText}{optOutText}</b></span>
                <p>{t([app.name, 'description'])}</p>
            </li>
        })
        return <ul className="apps">
            {appItems}
        </ul>

    }
}
