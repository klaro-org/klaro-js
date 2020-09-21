import React, { useState, useEffect } from 'react';
import { SearchSelect } from './search-select';

export const LanguageSelect = ({field, disabled, config, prefix, t, updateConfig}) => {
    const [search, setSearch] = useState('')
    const languages = t.tv.languages
    const generateInitialCandidates = () => Array.from(Object.entries(languages)).filter(([k,])=> !config[field.name].includes(k)).map(([k,v]) => ({name: k, value: `${v.en} - ${v[k]} (${k})`}))
    const [candidates, setCandidates] = useState(generateInitialCandidates())
    const [updated, setUpdated] = useState(false)
    const existingLanguages = new Set(config[field.name])
    const updateSearch = (value) => {
        const candidateLanguages = Array.from(Object.entries(languages)).filter(([k, v]) => !existingLanguages.has(k) && (v[k].toLowerCase().includes(search.toLowerCase()) || v.en.toLowerCase().includes(search.toLowerCase())))
        let candidates = candidateLanguages.map(cl => ({name: cl[0], value: `${cl[1].en} - ${cl[1][cl[0]]} (${cl[0]})`}))
        if (candidates.length > 10)
            candidates = []
        setCandidates(candidates)
        setSearch(value)
    }

    const languageItems = config[field.name].map(language => (
        <li key={language}>{language}: {t(['languages', language])} <a onClick={() => {updateConfig([field.name], config[field.name].filter(lang => lang !== language));setUpdated(true)}}>&#10540;</a></li>
    ))


    useEffect(() => {
        if (updated){
            setCandidates(generateInitialCandidates())
            setUpdated(false)
        }
    })


    const selectLanguage = (language) => {
        const values = config[field.name]
        if (!values.find(value => value === language.name)){
            config[field.name].push(language.name)
            updateConfig([field.name], config[field.name])
        }
        setSearch('')
        setUpdated(true);
    }
    return <div className="cm-language-select">
        <ul className="cm-languages">
            {languageItems}
        </ul>
        <SearchSelect disabled={disabled} search={search} onSelect={selectLanguage} setSearch={updateSearch} candidates={candidates} label={t(['fields', ...(prefix || []), field.name, 'label'])} description={t(['fields', ...(prefix || []), field.name, 'description'])} />
    </div>
}