/* globals module, require, VERSION */

import 'scss/klaro.scss'

// When webpack's hot loading is enabled, enable Preact's support for the
// React Dev Tools browser extension.
if(module.hot) require('preact/debug')

import React from 'react'
import App from 'components/app.js'
import ConsentManager from 'consent-manager'
import {render} from 'react-dom'
import translations from 'translations'
import {convertToMap, update} from 'utils/maps'
import {t, language} from 'utils/i18n'

const script = document.currentScript;
const convertedTranslations = convertToMap(translations)
const configName = script.dataset.config || "klaroConfig"
const noAutoLoad = script.dataset.noAutoLoad === "true"
const stylePrefix = script.dataset.stylePrefix || "klaro"
const config = window[configName]
const managers = {}

window.addEventListener('load', initialize)

if (module.hot) {
    if (!noAutoLoad)
        renderKlaro(config)
    module.hot.accept()
}

function getElementID(config){
    return config.elementID || 'klaro'
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

export function getTranslations(conf){
    conf = conf || config
    const trans = new Map([])
    update(trans, convertedTranslations)
    update(trans, convertToMap(conf.translations || {}))
    return trans
}

let cnt = 1

export function renderKlaro(config, show){
    if (config === undefined)
        return
    // we are using a count here so that we're able to repeatedly open the modal...
    let showCnt = 0
    if (show)
        showCnt = cnt++
    const element = getElement(config)
    console.log(element)
    const trans = getTranslations(config)
    const manager = getManager(config)
    const lang = config.lang || language()
    const tt = (...args) => t(trans, lang, ...args)
    const app = render(<App t={tt}
        stylePrefix={stylePrefix}
        manager={manager}
        config={config}
        show={showCnt} />, element)
    return app
}

export function initialize(e){
    if (!noAutoLoad)
        renderKlaro(config)
}

export function resetManagers(){
    for(const key in Object.keys(managers))
        managers.delete(key)
}

export function getManager(conf){
    conf = conf || config
    const name = conf.cookieName || 'default'
    if (managers[name] === undefined)
        managers[name] = new ConsentManager(conf)
    return managers[name]
}

export function show(conf){
    conf = conf || config
    renderKlaro(conf, true)
    return false
}

export function version(){
    return VERSION
}

export {language}
