import React, { useState } from "react";
import { List, ListHeader, ListItem, ListColumn } from "./list";
import { DropdownMenu, MenuItem } from "./dropdown";
import * as Controls from './controls';
import Spec from './spec';

export const ServiceItem = ({t, service, onClick, updateConfig}) => <ListItem onClick={()=>onClick(service)}isCard key={service.name}>
    <ListColumn size="md">
        <p className="cm-name">{service.name}</p>
    </ListColumn>
    <ListColumn size="icon">
        <DropdownMenu>
            <MenuItem onClick={() => updateConfig(['services', service._id], null)}>
                 {t(['services', 'delete'])}
            </MenuItem>
        </DropdownMenu>
    </ListColumn>
</ListItem>

export const ServiceList = ({ t, config, disabled, onClick, updateConfig }) => {
    const services = config.config.services.map(service => <ServiceItem key={service.name} updateConfig={updateConfig} onClick={onClick} t={t} service={service} />)
    return <React.Fragment>
        { services.length > 0 && 
        <List className="cm-service-list">
            <ListHeader>
                <ListColumn size="md">
                    {t(['services', 'name'])}
                </ListColumn>
                <ListColumn size="icon">
                    {t(['menu'])}
                </ListColumn>
            </ListHeader>
            {services}
        </List> ||
        <p className="cm-no-services">{t(['services','noServices'])}</p>
        }
    </React.Fragment>
};

export const ServiceDetails = ({t, setState, service, updateServiceName, updateConfig}) => {
    if (service === undefined)
        return <div />
    return <div className="cm-service-details">
        <ServiceConfig setState={setState} service={service} updateServiceName={updateServiceName} t={t} updateConfig={updateConfig} />
    </div>
}

export const ServiceConfig = ({ service, setState, updateServiceName, disabled, updateConfig, t }) => {
    const formControls = Spec.serviceConfig.map((serviceField) => {
        const ClassName = Controls[serviceField.control];
        const updateServiceConfig = (k ,v) => {
            updateConfig(['services', service._id, ...k], v)
            if (k[0] === 'name')
                updateServiceName(v)
        }
        return (
            <ClassName
                disabled={disabled}
                key={serviceField.name}
                prefix={['services']}
                updateConfig={updateServiceConfig}
                config={service}
                t={t}
                key={serviceField.name}
                field={serviceField}
                {...(serviceField.controlProps || {})}
            />
        );
    });

    const unsetService = () => {
        setState({service: undefined})
    }

    return (
        <React.Fragment>
            <fieldset className="cm-service-fields" disabled={disabled}>
                <h2><a onClick={unsetService}>{t(['services','title'])} &rsaquo;</a> {service.name}</h2>
                {formControls}
            </fieldset>
        </React.Fragment>
    );
};

export const Services = ({ t, tt, state, services, setState, config, disabled, updateConfig }) => {
    state = state || {service: undefined};
    const { service } = state
    let component
    const updateServiceName = (name) => setState({service: name})

    let newServices = []


    if (services !== undefined)
        newServices = services.filter(service => config.config.services.find(configService => configService.name === service.name || configService.id === service.id) === undefined)

    if (service !== undefined){
        component = <ServiceDetails setState={setState} updateServiceName={updateServiceName} t={t} updateConfig={updateConfig} service={config.config.services.find(ap => ap.name === service)} />
    } else {
        component = <React.Fragment>
            <ServiceList
                t={t}
                config={config}
                onClick={(service) => setState({service: service.name})}
                updateConfig={updateConfig}
                disabled={disabled}
            />
            <div className="cm-config-controls">
                <fieldset>
                    <Controls.ServiceSelect services={newServices} updateConfig={updateConfig} config={config.config} field={{name: 'services'}} t={t} />
                </fieldset>
            </div>
        </React.Fragment>
    }
    return (
        <div className="cm-ide-services">
            <p className="cm-section-description">
                {t(['services', 'description'])}
            </p>
            {component}
        </div>
    );
};
