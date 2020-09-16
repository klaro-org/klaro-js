import React from 'react';

export const Switch = ({ t, field, prefix, config, updateConfig }) => {
    const name = field.name;
    const value = config[name];
    const onChange = (e) => updateConfig([name], e.target.checked);
    return (
        <div className="cm-switch-container">
            <input
                id={'fields-' + name}
                className={'cm-list-input'}
                aria-describedby={`${name}-description`}
                checked={value}
                type="checkbox"
                onChange={onChange}
            />
            <label htmlFor={'fields-' + name} className="cm-list-label">
                <span className="cm-list-title">
                    {t(['fields', ...(prefix || []), name, 'label'])}
                </span>
                <span className="cm-switch">
                    <div className="slider round active"></div>
                </span>
            </label>
            <div id={`${name}-description`}>
                <p className="cm-list-description">
                    {t(['fields', ...(prefix || []), name, 'description'])}
                </p>
            </div>
        </div>
    );
};
