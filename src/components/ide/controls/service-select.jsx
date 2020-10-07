import React, { useState, useEffect } from 'react';
import { SearchSelect } from './search-select';
import { asTitle } from "../../../utils/strings";

function getValue(t, lang, key){
    let dt = t[lang]
    if (dt === undefined)
        return
    for(const k of key){
        if (dt === undefined)
            return
        dt = dt[k]
    }
    return dt
}

export const ServiceSelect = ({field, services, prefix, config, t, updateConfig}) => {
    const [search, setSearch] = useState('')
    const [updated, setUpdated] = useState(false)
    
    const serviceTitle = service => getValue(service.spec.translations || {}, t.lang, ['title']) || getValue(service.spec.translations || {}, 'zz', ['title'])  || asTitle(service.name)
    const generateCandidates = services => services.sort((a, b) => serviceTitle(a) > serviceTitle(b) ? 1 : -1).map(service => ({service: service, name: service.name, value: serviceTitle(service)}))
    const [candidates, setCandidates] = useState(generateCandidates(services))

    const searchServices = (query) => {
        if (!query)
            return services
        let ms = services.filter(service => serviceTitle(service).toLowerCase().includes(query.toLowerCase()))
        return ms
    }

    const updateSearch = (value) => {
        let candidateServices = generateCandidates(searchServices(value))
        if (value !== '')
            candidateServices.unshift({name: value, service: {
                service: {
                    spec: {
                        name: value,
                        cookies: [],
                        purposes: [],
                        requests: [],
                        version: 1,
                    }
                }
            }, value: `${value} (${t(['fields', 'services', 'addNew'])})`})
        setCandidates(candidateServices)
        setSearch(value)
    }

    useEffect(() => {
        if (updated){
            setCandidates(generateCandidates(services))
            setUpdated(false)
        }
    })

    const createService = (candidate) => {
        if (candidate === undefined){
            if (candidate !== '' && candidates.length > 0)
                candidate = candidates[0]
            else
                return;
        }
        updateConfig(['services', null], candidate.service.spec)
        setSearch('')
        setUpdated(true);
    }

    return <div className="cm-service-select">
        <SearchSelect search={search} onSelect={createService} setSearch={updateSearch} candidates={candidates} label={t(['fields', ...(prefix || []), field.name, 'label'])} description={t(['fields', ...(prefix || []), field.name, 'description'])} />
    </div>
}