import { version } from "../lib"

function formatParams( params ){
    return "?" + Object
        .keys(params)
        .map(function(key){
            return key+"="+encodeURIComponent(params[key])
        })
        .join("&")
}

export default class KlaroApi {
    constructor(url, id, token){
        this.url = url
        this.id = id
        this.token = token
    }

    getLocationData(config){
        const recordsConfig = config.records || {}
        const savePathname = recordsConfig.savePathname !== undefined ? recordsConfig.savePathname : true
        return {
            pathname: savePathname ? location.pathname : undefined,
            port: location.port !== "" ? parseInt(location.port) : 0,
            hostname: location.hostname,
            protocol: location.protocol.slice(0, location.protocol.length-1),
        }
    }

    getUserData(){
        return {
            client_version: version(),
            client_name: 'klaro:web',
        }
    }

    getBaseConsentData(config){
        return {
            location_data: this.getLocationData(config),
            user_data: this.getUserData(config),
        }
    }

    update(notifier, name, data){
        if (name === 'saveConsents'){
            if (data.type === 'save' && Object.keys(data.changes).length === 0)
                return; // save event with no changes
            const consentData = {
                ...this.getBaseConsentData(notifier.config),
                consent_data: {
                    consents: data.consents,
                    changes: data.type === 'save' ? data.changes : undefined,
                    type: data.type,
                    config: notifier.config.id,
                },
            }
            this.submitConsentData(consentData)
        } else if (name === 'showNotice'){
            const consentData = {
                ...this.getBaseConsentData(data.config),
                consent_data: {
                    consents: {},
                    changes: {},
                    type: 'show',
                    config: data.config.id,
                },
            }
            this.submitConsentData(consentData)
        }
    }

    apiRequest(type, path, data, contentType){
        return new Promise(
            (resolve, reject) => {

                const xhr = new XMLHttpRequest();


                xhr.addEventListener("load", () => {
                    const data = JSON.parse(xhr.response)
                    if (xhr.status < 200 || xhr.status >= 300){
                        data.status = xhr.status
                        // the request wasn't successful
                        reject(data)
                    } else {
                        // the request was successful
                        resolve(data)
                    }
                })

                xhr.addEventListener("error", () => {
                    // something else went wrong (e.g. request got blocked)
                    reject({status: 0, xhr: xhr})
                })

                let body

                if (data !== undefined){
                    if (type === 'GET'){
                        path += '?' + formatParams(data)
                    } else {
                        body = JSON.stringify(data)
                    }
                }

                xhr.open(type, this.url+path);

                if (body !== undefined){
                    // we must call setRequestHeader after 'open'
                    xhr.setRequestHeader("Content-Type", contentType || "application/json;charset=UTF-8")

                }

                xhr.send(body);
            })

    }

    submitConsentData(consentData){
        return this.apiRequest("POST", "/v1/consent-managers/"+this.id+"/submit", consentData, "text/plain;charset=UTF-8")
    }

    /*
    Load a specific Klaro config from the API.
    */
    loadConfig(name){
        return this.apiRequest("GET", "/v1/consent-managers/"+this.id+"/config.json?name="+name)
    }

    /*
    Load Klaro configs from the API.
    */
    loadConfigs(){
        return this.apiRequest("GET", "/v1/consent-managers/"+this.id+"/configs.json")
    }
}
