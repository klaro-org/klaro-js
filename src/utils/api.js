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

    update(notifier, name, data){
        if (name === 'saveConsents'){
            const consentData = {
                version: 1,
                consent_data: {
                    consents: data.consents,
                    type: data.type,
                    config: notifier.config.name || 'default',
                },
                user_data: {},
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
    Load Klaro configs from the API.
    */
    loadConfigs(){
        return this.apiRequest("GET", "/v1/consent-managers/"+this.id+"/configs.json")
    }
}
