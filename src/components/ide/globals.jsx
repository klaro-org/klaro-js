import React from 'react';
import Spec from './spec';
import * as Controls from './controls';

export const Globals = ({ config, disabled, controls, updateConfig, t }) => {
    const formControls = Spec.globals.map((globalField) => {
        const ClassName =
            controls[globalField.control] || Controls[globalField.control];
        return (
            <ClassName
                disabled={disabled}
                key={globalField.name}
                updateConfig={updateConfig}
                config={config.config}
                t={t}
                key={globalField.name}
                field={globalField}
                {...(globalField.controlProps || {})}
            />
        );
    });
    return (
        <React.Fragment>
            <p className="cm-section-description">
                {t(['globals', 'description'])}
            </p>
            <fieldset className="cm-global-fields" disabled={disabled}>
                {formControls}
            </fieldset>
        </React.Fragment>
    );
};
