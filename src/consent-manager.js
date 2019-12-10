import {getCookie, getCookies, setCookie, deleteCookie} from 'utils/cookies'
import {getDataAttr, getDataAttrs, setDataAttr} from "utils/data-attributes"

export default class ConsentManager {

    constructor(config){
        this.config = config // the configuration
        this.consents = this.defaultConsents // the consent states of the configured apps
        this.confirmed = false // true if the user actively confirmed his/her consent
        this.changed = false // true if the app config changed compared to the cookie
        this.states = {} // keep track of the change (enabled, disabled) of individual apps
        this.executedOnce = {} //keep track of which apps have been executed at least once
        this.watchers = new Set([])
        this.loadConsents()
        this.applyConsents()
    }

    get cookieName(){
        return this.config.cookieName || 'klaro'
    }

    watch(watcher){
        if (!this.watchers.has(watcher))
            this.watchers.add(watcher)
    }

    unwatch(watcher){
        if (this.watchers.has(watcher))
            this.watchers.delete(watcher)
    }

    notify(name, data){
        this.watchers.forEach((watcher) => {
            watcher.update(this, name, data)
        })
    }

    getApp(name){
        const matchingApps = this.config.apps.filter(app=>app.name === name)
        if (matchingApps.length > 0)
            return matchingApps[0]
        return undefined
    }

    getDefaultConsent(app){
        let consent = app.default
        if (consent === undefined)
            consent = this.config.default
        if (consent === undefined)
            consent = false
        return consent
    }

    get defaultConsents(){
        const consents = {}
        const apps = this.config.apps
        for(var i = 0, l = apps.length; i <l; i++) {
            const app = apps[i]
            consents[app.name] = this.getDefaultConsent(app)
        }
        return consents
    }

    //don't decline required apps
    declineAll(){
        this.config.apps.map((app) => {
            if(app.required || this.config.required) {
                this.updateConsent(app.name, true)
            } else {
                this.updateConsent(app.name, false)
            }
        })
    }

    updateConsent(name, value){
        this.consents[name] = value
        this.notify('consents', this.consents)
    }

    resetConsent(){
        this.consents = this.defaultConsents
        this.confirmed = false
        this.applyConsents()
        deleteCookie(this.cookieName)
        this.notify('consents', this.consents)
    }

    getConsent(name){
        return this.consents[name] || false
    }

