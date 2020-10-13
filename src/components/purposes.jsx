import React from 'react';
import PurposeItem from './purpose-item';

export default class Purposes extends React.Component {
    constructor(props) {
        super(props);
        props.manager.watch(this);
        this.state = {
            consents: props.manager.consents,
        };
    }

    componentWillUnmount() {
        this.props.manager.unwatch(this);
    }

    update(obj, type, data) {
        if (obj === this.props.manager && type === 'consents')
            this.setState({ consents: data });
    }

    render() {
        const { config, t, manager, lang } = this.props;
        const { consents } = this.state;
        const { services } = config;

        const purposes = {};

        for (const service of services) {
            for (const purpose of service.purposes) {
                if (purposes[purpose] === undefined) purposes[purpose] = [];
                purposes[purpose].push(service);
            }
        }

        const toggle = (purposeKeys, value) => {
            purposeKeys.map((purpose) => {
                const purposeServices = purposes[purpose];
                for (const service of purposeServices) {
                    if (!service.required) {
                        manager.updateConsent(service.name, value);
                    }
                }
            });
        };

        const toggleAll = (value) => {
            toggle(Object.keys(purposes), value);
        };

        const checkServices = (services) => {
            const status = {
                allEnabled: true,
                onlyRequiredEnabled: true,
                allDisabled: true,
                allRequired: true,
            };
            for (const service of services) {
                if (!service.required) status.allRequired = false;
                if (consents[service.name]) {
                    if (!service.required) status.onlyRequiredEnabled = false;
                    status.allDisabled = false;
                } else if (!service.required) status.allEnabled = false;
            }
            if (status.allDisabled) status.onlyRequiredEnabled = false;
            return status;
        };
        const purposeOrder = config.purposeOrder || []
        const purposeItems = Object.keys(purposes).sort((a,b) => purposeOrder.indexOf(a)-purposeOrder.indexOf(b)).map((purpose) => {
            const togglePurpose = (value) => {
                toggle([purpose], value);
            };
            const status = checkServices(purposes[purpose]);
            return (
                <li key={purpose} className="cm-purpose">
                    <PurposeItem
                        allEnabled={status.allEnabled}
                        allDisabled={status.allDisabled}
                        onlyRequiredEnabled={status.onlyRequiredEnabled}
                        required={status.allRequired}
                        consents={consents}
                        name={purpose}
                        config={config}
                        lang={lang}
                        manager={manager}
                        onToggle={togglePurpose}
                        services={purposes[purpose]}
                        t={t}
                    />
                </li>
            );
        });

        const togglablePurposes = Object.keys(purposes).filter((purpose) => {
            for (const service of purposes[purpose]) {
                if (!service.required) return true;
            }
            return false;
        });

        const status = checkServices(services);

        return (
            <ul className="cm-purposes">
                {purposeItems}
                {togglablePurposes.length > 1 && (
                    <li className="cm-purpose cm-toggle-all">
                        <PurposeItem
                            name="disableAll"
                            title={t(['service', 'disableAll', 'title'])}
                            description={t([
                                'service',
                                'disableAll',
                                'description',
                            ])}
                            allDisabled={status.allDisabled}
                            allEnabled={status.allEnabled}
                            onlyRequiredEnabled={status.onlyRequiredEnabled}
                            onToggle={toggleAll}
                            manager={manager}
                            consents={consents}
                            config={config}
                            lang={lang}
                            services={[]}
                            t={t}
                        />
                    </li>
                )}
            </ul>
        );
    }
}
