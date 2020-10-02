import React from 'react';
import { Close } from '../icons';
import ObjectSelector from './object-selector';
import { Services } from './services';
import { Globals } from './globals';
import { Demo } from './demo';
import { JSONConfig } from './json-config';
import { Configs } from './configs';
import { Translations } from './translations';
import { Tabs, Tab } from './tabs';

export class IDEModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: false,
        };
    }

    render() {
        const { config, t, lang } = this.props;
        const { stylePrefix } = config;
        const { hidden } = this.state;

        const hide = (e) => {
            e.preventDefault();
            this.setState({ hidden: true });
        };

        const show = (e) => {
            e.preventDefault();
            this.setState({ hidden: false });
        };

        if (hidden)
            return (
                <div>
                    <a href="#" onClick={show}>
                        open me
                    </a>
                </div>
            );

        return (
            <div className={stylePrefix || 'klaro'}>
                <div className="cookie-modal">
                    <div className="cm-bg" onClick={hide} />
                    <div className="cm-modal cm-ide">
                        <div className="cm-header">
                            <button
                                title={t(['close'])}
                                className="hide"
                                type="button"
                                onClick={hide}
                            >
                                <Close t={t} />
                            </button>
                            <h1 className="title">
                                {t(['consentModal', 'title'])}
                            </h1>
                            Test
                        </div>
                        <div className="cm-body">
                            <IDE t={t} />
                        </div>
                        <div className="cm-footer">
                            <div className="cm-footer-buttons">Buttons</div>
                            <p className="cm-powered-by">
                                <a
                                    target="_blank"
                                    href={
                                        config.poweredBy ||
                                        'https://kiprotect.com/klaro'
                                    }
                                    rel="noopener noreferrer"
                                >
                                    {t(['poweredBy'])}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const tabComponents = {
    globals: Globals,
    services: Services,
    translations: Translations,
    testing: Demo,
    json: JSONConfig,
};

export default class IDE extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        const { state, setState, className, onConfigAction, configs, t, ...rest } = this.props
        const { activeConfig } = state;
        let component
        const unsetConfig = () => {
            setState({activeConfig: undefined})
        }
        const setConfigState = (configState) => {
            const newState = Object.assign({}, state)
            newState.configState = configState
            setState(newState)
        }
        if (activeConfig !== undefined){
            const config = configs.find(config => config.name === activeConfig)
            component = <ConfigIDE state={state.configState} setState={setConfigState} t={t} unsetConfig={unsetConfig} config={config} {...rest} />
        } else {
            component = <Configs onConfigAction={onConfigAction} onClick={(config) => setState({activeConfig: config.name})}configs={configs} t={t} />
        }
        return <div className={className || 'klaro-ide'}>
            {component}
        </div>
    }
}

export class ConfigIDE extends React.Component {

    render() {
        const {
            t,
            disabled,
            controls,
            setState,
            config,
            unsetConfig,
            saveConfig,
            resetConfig,
            updateConfig,
            deleteConfig,
        } = this.props;
        const state = this.props.state || {tab: 'services'};
        const { tab } = state;
        const Component = tabComponents[tab];
        const componentState = state[tab];
        const changeTab = (tab) => setState({ tab: tab });
        const setComponentState = (componentState) => {
            const newState = Object.assign({}, state)
            newState[tab] = componentState
            setState(newState)
        }
        const tabs = [
            'services',
            'globals',
            'translations',
            'testing',
//            'json',
        ].map((tb) => (
            <Tab key={tb} onClick={() => changeTab(tb)} active={tab === tb}>
                {t(['ide', tb])}
            </Tab>
        ));
        return (
            <React.Fragment>
                <div className="cm-config-controls">
                    <h2><a onClick={() => unsetConfig()}>{t(['configs','title'])} &rsaquo;</a> {config.name === 'default' ? t(['configs', 'default', 'title']) : config.name}</h2>
                    <fieldset>
                        <button
                            disabled={disabled || !config.modified}
                            className="cm-control-button cm-secondary"
                            onClick={(e) =>
                                e.preventDefault() ||
                                resetConfig(config.name)
                            }
                        >
                            {t(['config', 'reset'])}
                        </button>
                        <button
                            disabled={disabled || !config.modified}
                            className="cm-control-button"
                            onClick={(e) =>
                                e.preventDefault() ||
                                saveConfig(config.name)
                            }
                        >
                            {t(['config', 'save'])}
                        </button>
                        {false && (
                            <button
                                disabled={disabled}
                                className="cm-control-button"
                                onClick={(e) =>
                                    e.preventDefault() ||
                                    deleteConfig(config.name)
                                }
                            >
                                {t(['config', 'delete'])}
                            </button>
                        )}
                    </fieldset>
                </div>
                <Tabs key="tabs">{tabs}</Tabs>
                <Component
                    state={componentState}
                    setState={setComponentState}
                    disabled={disabled}
                    config={config}
                    updateConfig={(...args) =>
                        updateConfig(config.name, ...args)
                    }
                    controls={controls}
                    t={t}
                />
            </React.Fragment>
        );
    }
}

export class GlobalSettings extends React.Component {}
