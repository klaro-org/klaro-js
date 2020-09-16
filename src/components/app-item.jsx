import React from 'react';
import { asTitle } from '../utils/strings';

// to do: remove the deprecated translation keys [name, 'title'] & [name, 'description']

export default class AppItem extends React.Component {
    render() {
        const {
            checked,
            onlyRequiredEnabled,
            onToggle,
            name,
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
        const id = `app-item-${name}`;
        const purposesText = purposes
            .map((purpose) => t(['!', 'purposes', purpose, 'title?']) || asTitle(purpose))
            .join(', ');
        const optOutText = optOut ? (
            <span
                className="cm-opt-out"
                title={t(['app', 'optOut', 'description'])}
            >
                {t(['app', 'optOut', 'title'])}
            </span>
        ) : (
            ''
        );
        const requiredText = required ? (
            <span
                className="cm-required"
                title={t(['app', 'required', 'description'])}
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
                    {t(['app', purposes.length > 1 ? 'purposes' : 'purpose'])}:{' '}
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
                        {title || t(['!', 'apps', name, 'title']) || t(['!', name, 'title']) || asTitle(name)}
                    </span>
                    {requiredText}
                    {optOutText}
                    <span className="cm-switch">
                        <div className="slider round active"></div>
                    </span>
                </label>
                <div id={`${id}-description`}>
                    <p className="cm-list-description">
                        {description || t(['!', 'apps', name, 'description']) || t(['!', name, 'description']) || ''}
                    </p>
                    {purposesContent}
                </div>
            </div>
        );
    }
}
