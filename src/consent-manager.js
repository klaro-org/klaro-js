import {getCookie, getCookies, setCookie, deleteCookie} from 'utils/cookies'

export default class ConsentManager {

    constructor(config){
        this.config = config // the configuration
        this.consents = this.defaultConsents // the consent states of the configured apps
        this.confirmed = false // true if the user actively confirmed his/her consent
        this.changed = false // true if the app config changed compared to the cookie
        this.states = {} // keep track of the change (enabled, disabled) of individual apps
        this.executedOnce = {} //keep track of which apps have been executed at least once
        this.loadConsents()
        this.applyConsents()
    }

    get cookieName(){
        return this.config.cookieName || 'klaro'
    }

    getApp(name){
        const matchingApps = this.config.apps.filter((app)=>{return app.name == name})
        if (matchingApps.length > 0)
            return matchingApps[0]
        return undefined
    }

    getDefaultConsent(app){
        let consent = app.default
        if (consent === undefined)
            consent = this.config.appDefault
        if (consent === undefined)
            consent = false
        return consent
    }

    get defaultConsents(){
        const consents = {}
        for(var i=0;i<this.config.apps.length;i++){
            const app = this.config.apps[i]
            consents[app.name] = this.getDefaultConsent(app)
        }
        return consents
    }

    updateConsent(name, value){
        this.consents[name] = value
    }

    resetConsent(){
        this.consents = this.defaultConsents
        this.confirmed = false
        this.applyConsents()
        deleteCookie(this.cookieName)
    }

    getConsent(name){
        return this.consents[name] || false
    }

    checkConsents(){
        let complete = true
        const apps = new Set(this.config.apps.map((app)=>{return app.name}))
        const consents = new Set(Object.keys(this.consents))
        for(var key of Object.keys(this.consents)){
            if (!apps.has(key)){
                delete this.consents[key]
            }
        }
        for(var app of this.config.apps){
            if (!consents.has(app.name)){
                this.consents[app.name] = this.getDefaultConsent(app)
                complete = false
            }
        }
        this.confirmed = complete
        if (!complete)
            this.changed = true
    }

    loadConsents(){
        const consentCookie = getCookie(this.cookieName)
        if (consentCookie !== null){
            this.consents = JSON.parse(consentCookie.value)
            this.checkConsents()
        }
        return this.consents
    }

    saveAndApplyConsents(){
        this.saveConsents()
        this.applyConsents()
    }
    
    saveConsents(){
        if (this.consents === null)
            deleteCookie(this.cookieName)
        const v = JSON.stringify(this.consents)
        setCookie(this.cookieName, v, 120)
        this.confirmed = true
        this.changed = false
    }

    applyConsents(){
        for(var i=0;i<this.config.apps.length;i++){
            const app = this.config.apps[i]
            const state = this.states[app.name]
            const confirmed = this.confirmed || (app.optOut !== undefined ? app.optOut : (this.config.optOut || false))
            const consent = this.getConsent(app.name) && confirmed
            if (state === consent)
                continue
            // this app was already executed once and should not be executed more than that
            if (app.onlyOnce && this.executedOnce[app.name])
                continue
            if (consent === true)
                this.executedOnce[app.name] = true
            this.updateAppElements(app, consent)
            this.updateAppCookies(app, consent)
            if (app.callback !== undefined)
                app.callback(consent, app)
            this.states[app.name] = consent
        }
    }

    updateAppElements(app, consent){
        const elements = document.querySelectorAll("[data-name='"+app.name+"']")
        for(var i=0;i<elements.length;i++){
            const element = elements[i]

            const parent = element.parentElement
            const name = element.dataset.name
            const src = element.dataset.src
            const type = element.dataset.type

            //if no consent was given we disable this tracker
            //we remove and add it again to trigger a re-execution

            if (element.tagName == 'SCRIPT'){
                // we create a new script instead of updating the node in
                // place, as the script won't start correctly otherwise
                const newElement = document.createElement('script')
                for(var key of Object.keys(element.dataset)){
                    newElement.dataset[key] = element.dataset[key]
                }
                newElement.type = 'opt-in'
                newElement.innerText = element.innerText
                newElement.text = element.text
                newElement.class = element.class
                newElement.style = element.style
                newElement.id = element.id
                newElement.name = element.name
                newElement.defer = element.defer
                newElement.async = element.async

                if (consent){
                    newElement.type = type
                    if (src !== undefined)
                        newElement.src = src
                }
                //we remove the original element and insert a new one
                parent.insertBefore(newElement, element)
                parent.removeChild(element)
            } else {
                // all other elements (images etc.) are modified in place...
                if (consent){
                    if (element.dataset.originalSrc === undefined)
                        element.dataset.originalSrc = element.src
                    if (element.dataset.title !== undefined)
                        element.title = element.dataset.title
                    if (element.dataset.originalDisplay !== undefined)
                        element.style.display = element.dataset.originalDisplay
                    element.src = src
                }
                else{
                    if (element.dataset.title !== undefined)
                        element.removeAttribute('title')
                    if (element.dataset.hide === "true"){
                        if (element.dataset.originalDisplay === undefined)
                            element.dataset.originalDisplay = element.style.display
                        element.style.display = 'none'
                    }
                    if (element.dataset.originalSrc !== undefined)
                        element.src = element.dataset.originalSrc
                }
            }
         }
        
    }

    updateAppCookies(app, consent){

        if (consent === true)
            return

        function escapeRegexStr(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }

        if (app.cookies !== undefined && app.cookies.length > 0){
            const cookies = getCookies()
            for(var i=0;i<app.cookies.length;i++){
                let cookiePattern = app.cookies[i]
                if (!(cookiePattern instanceof RegExp)){
                    cookiePattern = new RegExp('^'+escapeRegexStr(cookiePattern)+'$')
                }
                for(var j=0;j<cookies.length;j++){
                    const cookie = cookies[j]
                    const match = cookiePattern.exec(cookie.name)
                    if (match !== null){
                        deleteCookie(cookie.name)
                    }
                }
            }
        }

    }
    
}