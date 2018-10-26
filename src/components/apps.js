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
        const {config, t, ns, manager} = this.props
        const {consents} = this.state
        const {apps} = config

        const toggle = (apps, value) => {
            apps.map((app)=>{
                manager.updateConsent(app.name, value)
            })
        }

        const toggleAll = (value) => {
            toggle(apps, value)
        }
        const enableAll = () => toggleAll(true)
        const disableAll = () => toggleAll(false)

        const appItems = apps.map((app, key) => {
            const toggleApp = (value) => {
                toggle([app], value)
            }
            const checked = consents[app.name]
            return <li className={ns(`AppList-item AppList-item--${app.name}`)}>
                <AppItem
                    checked={checked || app.required}
                    onToggle={toggleApp}
                    t={t}
                    ns={ns}
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

        return <div>
            <div className={ns('AppToggles')}>
                <button
                    type="button"
                    className={ns('Button Button--info AppToggles-button AppToggles-enableAll')}
                    disabled={!allDisabled}
                    onClick={enableAll}
                >
                    {t(['acceptAll'])}
                </button>
                <button
                    type="button"
                    className={ns('Button Button--info AppToggles-button AppToggles-disableAll')}
                    disabled={allDisabled}
                    onClick={disableAll}
                >
                    {t(['declineAll'])}
                </button>
            </div>
            <ul className={ns('AppList')}>
                {appItems}
            </ul>
        </div>
    }
}
