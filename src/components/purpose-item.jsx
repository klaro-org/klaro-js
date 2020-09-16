import React from 'react';
import { AppItems } from './apps';
import { asTitle } from '../utils/strings';

export default class PurposeItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appsVisible: false,
        };
    }

    render() {
        const {
            allEnabled,
            onlyRequiredEnabled,
            allDisabled,
            apps,
            onToggle,
            name,
            manager,
            consents,
            title,
            description,
            t,
        } = this.props;
        const { appsVisible } = this.state;
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
                title={t(['!', 'app', 'required', 'description']) || ''}
            >
                {t(['app', 'required', 'title'])}
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

        const toggleAppsVisible = (e) => {
            e.preventDefault();
            this.setState({ appsVisible: !appsVisible });
        };

        const toggle = (apps, value) => {
            apps.map((app) => {
                if (!app.required) {
                    manager.updateConsent(app.name, value);
                }
            });
        };

        const appItems = (
            <AppItems apps={apps} toggle={toggle} consents={consents} t={t} />
        );

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
                    <p className="cm-list-description">
                        {description ||
                            t(['!', 'purposes', name, 'description']) ||
                            ''}
                    </p>
                    {purposesContent}
                </div>
                {apps.length > 0 && (
                    <div className="cm-apps">
                        <div className="cm-caret">
                            <a href="#" onClick={toggleAppsVisible}>
                                {(appsVisible && <span>&#8593;</span>) || (
                                    <span>&#8595;</span>
                                )}{' '}
                                {apps.length}{' '}
                                {t([
                                    'purposeItem',
                                    apps.length > 1 ? 'apps' : 'app',
                                ])}
                            </a>
                        </div>
                        <ul
                            className={
                                'cm-content' + (appsVisible ? ' expanded' : '')
                            }
                        >
                            {appItems}
                        </ul>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
