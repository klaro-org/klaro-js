import React, { useState } from 'react';
import translations from '../../translations/index';
import { t, language } from '../../utils/i18n';
import { BaseRetractingLabelInput } from './controls';
import App from '../app'
import { convertToMap, update } from '../../utils/maps';
import ConsentManager from '../../consent-manager';

class TestStore {
    constructor(){
        this.value = null
    }

    get() {
        return this.value
    }

    set(value) {
        this.value = value;
    }

    delete() {
        this.value = null
    }
}

function getTranslations(config){
    const trans = new Map();
    update(trans, convertToMap(translations));
    update(trans, convertToMap(config.translations || {}))
    return trans
}

export const Demo = ({t: ttt, config}) => {
    const [show, setShow] = useState(0) 
    const [siteUrl, setSiteUrl] = useState('')
    const [lang, setLang] = useState(config.config.languages > 0 ? config.config.languages[0] : 'en')
    const [testStore, setTestStore] = useState(new TestStore())
    const auxiliaryTestStore = new TestStore()
    const manager = new ConsentManager(config.config, testStore, auxiliaryTestStore);
    const trans = getTranslations(config.config)
    const tt = (...args) => t(trans, lang, config.fallbackLang || 'zz', ...args)
    const languages = config.config.languages.map(language => <option key={language} value={language}>{ttt(['languages', language])} ({language})</option>)
    const testOnSite = () => {
        window.open(siteUrl+`#klaro-testing&klaro-config=${config.name}`)
    }
    return <div className="cm-demo">
        <p className="cm-section-description">
            {ttt(['demo', 'description'])}
        </p>
        <form onSubmit={testOnSite}>
            <div className="cm-config-controls">
                    <BaseRetractingLabelInput value={siteUrl} onChange={setSiteUrl} label={ttt(['demo','testOnSite', 'label'])}/>
                    <button className="cm-control-button cm-success" onClick={(e) => {e.preventDefault();testOnSite()}}>
                        {ttt(['demo', 'testOnSite', 'button'])}
                    </button>
            </div>
        </form>
        <div className="cm-config-controls">
            <div className="cm-control">
                <select value={lang} onChange={(e) => setLang(e.target.value)}>
                    {languages}
                </select>
            </div>
            <div className="cm-control">
                <button className="cm-control-button cm-secondary" onClick={() => {setTestStore(new TestStore());setShow(show + 1);setModal(false)}}>
                    {ttt(['demo', 'reset'])}
                </button>
                <button className="cm-control-button" onClick={() => {setShow(show+1)}}>
                    {ttt(['demo', 'showManager'])}
                </button>
            </div>
        </div>
        <App t={tt}
            lang={lang}
            manager={manager}
            config={config.config}
            show={show}
        />
    </div>
}