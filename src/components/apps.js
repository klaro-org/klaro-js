import React from 'react'
import Switch from './switch'

export default class Apps extends React.Component {
    render(){
        const {apps, toggle, manager, t} = this.props
        const appItems = apps.map((app) => {
            const toggleApp = (value) => {
                toggle(app, value)
            }
            const checked = manager.getConsent(app.name)
            return <li>
                <Switch checked={checked} onToggle={toggleApp} />
                <span><b>{app.title}</b></span>
                <p>{t([app.name, 'description'])}</p>
            </li>
        })
        return <ul className="apps">
            {appItems}
        </ul>

    }
}
