import React from 'react';
import Spec from './spec';
import * as Controls from './controls';

export const Styling = ({ config, disabled, controls, updateConfig, t }) => {
    const formControls = Spec.styling.map((stylingField) => {
        const ClassName =
            controls[stylingField.control] || Controls[stylingField.control];
        return (
            <ClassName
                disabled={disabled}
                key={stylingField.name}
                updateConfig={updateConfig}
                config={config}
                t={t}
                key={stylingField.name}
                field={stylingField}
                {...(stylingField.controlProps || {})}
            />
        );
    });
    return (
        <React.Fragment>
            <p className="cm-section-description">
                {t(['styling', 'description'])}
            </p>
            <fieldset className="cm-styling-fields" disabled={disabled}>
                {formControls}
            </fieldset>
        </React.Fragment>
    );
};
