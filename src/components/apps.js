import React from 'react'
import AppItem from './app-item'

export default class Apps extends React.Component {

    constructor(props){
        super(props)
        props.manager.watch(this)
        this.state = {
            consents : props.manager.consents
        }
    }

    componentWillUnmount(){
        this.props.manager.unwatch(this)
    }

    update(obj, type, data){
        if (obj === this.props.manager && type === 'consents')
            this.setState({consents : data})
    }

    render(){
        const {config, t, manager} = this.props
        const {consents} = this.state
        const {apps} = config

        const toggle = (apps, value) => {
            apps.map((app)=>{
                if  (!app.required) {
                    manager.updateConsent(app.name, value)
                }
            })
        }

        const toggleAll = (value) => {
            toggle(apps, value)
        }

        const appItems = apps.map((app) => {
            const toggleApp = (value) => {
                toggle([app], value)
            }
            const checked = consents[app.name]
            return <li key={app.name} className="cm-app">
                <AppItem
                    checked={checked || app.required}
                    onToggle={toggleApp}
                    t={t}
                    {...app}
                />
            </li>
        })

        const togglableApps = apps.filter(app => !app.required);

        const allDisabled = togglableApps.filter(
            app => consents[app.name]
        ).length === 0;

        return <ul className="cm-apps">
            {appItems}
            {togglableApps.length > 1 && (
                <li className="cm-app cm-toggle-all">
                    <AppItem
                        name="disableAll"
                        title={t(['app','disableAll','title'])}
                        description={t(['app', 'disableAll', 'description'])}
                        checked={!allDisabled}
                        onToggle={toggleAll}
                        t={t}
                    />
                </li>
            )}
        </ul>

    }
}
