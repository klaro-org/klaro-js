import React from 'react'
import ConsentNotice from './consent-notice'

export default class App extends React.Component {

    constructor(props){
        super(props)
        props.manager.watch(this)
        this.state = {
            show: props.show > 0 || !props.manager.confirmed
        }
    }

    componentWillUnmount(){
        this.props.manager.unwatch(this)
    }

    update(obj, type){
        if (obj === this.props.manager && type === 'applyConsents'){
            if ((!this.props.config.embedded) && this.props.manager.confirmed)
                this.setState({show: false})
            else
                this.forceUpdate()
        }
    }

    componentDidUpdate(prevProps){
        // props.show is a number that is incremented (so that we can detect
        // repeated calls to the "show" function)
        if (prevProps.show === this.props.show)
            return
        const showState = this.props.show > 0 || !this.props.manager.confirmed
        if (showState !== this.state.show)
            this.setState({show: showState})
    }

    render() {
        const {config, t, lang, manager, stylePrefix, modal} = this.props
        const {show} = this.state
        const {additionalClass, embedded} = config

        const hide = () => {
            if (!embedded)
                this.setState({show: false})
        }
        return (
            <div lang={lang} className={stylePrefix + (additionalClass !== undefined ? (' ' + additionalClass) : '')}>
                <ConsentNotice key={"app-"+this.props.show} t={t} show={show} modal={modal} hide={hide} config={config} manager={manager} />
            </div>
        )
    }
}
