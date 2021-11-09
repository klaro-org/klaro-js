import React from 'react';
import { asTitle } from '../utils/strings';
import { t as tt } from '../utils/i18n';
import Text from './text';

// to do: remove the deprecated translation keys [name, 'title'] & [name, 'description']

export default class ServiceItem extends React.Component {
    render() {
        const {
            checked,
            onlyRequiredEnabled,
            onToggle,
            name,
            lang,
            config,
            translations,
            title,
            description,
            visible,
            t,
        } = this.props;
        const required = this.props.required || false;
        const optOut = this.props.optOut || false;
        const purposes = this.props.purposes || [];
        const onChange = (e) => {
            onToggle(e.target.checked);
        };
        const id = `service-item-${name}`;
        const titleid = `${id}-title`;
        const purposesText = purposes
            .map(
                (purpose) =>
                    t(['!', 'purposes', purpose, 'title?']) || asTitle(purpose)
            )
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
                    {t([
                        'service',
                        purposes.length > 1 ? 'purposes' : 'purpose',
                    ])}
                    : {purposesText}
                </p>
            );

        const descriptionText =
            description ||
            tt(translations, lang, 'zz', ['!', 'description']) ||
            t(['!', name, 'description?']);

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
                    aria-labelledby={`${titleid}`}
                    aria-describedby={`${id}-description`}
                    disabled={required}
                    checked={checked || required}
                    tabIndex={visible ? '0' : '-1'}
                    type="checkbox"
                    onChange={onChange}
                />
                <label
                    htmlFor={id}
                    className="cm-list-label"
                    {...(required ? { tabIndex: '0' } : {})}
                >
                    <span className="cm-list-title" id={`${titleid}`}>
                        {title ||
                            tt(translations, lang, 'zz', ['!', 'title']) ||
                            t(['!', name, 'title?']) ||
                            asTitle(name)}
                    </span>
                    {requiredText}
                    {optOutText}
                    <span className="cm-switch">
                        <div className="slider round active"></div>
                    </span>
                </label>
                <div id={`${id}-description`}>
                    {descriptionText && (
                        <p className="cm-list-description">
                            <Text config={config} text={descriptionText} />
                        </p>
                    )}
                    {purposesContent}
                </div>
            </div>
        );
    }
}
