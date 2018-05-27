import React from 'react'
import ConsentModal from './consent-modal'

export function getPurposes(config){
    const purposes = new Set([])
    for(var i=0;i<config.apps.length;i++){
        const appPurposes = config.apps[i].purposes || []
        for(var j=0;j<appPurposes.length;j++)
            purposes.add(appPurposes[j])
    }
    return Array.from(purposes)
}


export default class ConsentNotice extends React.Component {

    componentWillReceiveProps(props){
        if (props.show)
            this.setState({modal : undefined})
    }

    render(){

        const {modal} = this.state
        const {config, manager, show, t} = this.props

        const purposes = getPurposes(config)
        const purposesText = purposes.map((purpose) => t(['purposes', purpose])).join(", ")

        const showModal = (e) => {
            e.preventDefault()
            this.setState({modal: true})
        }
        const hide = (e) => {
            e.preventDefault()
            this.setState({modal: false})
        }

        const saveAndHide = (e) => {
            e.preventDefault()
            manager.saveAndApplyConsents()
            this.setState({modal: false})
        }

        if (manager.consented && !show)
            return <div />

        if (modal || (show && modal === undefined) || (config.required && !manager.consented))
            return <ConsentModal t={t} config={config} hide={hide} saveAndHide={saveAndHide} manager={manager} />
        else if (!manager.consented)
            return <div className="cookie-notice">
                <div className="cn-body">
                    <p>
                        {t(['consent-notice', 'description'], {purposes: <b>{purposesText}</b>})}
                    </p>
                    <p className="cn-ok">
                        <a className="cm-btn cm-btn-sm cm-btn-success" href="#" onClick={saveAndHide}>{t(['ok'])}</a>
                        <a className="cm-btn cm-btn-sm cm-btn-info" href="#" onClick={showModal}>{t(['consent-notice', 'learn-more'])}</a>
                    </p>
                </div>
            </div>
        else
            return <div />
    }
}