    _checkConsents(){
        let complete = true
        const apps = new Set(this.config.apps.map((app)=>{return app.name}))
        const consents = new Set(Object.keys(this.consents))
        for (let key of Object.keys(this.consents)) {
            if (!apps.has(key)) {
                delete this.consents[key]
            }
        }
        for (let app of this.config.apps) {
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
        let cookieValue
        if (consentCookie !== null) {
            // avoid syntax error on older browsers
            cookieValue = consentCookie.value || ""
            this.consents = (cookieValue !== "") ? JSON.parse(cookieValue) : {};
            this._checkConsents()
            this.notify('consents', this.consents)
        }
        return this.consents
    }

    saveAndApplyConsents(){
        this.saveConsents()
        this.applyConsents()
    }

    saveConsents(){
        let consents = this.consents
        if (consents === null)
            deleteCookie(this.cookieName)
        // avoid syntax error on older browsers
        let cookieValue = consents !== null ? JSON.stringify(consents) : ""
        setCookie(this.cookieName, cookieValue, this.config.cookieExpiresAfterDays || 120)
        this.confirmed = true
        this.changed = false
    }

    applyConsents(){
        for(var i=0;i<this.config.apps.length;i++){
            const app = this.config.apps[i]
            const state = this.states[app.name]
            const optOut = (app.optOut !== undefined ? app.optOut : (this.config.optOut || false))
            const required = (app.required !== undefined ? app.required : (this.config.required || false))
            //opt out and required apps are always treated as confirmed
            const confirmed = this.confirmed || optOut || required
            const consent = this.getConsent(app.name) && confirmed
            if (state === consent)
                continue
            this.updateAppElements(app, consent)
            this.updateAppCookies(app, consent)
            // callback must be a function
            if (typeof app.callback === "function")
                app.callback(consent, app)
            this.states[app.name] = consent
        }
    }

    updateAppElements(app, consent){

        // we make sure we execute this app only once if the option is set
        if (consent){
            if (app.onlyOnce && this.executedOnce[app.name])
                return
            this.executedOnce[app.name] = true
        }

        const elements = document.querySelectorAll("[data-name='"+app.name+"']")

        let i, k, l, m, attrs, val

        for (i = 0, l = elements.length; i < l; i++) {
            const element = elements[i]

            // get all data-attributes (IE <= 10 does not handle dataset)
            const dataset = getDataAttrs(element)

            // if no consent was given we disable this tracker
            // we remove and add it again to trigger a re-execution

            if (element.tagName === 'SCRIPT') {
                // parent element is only needed on scripts
                const parent = element.parentElement

                // we create a new script instead of updating the node in
                // place, as the script won't start correctly otherwise
                const newElement = document.createElement('script')

                for (let key in dataset) {
                    if (dataset.hasOwnProperty(key)) {
                        // set data-attributes with Element.setAttribute
                        // because on IE <= 10 Element.dataset results in errors
                        setDataAttr(newElement, key, dataset[key]);
                    }
                }

                // use an array and loop:
                // results in smaller file-size and makes it easier to maintain
                attrs = 'innerText text class id name defer async charset'.split(' ');
                for (k = 0, m = attrs.length; k < m; k++) {
                    if ((val = element[attrs[k]]))
                        newElement[attrs[k]] = val
                }

                // Element.style
                newElement.style.cssText = element.style

                // if no consent given
                newElement.type = 'opt-in'

                // if consent given
                if (consent) {
                    if (dataset.type !== undefined) {
                        newElement.type = dataset.type
                    }
                    if (dataset.src !== undefined) {
                        newElement.src = dataset.src
                    }
                }

                // we remove the original element and insert a new one
                parent.insertBefore(newElement, element)
                parent.removeChild(element)
            }


            else {
                // all other elements (images etc.) are modified in place...
                attrs = 'href src'.split(' ')

                if (consent) {
                    for (k = 0, m = attrs.length; k < m; k++) {
                        if (dataset[attrs[k]] === undefined)
                            continue
                        if (dataset["original-" + attrs[k]] === undefined)
                            dataset["original-" + attrs[k]] = element[attrs[k]]
                        element[attrs[k]] = dataset[attrs[k]];
                    }
                    if (dataset.title !== undefined)
                        element.title = dataset.title
                    if (dataset["original-display"] !== undefined)
                        element.style.display = dataset["original-display"]
                }

                else {
                    if (dataset.title !== undefined)
                        element.removeAttribute('title')
                    if (dataset.hide === "true"){
                        if (dataset["original-display"] === undefined)
                            dataset["original-display"] = element.style.display
                        element.style.display = 'none'
                    }
                    for (k = 0, m = attrs.length; k < m; k++) {
                        if (dataset[attrs[k]] === undefined)
                            continue
                        if (dataset['original-'+attrs[k]] !== undefined)
                            element[attrs[k]] = dataset['original-'+attrs[k]]
                    }
                }
            }
        }

    }

    updateAppCookies(app, consent){

        if (consent)
            return

        function escapeRegexStr(str) {
            return str.replace(/[\-\[\]\/{}()*+?.\\^$|]/g, "\\$&");
        }

        if (app.cookies !== undefined && app.cookies.length > 0) {
            const cookies = getCookies()
            for (let i = 0, l = app.cookies.length; i < l; i++) {
                let cookiePattern = app.cookies[i]
                let cookiePath, cookieDomain
                if (cookiePattern instanceof Array) {
                    [cookiePattern, cookiePath, cookieDomain] = cookiePattern
                }
                if (!(cookiePattern instanceof RegExp)) {
                    cookiePattern = new RegExp('^'+escapeRegexStr(cookiePattern)+'$')
                }
                for (let j=0, m = cookies.length; j< m; j++) {
                    const cookie = cookies[j]
                    const match = cookiePattern.exec(cookie.name)
                    if (match !== null) {
                        console.debug("Deleting cookie:", cookie.name,
                                      "Matched pattern:", cookiePattern,
                                      "Path:", cookiePath,
                                      "Domain:", cookieDomain)
                        deleteCookie(cookie.name, cookiePath, cookieDomain)
                    }
                }
            }
        }

    }

}
