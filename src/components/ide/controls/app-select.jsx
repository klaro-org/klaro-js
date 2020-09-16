import React, { useState, useEffect } from 'react';
import { SearchSelect } from './search-select';

export const AppSelect = ({field, lookup, prefix, config, t, updateConfig}) => {
    const [search, setSearch] = useState('')
    const [updated, setUpdated] = useState(false)
    const existingApps = new Set(config[field.name].map(app => app.name))
    const generateInitialApps = () => []
    const [candidates, setCandidates] = useState(generateInitialApps())

    const updateSearch = (value) => {
        let candidateApps = lookup(value)
        if (candidates.length > 10 || value === '')
            candidateApps = []
        if (value !== '')
            candidateApps.unshift({name: value, app: {}, value: `${value} (${t(['fields', 'apps', 'addNew'])})`})
        setCandidates(candidateApps)
        setSearch(value)
    }

    useEffect(() => {
        if (updated){
            setCandidates(generateInitialApps())
            setUpdated(false)
        }
    })

    const createApp = (app) => {
        if (app === undefined){
            if (search !== '' && candidates.length > 0)
                app = candidates[0]
            else
                return;
        } 
        app.cookies = []
        app.purposes = []
        updateConfig(['apps', null], app)
        setSearch('')
        setUpdated(true);
    }

    return <div className="cm-app-select">
        <SearchSelect search={search} onSelect={createApp} setSearch={updateSearch} candidates={candidates} label={t(['fields', ...(prefix || []), field.name, 'label'])} description={t(['fields', ...(prefix || []), field.name, 'description'])} />
    </div>
}