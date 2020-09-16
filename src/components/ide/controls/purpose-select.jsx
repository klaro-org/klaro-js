import React, { useState, useEffect } from 'react';
import { SearchSelect } from './search-select';

export const PurposeSelect = ({field, prefix, config, t, updateConfig}) => {
    const [search, setSearch] = useState('')
    const [updated, setUpdated] = useState(false)
    const purposes = t.tv.purposes
    const existingPurposes = new Set(config[field.name])
    const generateInitialPurposes = () => Array.from(Object.entries(purposes)).filter(([k,]) => !existingPurposes.has(k)).map(([k, v]) => ({name: k, value: t.lang === 'en' ?  `${v.en}` : `${v.en} - ${t(['purposes', k+'?'])}`}))
    const [candidates, setCandidates] = useState(generateInitialPurposes())
    const updateSearch = (value) => {
        const candidatePurposes = Array.from(Object.entries(purposes)).filter(([k, v]) => !existingPurposes.has(k) && (v.en.toLowerCase().includes(search.toLowerCase()) || t(['purposes', k]).toLowerCase().includes(search.toLowerCase())))
        let candidates = candidatePurposes.map(cl => ({name: cl[0], value: `${cl[1].en} - ${t(['purposes', cl[0]+'?'])}`}))
        if (candidates.length > 10 || value === '')
            candidates = []
        if (value !== '')
            candidates.push({name: value, value: `${value} (${t(['purpose', 'add'])})`})
        setCandidates(candidates)
        setSearch(value)
    }

    const purposeItems = config[field.name].map(purpose => (
        <li key={purpose}>{purpose} <a onClick={() => {setUpdated(true);updateConfig([field.name], config[field.name].filter(lang => lang !== purpose))}}>&#10540;</a></li>
    ))

    useEffect(() => {
        if (updated){
            setCandidates(generateInitialPurposes())
            setUpdated(false)
        }
    })


    const selectPurpose = (purpose) => {
        const values = config[field.name]
        if (!values.find(value => value === purpose.name)){
            config[field.name].push(purpose.name)
            updateConfig([field.name], config[field.name])
        }
        setSearch('')
        setUpdated(true);
    }

    return <div className="cm-purpose-select">
        <ul className="cm-purposes">
            {purposeItems}
        </ul>
        <SearchSelect search={search} onSelect={selectPurpose} setSearch={updateSearch} candidates={candidates} label={t(['fields', ...(prefix || []), field.name, 'label'])} description={t(['fields', ...(prefix || []), field.name, 'description'])} />
    </div>
}