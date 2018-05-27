import React from 'react'
import ConsentManager from 'consent-manager'
import ConsentNotice from './consent-notice'

export default class App extends React.Component {

    constructor(props){
        super(props)
        const {config} = props
        this.consentManager = new ConsentManager(config)
    }

    render() {
        const {config, show, t} = this.props
            return (
                <ConsentNotice t={t} show={show} config={config} manager={this.consentManager} />
        )
    }
}
