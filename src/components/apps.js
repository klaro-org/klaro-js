import React from 'react'
import AppItem from './app-item'
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
                if  (!app.required) {
                    manager.updateConsent(app.name, value)
                }
            })
        }

        const toggleAll = (value) => {
            toggle(apps, value)
        }

        const appItems = apps.map((app, key) => {
            const toggleApp = (value) => {
                toggle([app], value)
            }
            const checked = consents[app.name]
            return <li className="cm-app">
                <AppItem
                    checked={checked || app.required}
                    onToggle={toggleApp}
                    t={t}
                    {...app}
                />
            </li>
        })
        const allDisabled = apps.filter((app) => {
            const required = app.required || false
            if (required)
                return false
            return consents[app.name]
        }).length == 0 ? true : false

        const disableAllItem = <li className="cm-app cm-toggle-all">
            <AppItem
                name="disableAll"
                title={t(['app','disableAll','title'])}
                description={t(['app', 'disableAll', 'description'])}
                checked={!allDisabled}
                onToggle={toggleAll}
                t={t}
            />
        </li>
        return <ul className="cm-apps">
            {appItems}
            {disableAllItem}
        </ul>

    }
}
