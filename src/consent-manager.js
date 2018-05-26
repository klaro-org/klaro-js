import {getCookie, setCookie, deleteCookie} from 'helpers'

export default class ConsentManager {

    constructor(config){
        this.config = config
    }

    get cookieName(){
        return this.config.cookieName || 'consent-cookie'
    }

    agreeToCookies(){
        setCookie(this.cookieName, "accepted", 120)
    }

    loadConsent(){
        const consent = getCookie(this.cookieName)
        if (consent !== null)
            return JSON.parse(consent.value)
        return null
    }
    
    saveConsent(){
        const v = JSON.stringify({'a' : ['foo', 'bar', 'bau'], 'd' : ['a', 'b', 'c']})
        setCookie(this.cookieName, v, 120)
    }
    
    updateAppCookies(){
        const cookies = getCookies()
        for (var i = 0; i < cookies.length; i++){
            const cookie = cookies[i]
            eraseCookie(cookie.name)
        }
    }

    updateApps(){
        var scripts = document.getElementsByTagName("script")
        for(var i=0;i<scripts.length;i++){
            var script = scripts[i]
            var parent = script.parentElement
            //we remove and add it again to trigger a re-execution
            if (script.type == "text/javascript-opt-in"){
                parent.removeChild(script)
                script.type = "text/javascript"
                parent.appendChild(script)
            }
        }
    }
    
}
