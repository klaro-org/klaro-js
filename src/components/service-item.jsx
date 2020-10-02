import React from 'react';
import { asTitle } from '../utils/strings';
import { t as tt } from '../utils/i18n';

// to do: remove the deprecated translation keys [name, 'title'] & [name, 'description']

export default class ServiceItem extends React.Component {
    render() {
        const {
            checked,
            onlyRequiredEnabled,
            onToggle,
            name,
            lang,
            translations,
            title,
            description,
            t,
        } = this.props;
        const required = this.props.required || false;
        const optOut = this.props.optOut || false;
        const purposes = this.props.purposes || [];
        const onChange = (e) => {
            onToggle(e.target.checked);
        };
        const id = `service-item-${name}`;
        const purposesText = purposes
            .map((purpose) => t(['!', 'purposes', purpose, 'title?']) || asTitle(purpose))
            .join(', ');
        const optOutText = optOut ? (
            <span
                className="cm-opt-out"
                title={t(['service', 'optOut', 'description'])}
            >
                {t(['service', 'optOut', 'title'])}
            </span>
        ) : (
            ''
        );
        const requiredText = required ? (
            <span
                className="cm-required"
                title={t(['service', 'required', 'description'])}
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
                    {t(['service', purposes.length > 1 ? 'purposes' : 'purpose'])}:{' '}
                    {purposesText}
                </p>
            );

        return (
            <div>
                <input
                    id={id}
                    className={
                        'cm-list-input' +
                        (required ? ' required' : '') +
                        (onlyRequiredEnabled
                            ? ' half-checked only-required'
                            : '')
                    }
                    aria-describedby={`${id}-description`}
                    disabled={required}
                    checked={checked || required}
                    type="checkbox"
                    onChange={onChange}
                />
                <label
                    htmlFor={id}
                    className="cm-list-label"
                    {...(required ? { tabIndex: '0' } : {})}
                >
                    <span className="cm-list-title">
                        {title || tt(translations, lang, 'zz', ['!', 'title']) || asTitle(name)}
                    </span>
                    {requiredText}
                    {optOutText}
                    <span className="cm-switch">
                        <div className="slider round active"></div>
                    </span>
                </label>
                <div id={`${id}-description`}>
                    <p className="cm-list-description">
                        {description || tt(translations, lang, 'zz', ['!', 'description']) || ''}
                    </p>
                    {purposesContent}
                </div>
            </div>
        );
    }
}
