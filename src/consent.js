import 'scss/consent.scss'

import App from 'components/app.js'
import React from 'react'
import {render} from 'react-dom'
import translations from 'translations.yml'
import {convertToMap, update} from 'utils/maps'
import {t} from 'utils/i18n'

const element = document.getElementById('consent-manager')
const originalOnLoad = window.onload
const convertedTranslations = convertToMap(translations)

window.onload = initialize

if (module.hot) {
    renderApp(element)
    module.hot.accept()
}

export function renderApp(element, show){
    if (element === null)
        return //no element found, aborting...
    const configName = element.dataset.config || 'consentConfig'
    const config = window[configName]
    if (config === undefined || config === null)
        return //no config found, aborting...

        //we initialize the translations
    const translations = update(convertedTranslations, convertToMap(config.translations || {}))
    const tt = (...args) => {
        return t(translations, ...args)
    }

    const app = render(<App t={tt} config={config} show={show || false} />, element)
}

export function initialize(e){
    if (element !== null)
        element.innerHTML = ''

    renderApp(element)

    if (originalOnLoad !== null){
        originalOnLoad(e)
    }
}

export function show(){
    renderApp(element, true)
}
