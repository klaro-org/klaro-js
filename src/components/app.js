import React from 'react'
import ConsentNotice from './consent-notice'

export default class App extends React.Component {

    render() {
        const {config, show, t, manager, stylePrefix} = this.props
            return (
                <div className={stylePrefix}>
                    <ConsentNotice t={t} show={show} config={config} manager={manager} />
                </div>
        )
    }
}
