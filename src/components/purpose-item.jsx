import React from 'react';
import { ServiceItems } from './services';
import { asTitle } from '../utils/strings';
import Text from './text';

export default class PurposeItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            servicesVisible: this.props.config.purposeExpended !== "undefined" ? this.props.config.purposeExpended : false,
        };
    }

    render() {
        const {
            allEnabled,
            onlyRequiredEnabled,
            allDisabled,
            services,
            config,
            onToggle,
            name,
            lang,
            manager,
            consents,
            title,
            description,
            t,
        } = this.props;
        const { servicesVisible } = this.state;
        const required = this.props.required || false;
        const purposes = this.props.purposes || [];
        const onChange = (e) => {
            onToggle(e.target.checked);
        };
        const id = `purpose-item-${name}`;
        const purposesText = purposes
            .map((purpose) => t(['!', 'purposes', purpose, 'title?']) || asTitle(purpose))
            .join(', ');
        const requiredText = required ? (
            <span
                className="cm-required"
                title={t(['!', 'service', 'required', 'description']) || ''}
            >
                {t(['service', 'required', 'title'])}
            </span>
        ) : (
            ''
        );

        let purposesContent;
        if (purposes.length > 0)
            purposesContent = (
                <p className="purposes">
                    {t([
                        'purpose',
                        purposes.length > 1 ? 'purposes' : 'purpose',
                    ])}
                    : {purposesText}
                </p>
            );

        const toggleServicesVisible = (e) => {
            e.preventDefault();
            this.setState({ servicesVisible: !servicesVisible });
        };

        const toggle = (services, value) => {
            services.map((service) => {
                if (!service.required) {
                    manager.updateConsent(service.name, value);
                }
            });
        };

        const serviceItems = (
            <ServiceItems config={config} lang={lang} services={services} toggle={toggle} consents={consents} t={t} />
        );

        const descriptionText = description || t(['!', 'purposes', name, 'description'])

        return (
            <React.Fragment>
                <input
                    id={id}
                    className={
                        'cm-list-input' +
                        (required ? ' required' : '') +
                        (!allEnabled
                            ? onlyRequiredEnabled
                                ? ' only-required'
                                : ' half-checked'
                            : '')
                    }
                    aria-describedby={`${id}-description`}
                    disabled={required}
                    checked={
                        allEnabled || (!allDisabled && !onlyRequiredEnabled)
                    }
                    type="checkbox"
                    onChange={onChange}
                />
                <label
                    htmlFor={id}
                    className="cm-list-label"
                    {...(required ? { tabIndex: '0' } : {})}
                >
                    <span className="cm-list-title">
                        {title || t(['!', 'purposes', name, 'title?']) || asTitle(name)}
                    </span>
                    {requiredText}
                    <span className="cm-switch">
                        <div className="slider round active"></div>
                    </span>
                </label>
                <div id={`${id}-description`}>
                    {
                        descriptionText &&
                        <p className="cm-list-description">
                            <Text
                                config={config}
                                text={descriptionText}
                            />
                        </p>
                    }
                    {purposesContent}
                </div>
                {services.length > 0 && (
                    <div className="cm-services">
                        <div className="cm-caret">
                            <a href="#" onClick={toggleServicesVisible}>
                                {(servicesVisible && <span>&#8593;</span>) || (
                                    <span>&#8595;</span>
                                )}{' '}
                                {services.length}{' '}
                                {t([
                                    'purposeItem',
                                    services.length > 1 ? 'services' : 'service',
                                ])}
                            </a>
                        </div>
                        <ul
                            className={
                                'cm-content' + (servicesVisible ? ' expanded' : '')
                            }
                        >
                            {serviceItems}
                        </ul>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
