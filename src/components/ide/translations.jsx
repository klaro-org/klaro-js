import React from 'react';
import translations from '../../translations/index';
import { Tabs, Tab } from './tabs';
import { BaseRetractingLabelInput } from './controls';

function getValue(t, lang, key){
    let dt = t[lang]
    for(const k of key){
        dt = dt[k]
    }
    return dt
}

function getFallbackValue(tv, lang, key){
    let dt = tv
    for(const k of key){
        if (dt === undefined)
            break
        dt = dt[k]
    }
    if (dt !== undefined)
        dt = dt[lang]
    return dt    
}

export const TranslationsForKey = ({hintKey, translationKey, noDefault, onChange, name, translations, languages, t, config}) => {
    /*
    Here we list the different translations
    */
    const allLanguages = [...(noDefault ? [] : ['zz']),...languages]
    const items = allLanguages.map(language => {
        const value = getValue(translations , language, translationKey)
        const fallbackValue = getFallbackValue(t.tv , language, translationKey)
        const isDefault = (value && value === fallbackValue) || ((!value) && fallbackValue !== undefined)
        const changeValue = (v) => {
            if (v === fallbackValue || v === ''){
                onChange(language, undefined)
            }
            else
                onChange(language, v)
        }
        const description = t(['translations', ...hintKey, language === 'zz' ? 'defaultDescription' : 'description'], {name: name, language: t(['languages', language])})
        const label = t(['translations', ...hintKey, language === 'zz' ? 'defaultLabel' : 'label'], {name: name, language: t(['languages', language])})
        return <li key={language}>
            <span className="cm-lang">{language !== 'zz' ? language : '_'}</span>
            <BaseRetractingLabelInput
                onChange={changeValue}
                label={[...label, ...(isDefault ? [' ',...t(['translations', 'defaultValue'])] : [])]}
                value={value || fallbackValue || ''}
                description={description}/>
        </li>
    })
    return <div className="cm-translations-for-key">
        <h4>{t(['translations', ...hintKey, 'title'], {name: name})}</h4>
        <ul>
            {items}
        </ul>
    </div>
}

export const AppTranslations = ({t, config, updateConfig}) => {
    const updateDescription = (app, language, value) => {
        updateConfig(['translations', language, 'apps', app.name, 'description'], value)
    }
    const updateTitle = (app, language, value) => {
        updateConfig(['translations', language, 'apps', app.name, 'title'], value)        
    }
    const appTranslations = config.config.apps.map(app => <React.Fragment key={app.name}>
        <h3>{app.name}</h3>
        <TranslationsForKey
            onChange={(language, value) => updateTitle(app, language, value)}
            t={t}
            hintKey={['apps', 'title']}
            translationKey={['apps', app.name, 'title']}
            name={app.name}
            translations={config.config.translations}
            languages={config.config.languages} />
        <TranslationsForKey
            onChange={(language, value) => updateDescription(app, language, value)}
            t={t}
            hintKey={['apps', 'description']}
            translationKey={['apps', app.name, 'description']}
            name={app.name}
            translations={config.config.translations}
            noDefault
            languages={config.config.languages} />
    </React.Fragment>)
    return <React.Fragment>
        {
            appTranslations.length > 0 && appTranslations || <p className="cm-section-description">
                {t(['translations', 'noTranslations'])}
            </p>
        }
    </React.Fragment>

}

export const PurposeTranslations = ({t, config, updateConfig}) => {
    const purposes = new Set()
    config.config.apps.forEach(app => app.purposes.forEach(purpose => purposes.add(purpose)))
    const updateDescription = (purpose, language, value) => {
        updateConfig(['translations', language, 'purposes', purpose, 'description'], value)        
    }
    const updateTitle = (purpose, language, value) => {
        updateConfig(['translations', language, 'purposes', purpose, 'title'], value)        
    }
    const purposeTranslations = Array.from(purposes.keys()).map(purpose => <React.Fragment key={purpose}>
        <h3>{purpose}</h3>
        <TranslationsForKey
            t={t}
            onChange={(language, value) => updateTitle(purpose, language, value)} 
            translationKey={['purposes', purpose, 'title']}
            hintKey={['purposes', 'title']}
            name={purpose}
            translations={config.config.translations}
            languages={config.config.languages} />
        <TranslationsForKey
            t={t}
            onChange={(language, value) => updateDescription(purpose, language, value)}
            hintKey={['purposes', 'description']}
            translationKey={['purposes', purpose, 'description']}
            name={purpose}
            translations={config.config.translations}
            noDefault
            languages={config.config.languages} />
    </React.Fragment>)
    return <React.Fragment>
        {
            purposeTranslations.length > 0 && purposeTranslations || <p className="cm-section-description">
                {t(['translations', 'noTranslations'])}
            </p>
        }
    </React.Fragment>
}

export const PrivacyPolicyUrlTranslations = ({t, config, updateConfig}) => {
    const updateUrl = (language, value) => {
        updateConfig(['translations', language, 'privacyPolicyUrl'], value)        
    }
    return <TranslationsForKey
        t={t}
        hintKey={['privacyPolicyUrl']}
        name="privacyPolicyUrl"
        translationKey={['privacyPolicyUrl']}
        translations={config.config.translations}
        languages={config.config.languages}
        onChange={updateUrl} />

}

const components = {
    'apps': AppTranslations,
    'purposes': PurposeTranslations,
    'privacyPolicyUrl' : PrivacyPolicyUrlTranslations,
}

export const Translations = ({t, state, setState, config, updateConfig}) => {
    /*
    - We just show the hiearchy of translation values in the reference translations.
    - We need translations for the privacyUrl, the apps and the purposes.
    */
    state = state || {tab: 'apps'}
    const Component = components[state.tab]
    const tabs = Array.from(Object.entries(components)).map(([k, v]) => <Tab active={k === state.tab} onClick={() => setState({tab: k})} key={k}>{t(['translations', 'headers', k])}</Tab>)
    return <React.Fragment>
        <p className="cm-section-description">
            {t(['translations', 'description'])}
        </p>
        <Tabs>
            {tabs}
        </Tabs>
        <div className="cm-translations-fields">
            <Component t={t} config={config} updateConfig={updateConfig} />
        </div>
    </React.Fragment>
}