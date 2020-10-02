import React from "react";
import { List, ListHeader, ListItem, ListColumn } from "./list";
import { DropdownMenu, MenuItem } from "./dropdown";

export const ConfigItem = ({t, config, onConfigAction, onClick}) => <ListItem onClick={() => onClick(config)} isCard key={config.name}>
    <ListColumn size="icon cm-status">
        <span title={config.status} className={"cm-status-is-"+config.status}>{config.status === 'active' ? <span>&oplus;</span> : <span>&otimes;</span>}</span>
    </ListColumn>
    <ListColumn size="lg cm-name">
        <p>{config.name === "default" ? t(['configs', 'default', 'title']) : config.name}</p>
    </ListColumn>
    <ListColumn size="icon">
        <DropdownMenu>
            {
                false &&
                <MenuItem onClick={() => onConfigAction(config, 'delete')}>
                     {t(['configs', 'delete'])}
                </MenuItem>
            }
            <MenuItem onClick={() => onConfigAction(config, 'activate')}>
                 {t(['configs', 'activate'])}
            </MenuItem>
            <MenuItem onClick={() => onConfigAction(config, 'deactivate')}>
                 {t(['configs', 'deactivate'])}
            </MenuItem>
        </DropdownMenu>
    </ListColumn>
</ListItem>

export const ConfigList = ({ t, configs, onConfigAction, onClick, disabled }) => {
    const items = configs.map(config => <ConfigItem onClick={onClick} onConfigAction={onConfigAction} key={config.name} t={t} config={config} />)
    return <List className="cm-config-list">
        <ListHeader>
            <ListColumn size="icon">
                {t(['configs', 'status'])}
            </ListColumn>
            <ListColumn size="lg">
                {t(['configs', 'name'])}
            </ListColumn>
            <ListColumn size="icon">
                {t(['menu'])}
            </ListColumn>
        </ListHeader>

        {items}
    </List>
};

export const Configs = ({ t, configs, onClick, onConfigAction, disabled }) => {
    return (
        <div className="cm-ide-configs">
            <p className="cm-section-description">
                {t(['configs', 'description'])}
            </p>
            <ConfigList
                t={t}
                configs={configs}
                disabled={disabled}
                onConfigAction={onConfigAction}
                onClick={onClick}
            />
            {
                false &&
                <div className="cm-config-controls">
                    <button className="cm-control">
                        {t(['config', 'add'])}
                    </button>
                </div>
            }
        </div>
    );
};
