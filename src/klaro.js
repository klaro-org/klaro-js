/* globals module, require, VERSION */

if (window.btoa === undefined)
    window.btoa = false

import 'scss/klaro.scss'

// When webpack's hot loading is enabled, enable Preact's support for the
// React Dev Tools browser extension.
if(module.hot) require('preact/debug')

import React from 'react'
import App from 'components/app.js'
import ConsentManager from 'consent-manager'
import {render} from 'react-dom'
import translations from 'translations'
import {currentScript} from 'utils/compat'
import {convertToMap, update} from 'utils/maps'
import {t, language} from 'utils/i18n'

const script = currentScript("klaro");
const convertedTranslations = convertToMap(translations)
const configName = script.getAttribute('data-config') || "klaroConfig"
const noAutoLoad = script.getAttribute('data-no-auto-load') === "true"
const stylePrefix = script.getAttribute('data-style-prefix') || "klaro"
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

export function renderKlaro(config, show, modal){
    if (config === undefined)
        return
    // we are using a count here so that we're able to repeatedly open the modal...
    let showCnt = 0
    if (show)
        showCnt = cnt++
    const element = getElement(config)
    const trans = getTranslations(config)
    const manager = getManager(config)
    const lang = config.lang || language()
    const tt = (...args) => t(trans, lang, ...args)
    const app = render(<App t={tt}
        stylePrefix={stylePrefix}
        manager={manager}
        config={config}
        modal={modal}
        show={showCnt} />, element)
    return app
}

export function initialize(){
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

export function show(conf, modal){
    conf = conf || config
    renderKlaro(conf, true, modal)
    return false
}

export function version(){
    return VERSION
}

export {language}
