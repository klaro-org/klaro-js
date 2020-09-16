/* globals VERSION */
import React from 'react'
import {getElement} from './lib'
import IDE from 'components/ide/ide'
import translations from './translations/ide/index'
import {render} from 'react-dom'
import {currentScript} from './utils/compat'
import {t, language} from './utils/i18n'
import {convertToMap} from './utils/maps'
// we import the IDE styles here
import './scss/ide.scss'

const trans = convertToMap(translations)
let defaultConfig

export function renderIDE(config){
    const lang = config.lang || language()
    const element = getElement(config, true)
    const tt = (...args) => t(trans, lang, config.fallbackLang || 'en', ...args)
    const ide = render(<IDE t={tt} lang={lang} config={config} />, element)
    return ide
}

export function show(conf){
    conf = conf || defaultConfig
    renderIDE(conf)
}

export function version(){
    // we remove the 'v'
    if (VERSION[0] === 'v')
        return VERSION.slice(1)
    return VERSION
}

function initialize(){
    show()
}

function setup(){
    const script = currentScript("klaro");
    if (script !== undefined){
        const configName = script.getAttribute('data-config') || "klaroConfig"
        defaultConfig = window[configName]
        // deprecated: config settings should only be loaded via the config
        const scriptStylePrefix = script.getAttribute('data-style-prefix')
        if (scriptStylePrefix === undefined)
            defaultConfig.stylePrefix = scriptStylePrefix
        if (defaultConfig !== undefined){
            if (/complete|interactive|loaded/.test(document.readyState))
                initialize()
            else
                window.addEventListener('DOMContentLoaded', initialize)
        }
    }
}

setup()
