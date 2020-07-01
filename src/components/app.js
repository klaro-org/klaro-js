import React from 'react';
import ConsentNotice from './consent-notice';
import FloatingButton from './floating-button';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: props.show > 0 || !props.manager.confirmed,
        };
    }

    componentDidUpdate(prevProps) {
        // props.show is a number that is incremented (so that we can detect
        // repeated calls to the "show" function)
        if (prevProps.show === this.props.show) return;
        const showState = this.props.show > 0 || !this.props.manager.confirmed;
        if (showState !== this.state.show) this.setState({ show: showState });
    }

    render() {
        const { config, t, manager, stylePrefix } = this.props;
        const { show } = this.state;

        const hide = () => {
            this.setState({ show: false });
            document.body.classList.add('consent-confirmed');
            document.body.classList.remove('curryKlaroManager');
        };
        return (
            <div className={stylePrefix}>
                <ConsentNotice
                    t={t}
                    show={show}
                    hide={hide}
                    config={config}
                    manager={manager}
                />
                <FloatingButton
                    t={t}
                    show={!show}
                    hide={hide}
                    config={config}
                    manager={manager}
                />
            </div>
        );
    }
}
