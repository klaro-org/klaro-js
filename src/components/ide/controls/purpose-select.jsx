import React, { useState, useEffect } from 'react';
import { SearchSelect } from './search-select';

export const PurposeSelect = ({field, disabled, prefix, config, t, updateConfig}) => {
    const [search, setSearch] = useState('')
    const [updated, setUpdated] = useState(false)
    const purposes = t.tv.purposes
    const existingPurposes = new Set(config[field.name])
    const generateInitialPurposes = () => Array.from(Object.entries(purposes)).filter(([k,]) => !existingPurposes.has(k)).map(([k, v]) => ({name: k, description: t(['purposes', k, 'description']), value: t.lang === 'en' ?  `${v.title.en}` : `${v.title.en} - ${t(['purposes', k, 'title'])}`}))
    const [candidates, setCandidates] = useState(generateInitialPurposes())
    const updateSearch = (value) => {
        const candidatePurposes = Array.from(Object.entries(purposes)).filter(([k, v]) => !existingPurposes.has(k) && (value === '' || k.toLowerCase().includes(search.toLowerCase()) || t(['purposes', k, 'title']).toLowerCase().includes(search.toLowerCase())))
        let candidates = candidatePurposes.map(cl => ({name: cl[0], description: t(['purposes', cl[0], 'description']), value: `${cl[1].title.en} - ${t(['purposes', cl[0], 'title'])}`}))
        if (candidates.length > 10)
            candidates = []
        if (value !== '')
            candidates.push({name: value, description: t(['purpose', 'descriptionNotice']), value: `${value} (${t(['purpose', 'add'])})`})
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
        <SearchSelect disabled={disabled} search={search} onSelect={selectPurpose} setSearch={updateSearch} candidates={candidates} label={t(['fields', ...(prefix || []), field.name, 'label'])} description={t(['fields', ...(prefix || []), field.name, 'description'])} />
    </div>
}