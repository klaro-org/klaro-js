import React from 'react'
import PurposeItem from './purpose-item'

export default class Purposes extends React.Component {

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

        const purposes = {}

        for(const app of apps){
            for(const purpose of app.purposes){
                if (purposes[purpose] === undefined)
                    purposes[purpose] = []
                purposes[purpose].push(app);
            }
        }

        const toggle = (purposeKeys, value) => {
            purposeKeys.map((purpose)=>{
                const purposeApps = purposes[purpose]
                for(const app of purposeApps){
                    if  (!app.required) {
                        manager.updateConsent(app.name, value)
                    }
                }
            })
        }

        const toggleAll = (value) => {
            toggle(Object.keys(purposes), value)
        }

        const checkApps = (apps) => {
            const status = {
                allEnabled: true,
                onlyRequiredEnabled: true,
                allDisabled: true,
                allRequired: true,
            }
            for(const app of apps){
                if (!app.required)
                    status.allRequired = false
                if (consents[app.name]){
                    if (!app.required)
                        status.onlyRequiredEnabled = false
                    status.allDisabled = false
                }
                else if (!app.required)
                    status.allEnabled = false
            }
            if (status.allDisabled)
                status.onlyRequiredEnabled = false
            return status
        }

        const purposeItems = Object.keys(purposes).map((purpose) => {
            const togglePurpose = (value) => {
                toggle([purpose], value)
            }
            const status = checkApps(purposes[purpose])
            return <li key={purpose} className="cm-purpose">
                <PurposeItem
                    allEnabled={status.allEnabled}
                    allDisabled={status.allDisabled}
                    onlyRequiredEnabled={status.onlyRequiredEnabled}
                    required={status.allRequired}
                    consents={consents}
                    name={purpose}
                    manager={manager}
                    onToggle={togglePurpose}
                    apps={purposes[purpose]}
                    t={t}
                />
            </li>
        })

        const togglablePurposes = Object.keys(purposes).filter(purpose => {
            for(const app of purposes[purpose]){
                if (!app.required)
                    return true
            }
            return false
        });


        const status = checkApps(apps)

        return <ul className="cm-purposes">
            {purposeItems}
            {togglablePurposes.length > 1 && (
                <li className="cm-purpose cm-toggle-all">
                    <PurposeItem
                        name="disableAll"
                        title={t(['app','disableAll','title'])}
                        description={t(['app', 'disableAll', 'description'])}
                        allDisabled={status.allDisabled}
                        allEnabled={status.allEnabled}
                        onlyRequiredEnabled={status.onlyRequiredEnabled}
                        onToggle={toggleAll}
                        manager={manager}
                        consents={consents}
                        apps={[]}
                        t={t}
                    />
                </li>
            )}
        </ul>

    }
}
