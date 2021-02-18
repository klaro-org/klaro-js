import React, { useState, useEffect } from 'react';
import { SearchSelect } from './search-select';

export const ThemesSelect = ({field, disabled, prefix, config, t, updateConfig}) => {
    const [search, setSearch] = useState('')
    const [updated, setUpdated] = useState(false)
    const themes = t.tv.themes
    const existingThemes = new Set(config[field.name] || [])
    const generateInitialThemes = () => Array.from(Object.entries(themes)).filter(([k,]) => !existingThemes.has(k)).map(([k, v]) => ({name: k, description: t(['themes', k, 'description']), value: t.lang === 'en' ?  `${v.title.en}` : `${v.title.en} - ${t(['themes', k, 'title'])}`}))
    const [candidates, setCandidates] = useState(generateInitialThemes())
    const updateSearch = (value) => {
        const candidateThemes = Array.from(Object.entries(themes)).filter(([k, v]) => !existingThemes.has(k) && (value === '' || k.toLowerCase().includes(search.toLowerCase()) || t(['themes', k, 'title']).toLowerCase().includes(search.toLowerCase())))
        let candidates = candidateThemes.map(cl => ({name: cl[0], description: t(['themes', cl[0], 'description']), value: `${t(['themes', cl[0], 'title'])}`}))
        if (candidates.length > 10)
            candidates = candidates.slice(0, 10)
        setCandidates(candidates)
        setSearch(value)
    }

    const themeItems = Array.from(existingThemes).map(theme => (
        <li key={theme}>{theme} <a onClick={() => {setUpdated(true);updateConfig([field.name], config[field.name].filter(th => th !== theme))}}>&#10540;</a></li>
    ))

    useEffect(() => {
        if (updated){
            setCandidates(generateInitialThemes())
            setUpdated(false)
        }
    })


    const selectTheme = (theme) => {
        const values = config[field.name] || []
        if (!values.find(value => value === theme.name)){
            values.push(theme.name)
            updateConfig([field.name], values)
        }
        setSearch('')
        setUpdated(true);
    }

    return <div className="cm-theme-select">
        <ul className="cm-themes">
            {themeItems}
        </ul>
        <SearchSelect disabled={disabled} search={search} onSelect={selectTheme} setSearch={updateSearch} candidates={candidates} label={t(['fields', ...(prefix || []), field.name, 'label'])} description={t(['fields', ...(prefix || []), field.name, 'description'])} />
    </div>
}