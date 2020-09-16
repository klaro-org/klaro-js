import React from 'react';
import PropTypes from 'prop-types';

export const Input = ({ value, onChange, ...props }) => (
    <input
        className="cm-input"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        {...props}
    />
);

export const BaseRetractingLabelInput = ({name, children, className, value, label, description, onChange, ...props}) => (
        <div
        className={
            'cm-retracting-label-input' + (className ? ' ' + className : '')
        }
    >
        <Input
            aria-labelledby={name + '-label'}
            {...props}
            value={value}
            onChange={onChange}
            className="cm-input"
            placeholder=" " // Used to determine if the input is empty; needs to be a space for Chrome
        />
        <span
            id={name + '-label'}
            aria-hidden="true"
            className="cm-label"
        >
            {label}
        </span>
        <p className="cm-description">
            {description}
        </p>
        {children}
    </div>
)

export const RetractingLabelInput = ({
    t,
    field,
    children,
    prefix,
    config,
    className,
    updateConfig,
    ...props
}) => <BaseRetractingLabelInput description={t(['fields', ...(prefix || []), field.name, 'description'])} value={config[field.name] || ''} label={t(['fields', ...(prefix || []), field.name, 'label'])} {...props} className={className} name={field.name} onChange={(value) => updateConfig([field.name], value)} children={children} />;

RetractingLabelInput.propTypes = {
    className: '',
};

RetractingLabelInput.propTypes = {
    /* Class name to apply on the input */
    className: PropTypes.string,
};
