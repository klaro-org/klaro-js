import React from 'react'
import ConsentNotice from './consent-notice'

export default class App extends React.Component {

    render() {
        const {config, show, t, manager, ns} = this.props
        return (
            <div className={ns('Container')}>
                <ConsentNotice t={t} ns={ns} show={show} config={config} manager={manager} />
            </div>
        )
    }
}
