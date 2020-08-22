import {getCookies, deleteCookie} from 'utils/cookies'
import {dataset, applyDataset} from 'utils/compat'
import stores from 'stores'

export default class ConsentManager {

    constructor(config){
        this.config = config // the configuration

        this.store = new stores[this.storageMethod](this)

        // we fall back to the cookie-based store if the store is undefined
        if (this.store === undefined)
            this.store = stores['cookie']

        this.consents = this.defaultConsents // the consent states of the configured apps
        this.confirmed = false // true if the user actively confirmed his/her consent
        this.changed = false // true if the app config changed compared to the cookie
        this.states = {} // keep track of the change (enabled, disabled) of individual apps
        this.executedOnce = {} //keep track of which apps have been executed at least once
        this.watchers = new Set([])
        this.loadConsents()
        this.applyConsents()
        this.savedConsents = {...this.consents}
    }

    get storageMethod(){
        return this.config.storageMethod || 'cookie'
    }

    get storageName(){
        return this.config.storageName || this.config.cookieName || 'klaro' // deprecated: cookieName
    }

    get cookieDomain(){
        return this.config.cookieDomain || undefined
    }

    get cookieExpiresAfterDays(){
        return this.config.cookieExpiresAfterDays || 120
    }

    get defaultConsents(){
        const consents = {}
        for(let i=0;i<this.config.apps.length;i++){
            const app = this.config.apps[i]
            consents[app.name] = this.getDefaultConsent(app)
        }
        return consents
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
        let consent = app.default || app.required
        if (consent === undefined)
            consent = this.config.default
        if (consent === undefined)
            consent = false
        return consent
    }

    changeAll(value){
        let changedApps = 0
        this.config.apps.map((app) => {
            if(app.required || this.config.required || value) {
                if (this.updateConsent(app.name, true))
                    changedApps++
            } else {
                if (this.updateConsent(app.name, false))
                    changedApps++
            }
        })
        return changedApps
    }

    updateConsent(name, value){
        const changed = (this.consents[name] || false) !== value
        this.consents[name] = value
        this.notify('consents', this.consents)
        return changed
    }

    restoreSavedConsents(){
        this.consents = {...this.savedConsents}
        this.notify('consents', this.consents)
    }

    resetConsents(){
        this.consents = this.defaultConsents
        this.states = {}
        this.confirmed = false
        this.applyConsents()
        this.savedConsents = {...this.consents}
        this.store.delete()
        this.notify('consents', this.consents)
    }

    getConsent(name){
        return this.consents[name] || false
    }

    loadConsents(){
        const consentData = this.store.get();
        if (consentData !== null){
            this.consents = JSON.parse(decodeURIComponent(consentData))
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
        const v = encodeURIComponent(JSON.stringify(this.consents))
        this.store.set(v);
        this.confirmed = true
        this.changed = false
        this.savedConsents = {...this.consents}
        this.notify('saveConsents', this.consents)
    }

    applyConsents(dryRun){
        let changedApps = 0
        for(let i=0;i<this.config.apps.length;i++){
            const app = this.config.apps[i]
            const state = this.states[app.name]
            const optOut = (app.optOut !== undefined ? app.optOut : (this.config.optOut || false))
            const required = (app.required !== undefined ? app.required : (this.config.required || false))
            //opt out and required apps are always treated as confirmed
            const confirmed = this.confirmed || optOut || dryRun
            const consent = (this.getConsent(app.name) && confirmed) || required
            if (state === consent)
                continue
            changedApps++
            if (dryRun)
                continue
            this.updateAppElements(app, consent)
            this.updateAppCookies(app, consent)
            if (app.callback !== undefined)
                app.callback(consent, app)
            if (this.config.callback !== undefined)
                this.config.callback(consent, app)
            this.states[app.name] = consent
        }
        this.notify('applyConsents', changedApps)
        return changedApps
    }

    updateAppElements(app, consent){

        // we make sure we execute this app only once if the option is set
        if (consent){
            if (app.onlyOnce && this.executedOnce[app.name])
                return
            this.executedOnce[app.name] = true
        }

        const elements = document.querySelectorAll("[data-name='"+app.name+"']")
        for(let i=0;i<elements.length;i++){
            const element = elements[i]

            const parent = element.parentElement
            const ds = dataset(element)
            const {type} = ds
            const attrs = ['href', 'src']

            //if no consent was given we disable this tracker
            //we remove and add it again to trigger a re-execution

            if (element.tagName === 'SCRIPT'){
                // this element is already active, we do not touch it...
                if (element.type === type){
                    console.debug(`Skipping script for app ${app.name}, as it already has the correct type...`)
                    continue
                }
                // we create a new script instead of updating the node in
                // place, as the script won't start correctly otherwise
                const newElement = document.createElement('script')
                for(const attribute of element.attributes){
                    newElement.setAttribute(attribute.name, attribute.value)
                }

                newElement.innerText = element.innerText
                newElement.text = element.text

                if (consent){
                    newElement.type = type
                    if (ds.src !== undefined)
                        newElement.src = ds.src
                } else {
                    newElement.type = 'text/plain'
                }
                //we remove the original element and insert a new one
                parent.insertBefore(newElement, element)
                parent.removeChild(element)
            } else {
                // all other elements (images etc.) are modified in place...
                if (consent){
                    for(const attr of attrs){
                        const attrValue = ds[attr]
                        if (attrValue === undefined)
                            continue
                        if (ds['original-'+attr] === undefined)
                            ds['original-'+attr] = element[attr]
                        element[attr] = attrValue
                    }
                    if (ds.title !== undefined)
                        element.title = ds.title
                    if (ds['original-display'] !== undefined){
                        element.style.display = ds['original-display']
                    }
                }
                else{
                    if (ds.title !== undefined)
                        element.removeAttribute('title')
                    if (ds.hide === "true"){
                        if (ds['original-display'] === undefined)
                            ds['original-display'] = element.style.display
                        element.style.display = 'none'
                    }
                    for(const attr of attrs){
                        const attrValue = ds[attr]
                        if (attrValue === undefined)
                            continue
                        if (ds['original-'+attr] !== undefined)
                            element[attr] = ds['original-'+attr]
                    }
                }
                applyDataset(ds, element)
            }
        }

    }

    updateAppCookies(app, consent){

        if (consent)
            return

        function escapeRegexStr(str) {
            return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
        }

        if (app.cookies !== undefined && app.cookies.length > 0){
            const cookies = getCookies()
            for(let i=0;i<app.cookies.length;i++){
                let cookiePattern = app.cookies[i]
                let cookiePath, cookieDomain
                if (cookiePattern instanceof Array){
                    [cookiePattern, cookiePath, cookieDomain] = cookiePattern
                }
                if (!(cookiePattern instanceof RegExp)){
                    cookiePattern = new RegExp('^'+escapeRegexStr(cookiePattern)+'$')
                }
                for(let j=0;j<cookies.length;j++){
                    const cookie = cookies[j]
                    const match = cookiePattern.exec(cookie.name)
                    if (match !== null){
                        // eslint-disable-next-line no-console
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

    _checkConsents(){
        let complete = true
        const apps = new Set(this.config.apps.map((app)=>{return app.name}))
        const consents = new Set(Object.keys(this.consents))
        for(const key of Object.keys(this.consents)){
            if (!apps.has(key)){
                delete this.consents[key]
            }
        }
        for(const app of this.config.apps){
            if (!consents.has(app.name)){
                this.consents[app.name] = this.getDefaultConsent(app)
                complete = false
            }
        }
        this.confirmed = complete
        if (!complete)
            this.changed = true
    }

}
