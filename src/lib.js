/* globals module, require, VERSION */
import React from 'react'
import App from './components/app'
import ConsentManager from './consent-manager'
import KlaroApi from './utils/api';
import {render as reactRender} from 'react-dom'
import {convertToMap, update} from './utils/maps'
import {t, language} from './utils/i18n'
import {currentScript} from './utils/compat'
export {update as updateConfig} from './utils/config'
import './scss/klaro.scss'

let defaultConfig
const defaultTranslations = new Map([])
const eventHandlers = {}
const events = {}

// IE compatibility
if (window.btoa === undefined)
    window.btoa = false

// When webpack's hot loading is enabled, enable Preact's support for the
// React Dev Tools browser extension.
if(module.hot)
    require('preact/debug')

export function getElementID(config, ide){
    return (config.elementID || 'klaro') + (ide ? '-ide' : '')
}

export function getElement(config, ide){
    const id = getElementID(config, ide)
    let element = document.getElementById(id)
    if (element === null){
        element = document.createElement('div')
        element.id = id
        document.body.appendChild(element)
    }
    return element
}

export function addEventListener(eventType, handler){
    if (eventHandlers[eventType] === undefined)
        eventHandlers[eventType] = [handler]
    else
        eventHandlers[eventType].push(handler)
    // this event did already fire, we call the handler
    if (events[eventType] !== undefined)
        for(const event of events[eventType])
            if (handler(...event) === false)
                break
}

function executeEventHandlers(eventType, ...args){
    const handlers = eventHandlers[eventType]
    if (events[eventType] === undefined)
        events[eventType] = [args]
    else
        events[eventType].push(args)
    if (handlers !== undefined)
        for(const handler of handlers){
            handler(...args)
        }
}

export function getConfigTranslations(config){
    const trans = new Map([])
    update(trans, defaultTranslations)
    update(trans, convertToMap(config.translations || {}))
    return trans
}

let cnt = 1
export function render(config, opts){
    if (config === undefined)
        return
    opts = opts || {}

    executeEventHandlers("render", config, opts)

    // we are using a count here so that we're able to repeatedly open the modal...
    let showCnt = 0
    if (opts.show)
        showCnt = cnt++
    const element = getElement(config)
    const manager = getManager(config)

    if (opts.api !== undefined)
        manager.watch(opts.api)

    const lang = language(config.lang)
    const configTranslations = getConfigTranslations(config)
    const tt = (...args) => t(configTranslations, lang, config.fallbackLang || 'en', ...args)
    const app = reactRender(<App t={tt}
        lang={lang}
        manager={manager}
        config={config}
        modal={opts.modal}
        api={opts.api}
        show={showCnt} />, element)
    return app
}

function showKlaroIDE(script) {
    const baseName = /^(.*)(\/[^/]+)$/.exec(script.src)[1] || ''
    const element = document.createElement('script')
    element.src = baseName !== '' ? baseName + '/ide.js' : 'ide.js'
    element.type = "application/javascript"
    for(const attribute of element.attributes){
        element.setAttribute(attribute.name, attribute.value)
    }
    document.head.appendChild(element)
}


function doOnceLoaded(handler){
    if (/complete|interactive|loaded/.test(document.readyState)){
        handler()
    } else {
        window.addEventListener('DOMContentLoaded', handler)
    }
}

export function setup(){
    const script = currentScript("klaro");
    if (script !== undefined){
        const configName = script.getAttribute('data-config') || "klaroConfig"
        const klaroId = script.getAttribute('data-klaro-id')
        const klaroConfigName = script.getAttribute('data-klaro-config-name') || "default"
        const klaroApiUrl = script.getAttribute('data-klaro-api-url') || 'https://api.kiprotect.com'
        if (klaroId !== null){
            const api = new KlaroApi(klaroApiUrl, klaroId)
            api.loadConfigs().then((configs) => {

                if (!executeEventHandlers("apiConfigsLoaded", configs, api)){
                    return
                }

                defaultConfig = configs.find(config => config.name === klaroConfigName)
                if (defaultConfig === undefined){
                    console.error(`Config ${klaroConfigName} not found`)
                    return
                }
                const initialize = () => {
                    if (!defaultConfig.noAutoLoad)
                        render(defaultConfig, {api: api})
                }
                doOnceLoaded(initialize)

            }).catch((err) => {
                console.error(err, "cannot load Klaro configs")
                executeEventHandlers("apiConfigsFailed", err)
            })
        } else {
            defaultConfig = window[configName]
            if (defaultConfig !== undefined){

                // deprecated: config settings should only be loaded via the config
                const scriptStylePrefix = script.getAttribute('data-style-prefix')
                const scriptNoAutoLoad = script.getAttribute('data-no-auto-load') === "true"
                if (scriptStylePrefix === undefined)
                    defaultConfig.stylePrefix = scriptStylePrefix

                if (scriptNoAutoLoad)
                    defaultConfig.noAutoLoad = true

                const initialize = () => {
                    if (!defaultConfig.noAutoLoad)
                        render(defaultConfig)
                }
                doOnceLoaded(initialize)
            }
        }
        const showIDE = location.hash === '#klaro-ide'
        // we show the Klaro IDE
        if (showIDE){
            showKlaroIDE(script)
        }
    }
}

export function show(config, modal, api){
    config = config || defaultConfig
    render(config, {show: true, modal: modal, api: api})
    return false
}

/* Consent Managers */

const managers = {}

export function resetManagers(){
    for(const key in Object.keys(managers))
        delete managers[key]
}

export function getManager(config){
    config = config || defaultConfig
    const name = config.storageName || config.cookieName || 'default' // deprecated: cookieName
    if (managers[name] === undefined)
        managers[name] = new ConsentManager(config)
    return managers[name]
}

export function version(){
    // we remove the 'v'
    if (VERSION[0] === 'v')
        return VERSION.slice(1)
    return VERSION
}

export {language, defaultConfig, defaultTranslations}
