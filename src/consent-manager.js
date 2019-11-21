import {getCookie, getCookies, setCookie, deleteCookie} from 'utils/cookies'
import {getDataAttr, getDataAttrs} from "utils/data-attributes"

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
        var cookieValue
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
        var v = this.consents
        if (v === null)
            deleteCookie(this.cookieName)
        v = v !== null ? JSON.stringify(this.consents) : ""
        setCookie(this.cookieName, v, this.config.cookieExpiresAfterDays || 120)
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

        var i, k, l, attrs, attr, val

        for (i = 0, l = elements.length; i < l; i++) {
            const element = elements[i]
            const parent = element.parentElement
            const dataset = getDataAttrs(element)

            // if no consent was given we disable this tracker
            // we remove and add it again to trigger a re-execution

            if (element.tagName === 'SCRIPT') {
                // we create a new script instead of updating the node in
                // place, as the script won't start correctly otherwise
                const newElement = document.createElement('script')

                for (k in dataset) {
                    if (dataset.hasOwnProperty(k)) {
                        newElement.setAttribute(k, dataset[k])
                    }
                }
                newElement.type = 'opt-in'
                newElement.style.cssText = element.style

                attrs = 'innerText text class id name defer async charset'.split(' ');
                for (k = 0; k < attrs.length; k++) {
                    attr = attrs[k]
                    newElement[attrs[k]] = element[attrs[k]]
                }

                if (consent) {
                    if ((val = getDataAttr(element, 'type'))) {
                        newElement.type = val
                    }
                    if ((val = getDataAttr(element, 'src'))) {
                        newElement.src = val
                    }
                }

                // we remove the original element and insert a new one
                parent.insertBefore(newElement, element)
                parent.removeChild(element)
            }

            else {
                attrs = 'href src title display'.split(' ')

                // all other elements (images etc.) are modified in place...
                if (consent) {
                    for (k = 0; k < attrs.length; k++) {
                        attr = attrs[k];
                        if (attr === 'display') {
                            element.style.display = getDataAttr(element, attr) || ""
                        }
                        else {
                            if ((val = getDataAttr(element, attr))) {
                                element.setAttribute(attr, val)
                            }
                        }
                    }
                }

                else {
                    for (k = 0; k < attrs.length; k++) {
                        attr = attrs[k];
                        switch (attr) {
                            case 'title':
                                if (getDataAttr(element, attr)) {
                                    element.removeAttribute(attr);
                                }
                                continue;
                            case 'display':
                                if (getDataAttr(element, 'hide') === 'true') {
                                    if (!getDataAttr(element, attr)) {
                                        element.setAttribute('data-'+attr, element.style[attr]);
                                    }
                                    element.style[attr] = 'none'
                                }
                                continue;
                            default:
                                if ((val = getDataAttr(element, attr))) {
                                    element[attr] = val
                                }
                        }
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

        if (app.cookies !== undefined && app.cookies.length > 0){
            const cookies = getCookies()
            for(var i=0;i<app.cookies.length;i++){
                let cookiePattern = app.cookies[i]
                let cookiePath, cookieDomain
                if (cookiePattern instanceof Array){
                    [cookiePattern, cookiePath, cookieDomain] = cookiePattern
                }
                if (!(cookiePattern instanceof RegExp)){
                    cookiePattern = new RegExp('^'+escapeRegexStr(cookiePattern)+'$')
                }
                for(var j=0;j<cookies.length;j++){
                    const cookie = cookies[j]
                    const match = cookiePattern.exec(cookie.name)
                    if (match !== null){
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
