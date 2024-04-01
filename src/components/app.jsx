import React from 'react';
import ConsentNotice from './consent-notice';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        props.manager.watch(this);
        this.state = {
            show: props.show > 0 || !props.manager.confirmed,
        };
    }

    componentWillUnmount() {
        this.props.manager.unwatch(this);
    }

    update(obj, type) {
        if (obj === this.props.manager && type === 'applyConsents') {
            if (!this.props.config.embedded && this.props.manager.confirmed)
                this.setState({ show: false });
            else this.forceUpdate();
        }
    }

    notifyApi() {
        const { api, modal, show, config } = this.props;
        if (api !== undefined) {
            if (modal || show > 0) return;
            if (!this.props.manager.confirmed) {
                const shownBefore =
                    this.props.manager.auxiliaryStore.getWithKey(
                        'shown-before'
                    );
                if (!shownBefore) {
                    api.update(this, 'showNotice', { config: config });
                    this.props.manager.auxiliaryStore.setWithKey(
                        'shown-before',
                        true
                    );
                }
            }
        }
    }

    componentDidMount() {
        this.notifyApi();
    }

    componentDidUpdate(prevProps) {
        // props.show is a number that is incremented (so that we can detect
        // repeated calls to the "show" function)
        if (prevProps.show === this.props.show) return;
        this.notifyApi();
        const showState = this.props.show > 0 || !this.props.manager.confirmed;
        if (showState !== this.state.show) this.setState({ show: showState });
    }

    render() {
        const { config, t, lang, testing, manager, modal } = this.props;
        const { show } = this.state;
        const { additionalClass, embedded, stylePrefix } = config;

        const hide = () => {
            if (!embedded) {
                document.body.classList.remove('klaro-modal-open');
                this.setState({ show: false });
            }
        };
        return (
            <div
                lang={lang}
                className={
                    (stylePrefix || 'klaro') +
                    (additionalClass !== undefined ? ' ' + additionalClass : '')
                }
            >
                <ConsentNotice
                    key={'app-' + this.props.show}
                    t={t}
                    testing={testing}
                    show={show}
                    lang={lang}
                    modal={modal}
                    hide={hide}
                    config={config}
                    manager={manager}
                />
            </div>
        );
    }
}
