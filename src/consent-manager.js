import {getCookie, getCookies, setCookie, deleteCookie} from 'utils/cookies'

export default class ConsentManager {

    constructor(config){
        this.config = config
        this.consents = this.defaultConsents
        this.consented = false
        this.loadConsents()
        if (this.consented || this.config.optOut)
            this.applyConsents()
    }

    get cookieName(){
        return this.config.cookieName || 'consent-cookie'
    }

    getApp(name){
        const matchingApps = this.config.apps.filter((app)=>{return app.name == name})
        if (matchingApps.length > 0)
            return matchingApps[0]
        return undefined
    }

    get defaultConsents(){
        const consents = {}
        for(var i=0;i<this.config.apps.length;i++){
            const app = this.config.apps[i]
            let consent = app.default
            if (consent === undefined)
                consent = this.config.appDefault
            if (consent === undefined)
                consent = false
            consents[app.name] = consent
        }
        return consents
    }

    updateConsent(name, value){
        this.consents[name] = value
    }

    resetConsent(){
        deleteCookie(this.cookieName)
    }

    getConsent(name){
        return this.consents[name] || false
    }

    loadConsents(){
        const consentCookie = getCookie(this.cookieName)
        if (consentCookie !== null){
            this.consented = true
            this.consents = JSON.parse(consentCookie.value)
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
        this.consented = true
    }

    applyConsents(){
        for(var i=0;i<this.config.apps.length;i++){
            const app = this.config.apps[i]
            const consent = this.getConsent(app.name)
            this.updateAppElements(app, consent)
            this.updateAppCookies(app, consent)
            if (app.callback !== undefined)
                app.callback(consent, app)
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

            const newElement = element.cloneNode(true)
            if (consent){
                if (src !== undefined)
                    newElement.src = src
                if (type !== undefined)
                    newElement.type = type
            }
            else{
                delete newElement.src
                newElement.type = "opt-in"
            }
            //we remove the original element and insert a new one
            parent.insertBefore(newElement, element)
            parent.removeChild(element)
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