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
            const checked = manager.getConsent(app.name)
            return <li>
                <Switch disabled={required} checked={checked || required} onToggle={toggleApp} />
                <span><b>{app.title}{required ? ' ' + t(['app', 'required']) : ''}</b></span>
                <p>{t([app.name, 'description'])}</p>
            </li>
        })
        return <ul className="apps">
            {appItems}
        </ul>

    }
}
