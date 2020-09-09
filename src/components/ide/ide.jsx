import React from 'react'
import {Close} from '../icons'

export class IDEModal extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            hidden: false
        }
    }

    render() {

        const {config, t, lang} = this.props
        const {stylePrefix} = config
        const {hidden} = this.state

        const hide = (e) => {
            e.preventDefault()
            this.setState({hidden: true})
        }

        const show = (e) => {
            e.preventDefault()
            this.setState({hidden: false})
        }

        if (hidden)
            return <div><a href="#" onClick={show}>open me</a></div>

        return <div className={stylePrefix || 'klaro'}>
                <div className="cookie-modal">
                <div className="cm-bg" onClick={hide}/>
                <div className="cm-modal cm-ide">
                    <div className="cm-header">
                        <button
                            title={t(['close'])}
                            className="hide"
                            type="button"
                            onClick={hide}>
                            <Close t={t} />
                        </button>
                        <h1 className="title">{t(['consentModal', 'title'])}</h1>
                        Test
                    </div>
                    <div className="cm-body">
                        <IDE />
                    </div>
                    <div className="cm-footer">
                        <div className="cm-footer-buttons">
                            Buttons
                        </div>
                        <p className="cm-powered-by"><a target="_blank" href={config.poweredBy || 'https://kiprotect.com/klaro'} rel="noopener noreferrer">{t(['poweredBy'])}</a></p>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default class IDE extends React.Component {
    render(){
        return <div>
            This is the Klaro IDE
        </div>
    }
}