import React, { useState, useEffect } from 'react';
import { SearchSelect } from './search-select';

export const ServiceSelect = ({field, lookup, prefix, config, t, updateConfig}) => {
    const [search, setSearch] = useState('')
    const [updated, setUpdated] = useState(false)
    const existingServices = new Set(config[field.name].map(service => service.name))
    const generateInitialServices = () => []
    const [candidates, setCandidates] = useState(generateInitialServices())

    const updateSearch = (value) => {
        let candidateServices = lookup(value)
        if (candidates.length > 10 || value === '')
            candidateServices = []
        if (value !== '')
            candidateServices.unshift({name: value, service: {}, value: `${value} (${t(['fields', 'services', 'addNew'])})`})
        setCandidates(candidateServices)
        setSearch(value)
    }

    useEffect(() => {
        if (updated){
            setCandidates(generateInitialServices())
            setUpdated(false)
        }
    })

    const createService = (service) => {
        if (service === undefined){
            if (search !== '' && candidates.length > 0)
                service = candidates[0]
            else
                return;
        } 
        service.cookies = []
        service.purposes = []
        updateConfig(['services', null], service)
        setSearch('')
        setUpdated(true);
    }

    return <div className="cm-service-select">
        <SearchSelect search={search} onSelect={createService} setSearch={updateSearch} candidates={candidates} label={t(['fields', ...(prefix || []), field.name, 'label'])} description={t(['fields', ...(prefix || []), field.name, 'description'])} />
    </div>
}