import React, { useState } from "react";
import { List, ListHeader, ListItem, ListColumn } from "./list";
import { DropdownMenu, MenuItem } from "./dropdown";
import * as Controls from './controls';
import Spec from './spec';

export const AppItem = ({t, app, onClick, updateConfig}) => <ListItem onClick={()=>onClick(app)}isCard key={app.name}>
    <ListColumn size="md">
        <p className="cm-name">{app.name}</p>
    </ListColumn>
    <ListColumn size="icon">
        <DropdownMenu>
            <MenuItem onClick={() => updateConfig(['apps', app._id], null)}>
                 {t(['apps', 'delete'])}
            </MenuItem>
        </DropdownMenu>
    </ListColumn>
</ListItem>

export const AppList = ({ t, config, disabled, onClick, updateConfig }) => {
    const apps = config.config.apps.map(app => <AppItem key={app.name} updateConfig={updateConfig} onClick={onClick} t={t} app={app} />)
    return <React.Fragment>
        { apps.length > 0 && 
        <List className="cm-app-list">
            <ListHeader>
                <ListColumn size="md">
                    {t(['apps', 'name'])}
                </ListColumn>
                <ListColumn size="icon">
                    {t(['menu'])}
                </ListColumn>
            </ListHeader>
            {apps}
        </List> ||
        <p className="cm-no-apps">{t(['apps','noApps'])}</p>
        }
    </React.Fragment>
};

export const AppDetails = ({t, app, updateAppName, updateConfig}) => {
    if (app === undefined)
        return <div />
    return <div className="cm-app-details">
        <AppConfig app={app} updateAppName={updateAppName} t={t} updateConfig={updateConfig} />
    </div>
}

export const AppConfig = ({ app, updateAppName, disabled, updateConfig, t }) => {
    const formControls = Spec.appConfig.map((appField) => {
        const ClassName = Controls[appField.control];
        const updateAppConfig = (k ,v) => {
            updateConfig(['apps', app._id, ...k], v)
            if (k[0] === 'name')
                updateAppName(v)
        }
        return (
            <ClassName
                disabled={disabled}
                key={appField.name}
                prefix={['apps']}
                updateConfig={updateAppConfig}
                config={app}
                t={t}
                key={appField.name}
                field={appField}
                {...(appField.controlProps || {})}
            />
        );
    });
    return (
        <React.Fragment>
            <fieldset className="cm-app-fields" disabled={disabled}>
                <h2>{app.name}</h2>
                {formControls}
            </fieldset>
        </React.Fragment>
    );
};

export const Apps = ({ t, state, setState, config, disabled, updateConfig }) => {
    state = state || {app: undefined};
    const { app } = state
    let component
    const updateAppName = (name) => setState({app: name})
    if (app !== undefined){
        component = <AppDetails updateAppName={updateAppName} t={t} updateConfig={updateConfig} app={config.config.apps.find(ap => ap.name === app)} />
    } else {
        component = <React.Fragment>
            <AppList
                t={t}
                config={config}
                onClick={(app) => setState({app: app.name})}
                updateConfig={updateConfig}
                disabled={disabled}
            />
            <div className="cm-config-controls">
                <fieldset>
                    <Controls.AppSelect updateConfig={updateConfig} config={config.config} field={{name: 'apps'}} t={t} lookup={() => []} />
                </fieldset>
            </div>
        </React.Fragment>
    }
    return (
        <div className="cm-ide-apps">
            <p className="cm-section-description">
                {t(['apps', 'description'])}
            </p>
            {component}
        </div>
    );
};
