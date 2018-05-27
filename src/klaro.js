import 'scss/consent.scss'

import React from 'react'
import App from 'components/app.js'
import ConsentManager from 'consent-manager'
import {render} from 'react-dom'
import translations from 'translations.yml'
import {convertToMap, update} from 'utils/maps'
import {t} from 'utils/i18n'

const originalOnLoad = window.onload
const convertedTranslations = convertToMap(translations)

window.onload = initialize

if (module.hot) {
    renderKlaro()
    module.hot.accept()
}

function getConfig(element){
    return window.klaroConfig
}

function getElement(){
    var element = document.getElementById('klaro-manager')
    if (element === null){
        element = document.createElement('div')
        element.id = 'klaro-manager'
        document.body.appendChild(element)
    }
    return element
}

export function renderKlaro(show){
    const config = getConfig(element)
    if (config === undefined)
        return //no config found, aborting...
    const element = getElement()
    //we initialize the translations
    const translations = update(convertedTranslations, convertToMap(config.translations || {}))
    const tt = (...args) => {
        return t(translations, ...args)
    }

    const app = render(<App t={tt} config={config} show={show || false} />, element)
}

export function initialize(e){
    renderKlaro()
    if (originalOnLoad !== null){
        originalOnLoad(e)
    }
}

export function getManager(){
    return new ConsentManager(getConfig())
}

export function show(){
    renderKlaro(true)
}
