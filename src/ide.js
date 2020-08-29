/* globals module, require, VERSION */

// IE compatibility
if (window.btoa === undefined)
    window.btoa = false

import 'scss/ide.scss'

// When webpack's hot loading is enabled, enable Preact's support for the
// React Dev Tools browser extension.
if(module.hot) require('preact/debug')

import React from 'react'
import IDE from 'components/ide/ide'
import ConsentManager from 'consent-manager'
import {render} from 'react-dom'
import translations from 'translations'
import {currentScript} from 'utils/compat'
import {convertToMap, update} from 'utils/maps'
import {t, language, getTranslations} from 'utils/i18n'

const script = currentScript("klaro");
const convertedTranslations = convertToMap(translations)
const configName = script.getAttribute('data-config') || "klaroConfig"
const noAutoLoad = script.getAttribute('data-no-auto-load') === "true"
const stylePrefix = script.getAttribute('data-style-prefix') || "klaro"
const config = window[configName]

window.addEventListener('DOMContentLoaded', initialize)

if (module.hot) {
    if (!noAutoLoad)
        renderKlaro(config)
    module.hot.accept()
}

function getElementID(config){
    return (config.elementID || 'klaro')+'-ide'
}

function getElement(config){
    const id = getElementID(config)
    let element = document.getElementById(id)
    if (element === null){
        element = document.createElement('div')
        element.id = id
        document.body.appendChild(element)
    }
    return element
}
let cnt = 1

export function renderIDE(config){
    const lang = config.lang || language()
    const trans = getTranslations(config)
    const element = getElement(config)
    const tt = (...args) => t(trans, lang, config.fallbackLang || 'en', ...args)
    const ide = render(<IDE t={tt} lang={lang} config={config} stylePrefix={stylePrefix} />, element)
    return ide
}

export function show(conf){
    conf = conf || config
    renderIDE(conf)
}

export function version(){
    // we remove the 'v'
    if (VERSION[0] === 'v')
        return VERSION.slice(1)
    return VERSION
}

export {language}
