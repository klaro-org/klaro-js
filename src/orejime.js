import React from 'react'
import {render} from 'react-dom'
import ConsentManager from './consent-manager'
import translations from './translations'
import Main from './components/main'
import {convertToMap, update} from './utils/maps'
import {t, language} from './utils/i18n'
import {createCssNamespace} from './utils/css'

function getElement(config) {
    const {elementID: id, stylePrefix} = config
    var element = document.getElementById(id)
    if (element === null) {
        element = document.createElement('div')
        element.id = id
        document.body.insertBefore(element, document.body.firstChild)
    }
    var child = document.querySelector(`.${stylePrefix}-AppContainer`)
    if (child === null) {
        child = document.createElement('div')
        child.className = `${stylePrefix}-AppContainer`
        element.appendChild(child)
    }
    return document.querySelector(`.${stylePrefix}-AppContainer`)
}

function getTranslations(config) {
    const trans = new Map([])
    update(trans, convertToMap(translations))
    update(trans, convertToMap(config.translations))
    return trans
}

const managers = {}
function getManager(config) {
    const name = config.elementID
    if (managers[name] === undefined)
        managers[name] = new ConsentManager(config)
    return managers[name]
}

export const defaultConfig = {
    elementID: 'orejime',
    appElement: undefined,
    stylePrefix: 'orejime',
    cookieName: 'orejime',
    cookieExpiresAfterDays: 365,
    privacyPolicy: '',
    default: true,
    mustConsent: false,
    implicitConsent: false,
    logo: false,
    lang: language(),
    translations: {},
    apps: {},
    debug: false
}

export function init(conf) {
    const config = Object.assign({}, defaultConfig, conf)
    const errors = []
    if (!Object.keys(config.apps).length) {
        errors.push('  - you must define `apps` to manage')
    }
    if (!config.privacyPolicy.length) {
        errors.push('  - you must define a `privacyPolicy` url')
    }
    if (errors.length) {
        errors.unshift('Orejime config error:')
        console.error(errors.join('\n'))
        return
    }
    const element = getElement(config)
    const trans = getTranslations(config)
    const manager = getManager(config)
    const tt = (...args) => {return t(trans, config.lang, config.debug, ...args)}
    const app = render(
        <Main t={tt}
            ns={createCssNamespace(config.stylePrefix)}
            manager={manager}
            config={config}
        />,
        element
    )
    return {
        show: app.showModal.bind(app),
        internals: {
            react: app,
            manager: manager,
            config: config
        }
    }
}

export default {
    init,
    defaultConfig
};
